import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Bot, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedCard from '../components/ui/AnimatedCard';

const Home = () => {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
      title: "Predictive Analytics",
      description: "Analyze vast amounts of drug review data using ML models to predict sentiments and conditions instantly.",
      gradient: "from-indigo-500/10 to-transparent"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Data Integrity",
      description: "Backed by real user reviews, ensuring insights are derived from authentic patient experiences.",
      gradient: "from-emerald-500/10 to-transparent"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Real-time Inference",
      description: "Process natural language queries and generate drug effectiveness reports in milliseconds.",
      gradient: "from-amber-500/10 to-transparent"
    }
  ];

  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            v2.0 AI Engine Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Intelligence for</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 leading-[1.2]">
              Medical Insights
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 md:px-20 mb-10 leading-relaxed font-light">
            Unlock the power of artificial intelligence to decode thousands of patient reviews. 
            Discover sentiment trends, explore drug efficacies, and make decisions driven by data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              Explore Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/assistant"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              <Bot className="w-5 h-5 text-indigo-500" /> Talk to AI
            </Link>
          </div>
        </motion.div>

        {/* Floating gradient orb background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl w-full px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Core Capabilities</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Our intelligence system is built on cutting-edge machine learning pipelines designed for scale and precision.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <AnimatedCard key={idx} delay={idx * 0.1}>
              <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-50 pointer-events-none`}></div>
              <div className="relative p-8 h-full flex flex-col text-left">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl w-max shadow-sm border border-gray-100 dark:border-gray-700 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">{feature.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl w-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-gray-900 text-white p-10 md:p-16 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-60"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to see the insights?</h2>
            <p className="text-gray-300 mb-10 text-lg max-w-xl mx-auto">Dive deep into our interactive dashboard to explore real-time analytics and predictive reviews.</p>
            <Link 
              to="/explorer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold transition-transform hover:scale-105"
            >
              Start Searching Drugs <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
