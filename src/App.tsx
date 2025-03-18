import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ImageUpload from './components/ImageUpload';
import FeedbackContext from './components/FeedbackContext';
import FeedbackResults from './components/FeedbackResults';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isScrolled, setIsScrolled] = useState(false);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme class to document body
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Dynamic theme styles
  const themeStyles = {
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    secondaryBg: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
    headerBg: isDarkMode 
      ? (isScrolled ? 'bg-black' : 'bg-transparent') 
      : (isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'),
    navText: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    navHover: 'hover:text-[#00D1D1]',
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${themeStyles.bg} ${themeStyles.text}`}>
        {/* Header */}
        <header className={`fixed w-full transition-all duration-300 z-50 ${themeStyles.headerBg}`}>
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tight flex items-center">
                AI UX<span className="text-[#00D1D1]">.</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1D1] transition-colors"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content with Routes */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<ImageUpload />} />
            <Route path="/feedback-context" element={<FeedbackContext />} />
            <Route path="/feedback-results" element={<FeedbackResults />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className={`${themeStyles.bg} border-t border-gray-800 py-6 px-6 transition-colors duration-300 mt-20`}>
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-sm text-gray-500">
                  © {new Date().getFullYear()} AI UX Feedback Tool. All rights reserved.
                </span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-500 hover:text-[#00D1D1]">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-[#00D1D1]">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
