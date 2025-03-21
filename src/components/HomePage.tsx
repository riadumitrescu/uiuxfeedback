import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    navigate('/upload');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00D1D1] to-[#00A3A3]">
              Get Actionable UI/UX Feedback Instantly
            </h1>
          </motion.div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your designs with AI-powered analysis. Get detailed, objective feedback that helps you create exceptional user experiences.
          </p>
          
          <motion.div 
            className={`max-w-2xl mx-auto p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
              isDragging 
                ? 'border-[#00D1D1] bg-[#00D1D1]/10 scale-102' 
                : 'border-gray-300 hover:border-[#00D1D1] hover:bg-[#00D1D1]/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.button
                onClick={() => navigate('/upload')}
                className="group px-8 py-4 bg-[#00D1D1] text-white rounded-xl hover:bg-[#00D1D1]/90 text-lg font-medium shadow-lg hover:shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Upload Your Design</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </motion.button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag & drop your design or click to upload (PNG, JPG, JPEG)
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Before & After Showcase */}
        <motion.div 
          className="mt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            See the Transformation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg group hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00D1D1]/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Before Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300">Original design submission</p>
            </motion.div>
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg group hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00D1D1]/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">After Implementation</h3>
              <p className="text-gray-600 dark:text-gray-300">Enhanced with AI recommendations</p>
            </motion.div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="mt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                ),
                title: "1. Upload Design",
                description: "Simply upload your UI screenshot and let our AI analyze it."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                ),
                title: "2. AI Analysis",
                description: "Our AI analyzes your design for usability, accessibility, and best practices."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: "3. Get Feedback",
                description: "Receive detailed feedback and actionable recommendations to improve your design."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform transition-all duration-300 ${
                  activeStep === index ? 'scale-105 border-2 border-[#00D1D1]' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="w-12 h-12 bg-[#00D1D1]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#00D1D1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {step.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Target Audience */}
        <motion.div 
          className="mt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Who Should Use This?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'UX Designers',
                description: 'Get objective feedback on your designs and validate your solutions.',
                icon: '🎨'
              },
              {
                title: 'Developers',
                description: 'Ensure your implementations follow UI/UX best practices.',
                icon: '💻'
              },
              {
                title: 'Product Managers',
                description: 'Validate design decisions with data-driven insights.',
                icon: '📊'
              },
              {
                title: 'Startups',
                description: 'Build user-friendly products from the ground up.',
                icon: '🚀'
              }
            ].map((audience, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {audience.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {audience.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {audience.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="mt-32 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#00D1D1]/10 to-[#00A3A3]/10 p-12 rounded-2xl">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Improve Your Design?
            </h2>
            <motion.button
              onClick={() => navigate('/upload')}
              className="group px-8 py-4 bg-[#00D1D1] text-white rounded-xl text-lg font-medium shadow-lg relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage; 