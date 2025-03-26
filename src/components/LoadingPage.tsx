import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeUIUX } from '../services/geminiService';

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing analysis...');

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        const uploadedImage = sessionStorage.getItem('uploadedImage');
        if (!uploadedImage) {
          navigate('/');
          return;
        }

        // Convert base64 to File object
        const base64Response = await fetch(uploadedImage);
        const blob = await base64Response.blob();
        const file = new File([blob], 'uploaded-image.png', { type: 'image/png' });

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + 10;
          });
        }, 1000);

        // Update status messages
        const statusMessages = [
          'Initializing analysis...',
          'Processing image...',
          'Identifying UI elements...',
          'Analyzing layout and structure...',
          'Evaluating user experience...',
          'Generating recommendations...',
          'Finalizing report...',
        ];

        let statusIndex = 0;
        const statusInterval = setInterval(() => {
          if (statusIndex < statusMessages.length - 1) {
            statusIndex++;
            setStatus(statusMessages[statusIndex]);
          }
        }, 1500);

        // Perform the actual analysis
        const result = await analyzeUIUX(file);
        
        // Clear intervals
        clearInterval(progressInterval);
        clearInterval(statusInterval);

        // Set final progress and status
        setProgress(100);
        setStatus('Analysis complete!');

        // Store the analysis result
        sessionStorage.setItem('fullGeminiAnalysis', result.fullResponse || result.text);

        // Navigate to results after a short delay
        setTimeout(() => {
          navigate('/results');
        }, 1000);
      } catch (error) {
        console.error('Analysis failed:', error);
        setStatus('Analysis failed. Please try again.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    startAnalysis();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9fa] to-[#e6f7f7] dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Analyzing Your Design
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Our AI is working its magic to provide you with detailed insights and recommendations.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
            <div className="space-y-8">
              {/* Illustration */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-[#00D1D1]/10 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#00D1D1] border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              
              {/* Status */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {status}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We're examining every pixel to give you the best feedback
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="pt-4">
                <div className="relative">
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D1D1] to-[#00A3A3] transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  {/* Progress indicators below the bar */}
                  <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span className="font-medium text-[#00D1D1]">{progress}% Complete</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 px-6 pt-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="block w-1.5 h-1.5 rounded-full bg-[#00D1D1] animate-pulse"></span>
                  <span>This may take a few moments. Please don't close this window.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage; 