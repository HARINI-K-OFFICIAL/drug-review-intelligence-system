import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Activity, Users, Star, TrendingUp } from 'lucide-react';
import AnimatedCard from '../components/ui/AnimatedCard';

const Dashboard = () => {
  // Mock Data for Charts
  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' }, // emerald-500
    { name: 'Neutral', value: 25, color: '#f59e0b' },  // amber-500
    { name: 'Negative', value: 10, color: '#ef4444' }  // red-500
  ];

  const barData = [
    { condition: 'Pain', usage: 120 },
    { condition: 'Infection', usage: 85 },
    { condition: 'BP', usage: 45 },
    { condition: 'Diabetes', usage: 200 }
  ];

  const trendData = [
    { month: 'Jan', reviews: 40 },
    { month: 'Feb', reviews: 65 },
    { month: 'Mar', reviews: 110 },
    { month: 'Apr', reviews: 90 },
    { month: 'May', reviews: 150 },
  ];

  const stats = [
    { title: "Total Reviews Analyzed", value: "3,402", icon: <Activity className="text-indigo-500" />, trend: "+12%" },
    { title: "Active Users", value: "842", icon: <Users className="text-purple-500" />, trend: "+5%" },
    { title: "Average Rating", value: "4.2", icon: <Star className="text-amber-500" />, trend: "+0.1" },
    { title: "Model Accuracy", value: "94.5%", icon: <TrendingUp className="text-emerald-500" />, trend: "+2.1%" }
  ];

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">View real-time predictions and drug performance metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <AnimatedCard key={idx} delay={idx * 0.1} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sentiment Doughnut */}
        <AnimatedCard className="p-6 lg:col-span-1" delay={0.4} noHover>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Sentiment Distribution</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">65%</span>
              <span className="text-xs text-gray-500">Positive</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {sentimentData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Bar Chart */}
        <AnimatedCard className="p-6 lg:col-span-2" delay={0.5} noHover>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Drug Usage by Condition</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.5} />
                <XAxis dataKey="condition" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                />
                <Bar dataKey="usage" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Line Chart */}
        <AnimatedCard className="p-6 lg:col-span-3" delay={0.6} noHover>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Review Activity Trend</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                />
                <Line type="smooth" dataKey="reviews" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Dashboard;
