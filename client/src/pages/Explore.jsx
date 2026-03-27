import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const mockDrugs = [
  { id: 1, name: 'Sertraline', condition: 'Depression', rating: 7.5, reviews: 1450, sentiment: 'Positive' },
  { id: 2, name: 'Isotretinoin', condition: 'Acne', rating: 8.2, reviews: 890, sentiment: 'Positive' },
  { id: 3, name: 'Ibuprofen', condition: 'Pain', rating: 6.8, reviews: 2100, sentiment: 'Neutral' }
];

const Explore = () => {
  const [search, setSearch] = useState('');

  const filtered = mockDrugs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.condition.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Drug Explorer</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Search and filter through the medical database.</p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by drug name or condition..." 
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(drug => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={drug.id} 
            className="glass-card p-6 flex flex-col cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{drug.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold ${drug.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {drug.sentiment}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{drug.condition}</p>
            <div className="mt-auto flex justify-between items-center text-sm font-medium">
              <span className="flex items-center gap-1 text-yellow-500">
                ★ {drug.rating}/10
              </span>
              <span className="text-gray-400">{drug.reviews} reviews</span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-gray-500 col-span-full text-center py-10">No drugs found.</p>}
      </div>
    </motion.div>
  );
};

export default Explore;
