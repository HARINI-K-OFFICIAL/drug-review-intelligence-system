import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drug: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug', required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10, required: true },
    sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'] },
    predictedCondition: { type: String },
    date: { type: Date, default: Date.now },
    isHelpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
