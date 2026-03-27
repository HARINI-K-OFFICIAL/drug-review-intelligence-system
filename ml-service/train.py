import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from transformers import BertTokenizer
from bert_model import BertClassifier, BertRegressor
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
from tqdm import tqdm
import os
import re
import sys

# Force UTF-8 Output on Windows to prevent UnicodeEncodeError in tqdm
if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

class DrugReviewDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128, is_regression=False):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len
        self.is_regression = is_regression

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, item):
        text = str(self.texts[item])
        label = self.labels[item]

        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )
        
        # Ensure correct type for the PyTorch loss criteria
        if self.is_regression:
            tensor_label = torch.tensor(label, dtype=torch.float)
        else:
            tensor_label = torch.tensor(label, dtype=torch.long)

        return {
            'text': text,
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': tensor_label
        }

def clean_text_series(series):
    return series.astype(str).str.lower().replace(r'[^\w\s]', '', regex=True)

def train_classification_model(csv_path, text_col, label_col, num_classes, model_save_path, epochs=3, batch_size=2):
    print(f"\n--- Training Classification Model for '{label_col}' ---")
    try:
        print(f"Loading data from {csv_path}...")
        df = pd.read_csv(csv_path)
        if len(df) == 0:
            raise ValueError("Dataset is empty.")
            
        df[text_col] = clean_text_series(df[text_col])
        labels = df[label_col].astype(int).tolist()
        texts = df[text_col].tolist()
        
        print("Loading tokenizer...")
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        
        # Adjust test size for very small datasets to prevent empty splits
        test_size = 0.2 if len(df) > 10 else 0.5
        X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=test_size, random_state=42)
        
        train_dataset = DrugReviewDataset(X_train, y_train, tokenizer, is_regression=False)
        test_dataset = DrugReviewDataset(X_test, y_test, tokenizer, is_regression=False)
        
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
        
        # Evaluate on device
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {device}")
        
        model = BertClassifier(num_classes).to(device)
        optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
        criterion = nn.CrossEntropyLoss()
        
        print("Starting training loop...")
        for epoch in range(epochs):
            model.train()
            total_loss = 0
            
            # Explicit position to help tqdm in different terminals prevent silent hangs
            progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{epochs} [Train]", position=0, leave=True, ascii=True)
            for batch in progress_bar:
                optimizer.zero_grad()
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                b_labels = batch['labels'].to(device)
                
                outputs = model(input_ids, attention_mask)
                loss = criterion(outputs, b_labels)
                
                loss.backward()
                optimizer.step()
                
                total_loss += loss.item()
                progress_bar.set_postfix({'loss': f"{loss.item():.4f}"})
                
            avg_train_loss = total_loss / len(train_loader)
            
            # Evaluation
            model.eval()
            all_preds = []
            all_targets = []
            eval_loss = 0
            with torch.no_grad():
                for batch in test_loader:
                    input_ids = batch['input_ids'].to(device)
                    attention_mask = batch['attention_mask'].to(device)
                    b_labels = batch['labels'].to(device)
                    
                    outputs = model(input_ids, attention_mask)
                    loss = criterion(outputs, b_labels)
                    eval_loss += loss.item()
                    
                    _, preds = torch.max(outputs, dim=1)
                    all_preds.extend(preds.cpu().numpy())
                    all_targets.extend(b_labels.cpu().numpy())
            
            avg_eval_loss = eval_loss / len(test_loader)
            acc = accuracy_score(all_targets, all_preds)
            print(f"Epoch {epoch+1} Summary -> Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_eval_loss:.4f} | Val Accuracy: {acc*100:.2f}%")
            
        torch.save(model.state_dict(), model_save_path)
        print(f"✅ Model successfully saved to {model_save_path}")
        return acc

    except Exception as e:
        print(f"❌ Error during training classification model: {str(e)}")
        import traceback
        traceback.print_exc()

