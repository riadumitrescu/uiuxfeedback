import React from 'react';
import { motion } from 'framer-motion';

const DesignPrinciples: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Design Psychology Principles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Understanding the psychology behind user behavior to create better experiences
          </p>
        </motion.div>

        {/* Hick's Law Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            {/* Principle Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hick's Law</h2>
                <p className="text-gray-600 dark:text-gray-400">Decision Making</p>
              </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Hick's Law states that the time it takes to make a decision increases logarithmically with the number of choices available. In simpler terms, more options lead to harder decisions.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
                <p className="text-blue-800 dark:text-blue-200">
                  "The time it takes to make a decision increases with the number and complexity of choices."
                </p>
              </div>
            </div>

            {/* Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Impact on UX</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Reduces decision paralysis</li>
                  <li>Improves task completion time</li>
                  <li>Enhances user satisfaction</li>
                  <li>Reduces cognitive load</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Common Applications</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Navigation menus</li>
                  <li>Product filters</li>
                  <li>Form fields</li>
                  <li>Settings panels</li>
                </ul>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Learn More</h3>
              
              {/* Articles */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Articles</h4>
                <div className="space-y-3">
                  <a href="https://lawsofux.com/hicks-law/" target="_blank" rel="noopener noreferrer" 
                     className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Laws of UX: Hick's Law</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                  <a href="https://www.nngroup.com/articles/hicks-law/" target="_blank" rel="noopener noreferrer"
                     className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Nielsen Norman Group: Hick's Law</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>

              {/* Case Studies */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Case Studies</h4>
                <div className="space-y-3">
                  <a href="https://www.interaction-design.org/literature/topics/hick-s-law" target="_blank" rel="noopener noreferrer"
                     className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Interaction Design Foundation: Hick's Law Case Studies</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>

              {/* Research Papers */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Research Papers</h4>
                <div className="space-y-3">
                  <a href="https://www.sciencedirect.com/science/article/abs/pii/S002253717180017X" target="_blank" rel="noopener noreferrer"
                     className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Original Hick's Law Research Paper (1952)</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DesignPrinciples; 