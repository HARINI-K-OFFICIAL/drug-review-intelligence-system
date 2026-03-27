import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI Medical Assistant. I have analyzed thousands of drug reviews. Ask me anything about medications, side effects, or conditions.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const userMsg = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let reply = "I'm a mock AI responding for the hybrid architecture demo. Your query has been received!";
      if (userMsg.includes('headache')) reply = "For headaches, Ibuprofen is commonly used, with an average rating of 6.8 based on our NLP analysis.";
      if (userMsg.includes('acne')) reply = "Isotretinoin has an 8.2 rating for severe acne, but many reviews mention dryness as a side effect.";
      
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto py-10 h-[80vh] flex flex-col">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold">AI Assistant</h2>
        <p className="text-gray-500 dark:text-gray-400">Powered by the Drug Review Intelligence Engine</p>
      </div>

      <div className="flex-grow glass-card p-4 overflow-y-auto mb-4 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-indigo-500 text-white'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[70%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a drug or condition..." 
          className="input-field pr-12 py-4"
        />
        <button type="submit" className="absolute right-2 top-2 bottom-2 aspect-square bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center transition-colors">
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
};

export default Chat;