def train_regression_model(csv_path, text_col, rating_col, model_save_path, epochs=3, batch_size=2):
    print(f"\n--- Training Regression Model for '{rating_col}' ---")
    try:
        print(f"Loading data from {csv_path}...")
        df = pd.read_csv(csv_path)
        if len(df) == 0:
            raise ValueError("Dataset is empty.")
            
        df[text_col] = clean_text_series(df[text_col])
        ratings = df[rating_col].astype(float).tolist()
        texts = df[text_col].tolist()
        
        print("Loading tokenizer...")
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        
        test_size = 0.2 if len(df) > 10 else 0.5
        X_train, X_test, y_train, y_test = train_test_split(texts, ratings, test_size=test_size, random_state=42)
        
        train_dataset = DrugReviewDataset(X_train, y_train, tokenizer, is_regression=True)
        test_dataset = DrugReviewDataset(X_test, y_test, tokenizer, is_regression=True)
        
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
        
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {device}")
        
        model = BertRegressor().to(device)
        optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
        criterion = nn.MSELoss()
        
        print("Starting training loop...")
        for epoch in range(epochs):
            model.train()
            total_loss = 0
            progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{epochs} [Train]", position=0, leave=True, ascii=True)
            for batch in progress_bar:
                optimizer.zero_grad()
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                b_labels = batch['labels'].to(device)
                
                outputs = model(input_ids, attention_mask)
                loss = criterion(outputs, b_labels)
                
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
                progress_bar.set_postfix({'loss': f"{loss.item():.4f}"})
                
            avg_train_loss = total_loss / len(train_loader)
            
            # Evaluation
            model.eval()
            all_preds = []
            all_targets = []
            eval_loss = 0
            with torch.no_grad():
                for batch in test_loader:
                    input_ids = batch['input_ids'].to(device)
                    attention_mask = batch['attention_mask'].to(device)
                    b_labels = batch['labels'].to(device)
                    
                    outputs = model(input_ids, attention_mask)
                    loss = criterion(outputs, b_labels)
                    eval_loss += loss.item()
                    
                    all_preds.extend(outputs.cpu().numpy())
                    all_targets.extend(b_labels.cpu().numpy())
                    
            avg_eval_loss = eval_loss / len(test_loader)
            rmse = np.sqrt(mean_squared_error(all_targets, all_preds))
            print(f"Epoch {epoch+1} Summary -> Train MSE: {avg_train_loss:.4f} | Val MSE: {avg_eval_loss:.4f} | Val RMSE: {rmse:.4f}")
            
        torch.save(model.state_dict(), model_save_path)
        print(f"✅ Model successfully saved to {model_save_path}")
        return rmse

    except Exception as e:
        print(f"❌ Error during training regression model: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("🚀 Starting AI Training Pipeline...")

    # 🔹 Sentiment Classification
    sentiment_acc = train_classification_model(
        csv_path='data.csv',
        text_col='review',
        label_col='sentiment',
        num_classes=3,
        model_save_path='sentiment_model.pt',
        epochs=3, # Fewer epochs given extreme small size
        batch_size=2
    )

    # 🔹 Condition Classification
    condition_acc = train_classification_model(
        csv_path='data.csv',
        text_col='review',
        label_col='condition',
        num_classes=5,
        model_save_path='condition_model.pt',
        epochs=3, 
        batch_size=2
    )

    # 🔹 Rating Prediction (Regression)
    rating_rmse = train_regression_model(
        csv_path='data.csv',
        text_col='review',
        rating_col='rating',
        model_save_path='rating_model.pt',
        epochs=3,
        batch_size=2
    )

    # Print Final Summary
    print("\n" + "="*40)
    print("🎯 FINAL TRAINING SUMMARY")
    print("="*40)
    if sentiment_acc is not None:
        print(f"Sentiment Model Accuracy : {sentiment_acc*100:.2f}% (Saved: sentiment_model.pt)")
    if condition_acc is not None:
        print(f"Condition Model Accuracy : {condition_acc*100:.2f}% (Saved: condition_model.pt)")
    if rating_rmse is not None:
        print(f"Rating Model RMSE        : {rating_rmse:.4f} (Saved: rating_model.pt)")
    print("========================================")
    print("✅ ALL MODELS TRAINED SUCCESSFULLY!")
