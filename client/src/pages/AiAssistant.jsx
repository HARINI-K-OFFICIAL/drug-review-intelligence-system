import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm your Drug Intelligence AI. You can ask me about medication efficacy, sentiment analysis trends, or specific drug interactions. How can I help you today?",
    }
  ]);
  const [inputTitle, setInputTitle] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: 'user', text: inputTitle };
    setMessages(prev => [...prev, userMessage]);
    setInputTitle('');
    setIsTyping(true);

    // Mock API processing
    setTimeout(() => {
      let botText = "I analyze large volumes of drug reviews to provide these insights. Based on the data, that medication generally exhibits positive sentiment regarding efficacy, though some users report mild fatigue.";
      
      const lower = userMessage.text.toLowerCase();
      if (lower.includes('headache') || lower.includes('migraine')) {
        botText = "For headaches, the dataset indicates Ibuprofen has a high efficacy rating (4.5/5) but Acetaminophen is preferred by users with sensitive stomachs. Which one would you like more details on?";
      } else if (lower.includes('negative') || lower.includes('bad')) {
        botText = "We found that approximately 15% of reviews for that class of drugs contain negative sentiment, primarily focused on gastrointestinal side-effects rather than lack of efficacy.";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: botText }]);
      setIsTyping(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto rounded-3xl overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800 shadow-2xl">
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Intelligence Assistant <Sparkles className="w-4 h-4 text-indigo-500" />
          </h2>
          <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex-shrink-0 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                
                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-2 max-w-[80%]"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex-shrink-0 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-sm flex gap-1.5 items-center h-[52px]">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white shadow-inner transition-all"
            placeholder="Ask about drug interactions, side effects..."
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputTitle.trim() || isTyping}
            className="absolute right-2 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white transition-all shadow-md shadow-indigo-500/20 disabled:shadow-none"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </form>
        <div className="text-center mt-3 text-xs text-gray-400 dark:text-gray-500">
          AI generated responses are for informational purposes. Consult a doctor for medical advice.
        </div>
      </div>
      
    </div>
  );
};

export default AiAssistant;
