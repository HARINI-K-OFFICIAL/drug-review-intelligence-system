import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Pill, Star, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/ui/AnimatedCard';

const API_BASE = 'http://localhost:5000/api';

const DrugExplorer = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('All Conditions');

  const conditions = ['All Conditions', 'Pain', 'Bacterial Infection', 'High Blood Pressure', 'DiabetesType2'];

  useEffect(() => {
    const fetchDrugs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (conditionFilter !== 'All Conditions') params.append('condition', conditionFilter);

        // Fetch from backend
        const res = await axios.get(`${API_BASE}/drugs?${params.toString()}`);
        setDrugs(res.data.drugs);
      } catch (err) {
        setError('Failed to load real data. Using robust fallback mock network data.');
        // Fallback for UI if backend is not running
        setDrugs([
          { _id: '1', name: 'Ibuprofen', condition: 'Pain', averageRating: 4.5, totalReviews: 120 },
          { _id: '2', name: 'Amoxicillin', condition: 'Bacterial Infection', averageRating: 4.0, totalReviews: 85 },
          { _id: '3', name: 'Lisinopril', condition: 'High Blood Pressure', averageRating: 3.8, totalReviews: 45 },
          { _id: '4', name: 'Metformin', condition: 'DiabetesType2', averageRating: 4.2, totalReviews: 200 },
        ].filter(d => 
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          (conditionFilter === 'All Conditions' || d.condition === conditionFilter)
        ));
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchDrugs();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, conditionFilter]);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Drug Explorer</h1>
        <p className="text-gray-500 dark:text-gray-400">Search for medications and view their aggregated AI-predicted sentiments.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-colors shadow-sm"
            placeholder="Search drugs by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-colors appearance-none shadow-sm cursor-pointer"
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            {conditions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
             <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
          </div>
        </div>
      </div>

      {error && !loading && (
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3 text-amber-600 dark:text-amber-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : drugs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drugs.map((drug, idx) => (
            <AnimatedCard key={drug._id} delay={idx * 0.05} className="group cursor-pointer hover:border-indigo-500/50">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {drug.averageRating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{drug.name}</h3>
                
                <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full mb-6">
                  {drug.condition}
                </div>
                
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Reviews Analyzed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{drug.totalReviews || 0}</span>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <Pill className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default DrugExplorer;
