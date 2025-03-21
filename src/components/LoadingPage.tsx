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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Analyzing Your Design
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI is carefully analyzing your design to provide detailed feedback and recommendations.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <div className="space-y-6">
              <div className="relative">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00D1D1] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="absolute top-0 left-0 right-0 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>0%</span>
                  <span>{progress}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 border-4 border-[#00D1D1] border-t-transparent rounded-full animate-spin" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {status}
                </span>
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                This may take a few moments. Please don't close this window.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage; 