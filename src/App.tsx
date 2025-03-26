import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import LoadingPage from './components/LoadingPage';
import FeedbackResults from './components/FeedbackResults';
import FeedbackContext from './components/FeedbackContext';
import PsychologyPrinciples from './pages/PsychologyPrinciples';

function App() {
  // Use basename for GitHub Pages
  const basename = process.env.PUBLIC_URL;

  return (
    <ThemeProvider>
      <Router basename={basename}>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
          <Header />
          
          {/* Main Content with Routes */}
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/context" element={<FeedbackContext />} />
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/results" element={<FeedbackResults />} />
              <Route path="/principles" element={<PsychologyPrinciples />} />
            </Routes>
          </main>

          {/* Simple Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-800 py-6 px-6 transition-colors duration-300 mt-20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} AI UX Feedback Tool. All rights reserved.
                  </span>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#00D1D1] transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#00D1D1] transition-colors duration-300">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
