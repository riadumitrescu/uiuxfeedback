import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UXIssue, parseGeminiResponse } from '../services/geminiService';

const FeedbackResults: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [issues, setIssues] = useState<UXIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<UXIssue | null>(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [fullAnalysis, setFullAnalysis] = useState<string | null>(null);

  useEffect(() => {
    // Get the uploaded image and analysis result from session storage
    const storedImage = sessionStorage.getItem('uploadedImage');
    const storedAnalysis = sessionStorage.getItem('fullGeminiAnalysis');

    if (!storedImage || !storedAnalysis) {
      navigate('/');
      return;
    }

    setUploadedImage(storedImage);
    setFullAnalysis(storedAnalysis);

    // Parse the Gemini response to extract issues
    const parsedIssues = parseGeminiResponse(storedAnalysis);
    setIssues(parsedIssues);
    if (parsedIssues.length > 0) {
      setSelectedIssue(parsedIssues[0]);
    }
  }, [navigate]);

  const handleIssueClick = (issue: UXIssue) => {
    setSelectedIssue(issue);
  };

  const getSeverityFromTitle = (title: string): 'low' | 'medium' | 'high' => {
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes('critical') || 
      lowerTitle.includes('severe') || 
      lowerTitle.includes('major') ||
      lowerTitle.includes('contrast')
    ) {
      return 'high';
    } else if (
      lowerTitle.includes('moderate') || 
      lowerTitle.includes('medium') ||
      lowerTitle.includes('usability')
    ) {
      return 'medium';
    }
    return 'low';
  };

  if (!uploadedImage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            UI/UX Analysis Results
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here's what our AI found in your design. Click on issues to see detailed feedback and recommendations.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-[#00D1D1] text-white rounded-xl hover:bg-[#00D1D1]/90 transition-colors text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Analyze Another Design
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image Display */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Uploaded Design</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click on issues to highlight problem areas</p>
              </div>
              <div className="p-6">
                <div className="relative aspect-[9/16] w-full max-w-md mx-auto">
                  <img
                    src={uploadedImage}
                    alt="Uploaded UI Design"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  {selectedIssue?.cropCoordinates && (
                    <>
                      <div
                        className="absolute border-2 border-[#00D1D1] bg-[#00D1D1]/10"
                        style={{
                          left: `${selectedIssue.cropCoordinates.x}%`,
                          top: `${selectedIssue.cropCoordinates.y}%`,
                          width: `${selectedIssue.cropCoordinates.width}%`,
                          height: `${selectedIssue.cropCoordinates.height}%`,
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm rounded-b-lg">
                        {selectedIssue.problemArea}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Issues List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Issues Found</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to view details</p>
              </div>
              <div className="p-3">
                <div className="space-y-3">
                  {issues.map((issue, index) => {
                    const severity = getSeverityFromTitle(issue.title);
                    return (
                      <div
                        key={index}
                        onClick={() => handleIssueClick(issue)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedIssue === issue
                            ? 'bg-[#00D1D1]/10 border-2 border-[#00D1D1] shadow-md'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs mr-3 ${
                            severity === 'high' 
                              ? 'bg-red-500' 
                              : severity === 'medium' 
                                ? 'bg-yellow-500' 
                                : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{issue.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{issue.problem}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Issue Details */}
        {selectedIssue && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedIssue.title}</h2>
                <div className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  getSeverityFromTitle(selectedIssue.title) === 'high' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                    : getSeverityFromTitle(selectedIssue.title) === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {getSeverityFromTitle(selectedIssue.title).charAt(0).toUpperCase() + 
                   getSeverityFromTitle(selectedIssue.title).slice(1)} Priority
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Problem</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedIssue.problem}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Problem Area</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedIssue.problemArea}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Recommendation</h3>
                <div className="p-4 bg-[#00D1D1]/10 border border-[#00D1D1] rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">{selectedIssue.recommendation}</p>
                </div>
              </div>

              {/* Things You Did Right Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Things You Did Right</h3>
                <div className="p-4 bg-[#00D1D1]/10 border border-[#00D1D1] rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">
                    Your design shows good attention to detail in several areas. The layout is clean and organized, 
                    and you've maintained consistent spacing throughout the interface. The color scheme is well-chosen 
                    and contributes to a cohesive look. Keep up the good work on these aspects!
                  </p>
                </div>
              </div>

              {/* Development Debug Information */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">Development Debug Information:</h3>
                    <button
                      onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                      className="text-sm text-[#00D1D1] hover:underline"
                    >
                      {showFullAnalysis ? 'Show Evaluation Only' : 'Show Full Analysis'}
                    </button>
                  </div>
                  
                  {showFullAnalysis && fullAnalysis && (
                    <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-96 p-2 border rounded bg-white dark:bg-gray-800">
                      {fullAnalysis}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackResults; 