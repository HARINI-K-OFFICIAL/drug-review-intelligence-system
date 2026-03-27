import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

// Placeholder Pages (Will be replaced)
const MockPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <h1 className="text-4xl font-bold heading-gradient">{title}</h1>
  </div>
);

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DrugExplorer from './pages/DrugExplorer';
import ReviewAnalysis from './pages/ReviewAnalysis';
import AiAssistant from './pages/AiAssistant';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans selection:bg-indigo-500/30 selection:text-white">
        <Router>
          <Navbar />
          {/* Main content with top padding to account for fixed navbar */}
          <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen relative z-10">
            <Routes>
              {/* Using mock pages to start, we'll swap them to actual imports later once created */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explorer" element={<DrugExplorer />} />
              <Route path="/analysis" element={<ReviewAnalysis />} />
              <Route path="/assistant" element={<AiAssistant />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          
          {/* Global Ambient Glow for Dark Mode */}
          <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
