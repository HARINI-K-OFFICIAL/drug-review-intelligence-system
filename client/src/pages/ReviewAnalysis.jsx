import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Activity, Star, Stethoscope, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from '../components/ui/AnimatedCard';

const API_BASE = 'http://localhost:5000/api';

const ReviewAnalysis = () => {
  const [reviewText, setReviewText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!reviewText.trim()) return;
    setAnalyzing(true);
    setResults(null);
    
    try {
      const response = await axios.post(`${API_BASE}/reviews/analyze`, { reviewText });
      
      setResults({ 
        sentiment: response.data.sentiment, 
        rating: response.data.rating, 
        condition: response.data.condition, 
        textLength: reviewText.length 
      });

    } catch (err) {
      console.error("Error analyzing review:", err);
      // Optional fallback object to ensure UI doesn't crash completely
      setResults({ sentiment: "Error", rating: 0, condition: "Try again", textLength: 0 });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          AI Review Analysis
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Paste a patient review below and let our NLP models extract sentiment, predict ratings, and infer medical conditions.
        </p>
      </div>

      <AnimatedCard className="p-1 mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl" noHover>
        <div className="bg-white dark:bg-gray-900 rounded-[1.4rem] p-6 sm:p-8 outline outline-1 outline-transparent">
          <textarea
            className="w-full h-40 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border-none resize-none focus:ring-0 text-lg leading-relaxed"
            placeholder="E.g., I've been taking this medication for my chronic back pain for 2 weeks. It worked wonders the first few days, but then I started getting severe nausea..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-400">
              {reviewText.length} characters
            </span>
            <button
              onClick={handleAnalyze}
              disabled={!reviewText.trim() || analyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                !reviewText.trim() || analyzing
                  ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 hover:-translate-y-0.5'
              }`}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing NLP...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Extract Insights
                </>
              )}
            </button>
          </div>
        </div>
      </AnimatedCard>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Sentiment Result */}
            <AnimatedCard className="p-6 text-center border-t-4 border-t-indigo-500">
              <div className="inline-flex p-3 rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-4">
                <Activity className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Predicted Sentiment</p>
              <h3 className={`text-2xl font-bold ${
                results.sentiment === 'Positive' ? 'text-emerald-500' :
                results.sentiment === 'Negative' ? 'text-red-500' : 'text-amber-500'
              }`}>
                {results.sentiment}
              </h3>
            </AnimatedCard>

            {/* Rating Result */}
            <AnimatedCard className="p-6 text-center border-t-4 border-t-amber-500" delay={0.1}>
              <div className="inline-flex p-3 rounded-full bg-amber-50 dark:bg-amber-500/10 mb-4">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Approximate Rating</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.rating.toFixed(1)} <span className="text-lg text-gray-400">/ 5.0</span>
              </h3>
            </AnimatedCard>

            {/* Condition Result */}
            <AnimatedCard className="p-6 text-center border-t-4 border-t-purple-500" delay={0.2}>
              <div className="inline-flex p-3 rounded-full bg-purple-50 dark:bg-purple-500/10 mb-4">
                <Stethoscope className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Inferred Condition</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.condition}
              </h3>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewAnalysis;
