import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyles = {
    bg: isDarkMode 
      ? (isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent') 
      : (isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-transparent'),
    border: isScrolled ? 'border-b border-gray-200 dark:border-gray-800' : '',
  };

  return (
    <header className={`fixed w-full transition-all duration-300 z-50 ${headerStyles.bg} ${headerStyles.border}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center text-gray-900 dark:text-white hover:text-[#00D1D1] transition-colors duration-300">
            AI UX<span className="text-[#00D1D1]">.</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-[#00D1D1] transition-colors duration-300">
              Home
            </Link>
            <Link to="/principles" className="text-gray-600 dark:text-gray-300 hover:text-[#00D1D1] transition-colors duration-300">
              Psychology Principles
            </Link>
            <Link to="/context" className="text-gray-600 dark:text-gray-300 hover:text-[#00D1D1] transition-colors duration-300">
              Context
            </Link>
            <Link to="/results" className="text-gray-600 dark:text-gray-300 hover:text-[#00D1D1] transition-colors duration-300">
              Results
            </Link>
          </nav>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1D1] transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
  );
};

export default Header; 