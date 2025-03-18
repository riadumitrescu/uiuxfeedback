import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FeedbackItem {
  issue: string;
  explanation: string;
  recommendation: string;
  cropArea?: { x: number, y: number, width: number, height: number };
}

interface FeedbackResponse {
  summary: string;
  issues: FeedbackItem[];
  positives: string[];
}

const FeedbackResults: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  
  // For active tab in results
  const [activeTab, setActiveTab] = useState<'issues' | 'positives'>('issues');
  const [activeIssueIndex, setActiveIssueIndex] = useState(0);

  useEffect(() => {
    // Get data from session storage
    const image = sessionStorage.getItem('uploadedImage');
    const storedPrompt = sessionStorage.getItem('geminiPrompt');
    
    if (!image || !storedPrompt) {
      setError('No image or prompt found. Please start over.');
      setIsLoading(false);
      return;
    }
    
    setUploadedImage(image);
    setPrompt(storedPrompt);
    
    // Call Gemini API
    callGeminiAPI(image, storedPrompt);
  }, []);

  const callGeminiAPI = async (imageData: string, promptText: string) => {
    // In a real app, you would call the Gemini API here with the image and prompt
    // For this demo, we'll simulate the API response with a timeout
    
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, generate mock feedback
      const mockFeedback: FeedbackResponse = {
        summary: "The UI design shows a clean, modern aesthetic with good use of whitespace. However, there are several usability issues that could impact the user experience, particularly around contrast, information hierarchy, and mobile responsiveness.",
        issues: [
          {
            issue: "Low contrast in key UI elements",
            explanation: "Text on the light background doesn't meet WCAG AA contrast standards, making it difficult to read for users with visual impairments or those in bright environments.",
            recommendation: "Increase the contrast ratio between text and background to at least 4.5:1 for normal text and 3:1 for large text. Consider using a darker shade for primary text or adding a subtle background to improve readability.",
            cropArea: { x: 20, y: 15, width: 60, height: 25 }
          },
          {
            issue: "Cluttered information hierarchy",
            explanation: "The visual hierarchy doesn't clearly guide users through the most important actions. Multiple elements compete for attention, making it difficult for users to determine what actions to take first.",
            recommendation: "Simplify the interface by establishing a clearer visual hierarchy. Emphasize primary actions with size, color, and positioning while de-emphasizing secondary elements. Group related elements and use consistent spacing to create visual relationships.",
            cropArea: { x: 5, y: 30, width: 90, height: 40 }
          },
          {
            issue: "Small touch targets on mobile",
            explanation: "Several interactive elements appear too small for comfortable mobile interaction. The minimum recommended touch target size is 44×44px, but several elements in the design are significantly smaller.",
            recommendation: "Increase the size of all clickable elements to at least 44×44px for mobile users. Add proper padding around interactive elements and increase spacing between adjacent touch targets to prevent accidental taps.",
            cropArea: { x: 65, y: 45, width: 30, height: 20 }
          },
          {
            issue: "Inconsistent button styling",
            explanation: "The UI uses multiple button styles with insufficient visual differentiation between primary and secondary actions, creating potential confusion about button hierarchy.",
            recommendation: "Standardize button styles throughout the interface. Use a distinct visual style for primary actions that stands out from secondary actions. Maintain consistency in size, shape, color, and hover effects across similar button types.",
            cropArea: { x: 10, y: 60, width: 80, height: 30 }
          }
        ],
        positives: [
          "Clean, minimalist aesthetic that creates a modern, professional impression",
          "Good use of whitespace that prevents the interface from feeling crowded",
          "Consistent color palette that reinforces brand identity",
          "Logical grouping of related UI elements that helps with cognitive processing"
        ]
      };
      
      // Set the feedback state
      setFeedback(mockFeedback);
      setIsLoading(false);
      
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setError("There was an error generating feedback. Please try again.");
      setIsLoading(false);
    }
  };

  // Function to handle API with real Gemini in production
  const callRealGeminiAPI = async (imageData: string, promptText: string) => {
    // Remove the data:image/jpeg;base64 prefix if present
    const base64Image = imageData.split(',')[1];
    
    const apiKey = "YOUR_API_KEY"; // This would be stored securely in production
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";
    
    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generation_config: {
            temperature: 0.4,
            top_p: 0.95,
            max_output_tokens: 2048,
          }
        })
      });
      
      const data = await response.json();
      
      // Process the Gemini response
      // In production, you would parse the response and structure it into the FeedbackResponse format
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Unknown error occurred");
      }
      
      // Production code would extract text from data.candidates[0].content.parts[0].text
      // And then parse it into structured feedback format
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      throw err;
    }
  };

  const handleStartOver = () => {
    // Clear session storage
    sessionStorage.removeItem('uploadedImage');
    sessionStorage.removeItem('uploadedFileName');
    sessionStorage.removeItem('geminiPrompt');
    
    // Navigate back to upload page
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 px-4 text-center">
        <div className="mb-8">
          <div className="inline-block rounded-full bg-[#00D1D1]/20 p-4 mb-4">
            <svg className="animate-spin h-12 w-12 text-[#00D1D1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Analyzing design with AI...</h2>
          <p className="text-gray-500 dark:text-gray-400">We're using advanced AI to evaluate your UI design</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 px-4 text-center">
        <div className="mb-8">
          <div className="inline-block rounded-full bg-red-100 p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Something went wrong</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleStartOver}
            className="px-4 py-2 bg-[#00D1D1] text-white rounded-lg font-medium hover:bg-[#00D1D1]/90 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left panel - Image & summary */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-20">
            <div className="border rounded-lg overflow-hidden shadow-md mb-6">
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="Analyzed UI design" 
                  className="w-full object-contain"
                />
              )}
            </div>
            
            {feedback && (
              <div className="bg-[#00D1D1]/5 rounded-lg p-6 border border-[#00D1D1]/20">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00D1D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  UX Analysis Summary
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {feedback.summary}
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={handleStartOver}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Analyze Another Design</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right panel - Detailed feedback */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="border-b flex">
              <button
                className={`py-4 px-6 text-sm font-medium flex-1 border-b-2 ${
                  activeTab === 'issues'
                    ? 'border-[#00D1D1] text-[#00D1D1]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('issues')}
              >
                Issues to Address ({feedback?.issues.length})
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium flex-1 border-b-2 ${
                  activeTab === 'positives'
                    ? 'border-[#00D1D1] text-[#00D1D1]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('positives')}
              >
                Positive Aspects ({feedback?.positives.length})
              </button>
            </div>
            
            {/* Tab content */}
            <div className="p-0">
              {activeTab === 'issues' && feedback && (
                <div>
                  {/* Issues list - sidebar on desktop, tabs on mobile */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 border-r">
                      <div className="md:h-[600px] overflow-y-auto">
                        {feedback.issues.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-4 border-b cursor-pointer transition-colors ${
                              activeIssueIndex === index
                                ? 'bg-[#00D1D1]/5 border-l-4 border-l-[#00D1D1]'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-l-transparent'
                            }`}
                            onClick={() => setActiveIssueIndex(index)}
                          >
                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold mr-3 flex-shrink-0">
                                {index + 1}
                              </div>
                              <h3 className="font-medium text-sm text-gray-900 dark:text-white">{issue.issue}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Issue details */}
                    <div className="md:w-2/3 p-6">
                      <div className="mb-6">
                        <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                          Issue #{activeIssueIndex + 1}
                        </span>
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{feedback.issues[activeIssueIndex].issue}</h2>
                        
                        <div className="mb-5">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">The Problem</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.issues[activeIssueIndex].explanation}</p>
                        </div>
                        
                        {/* Image crop for the issue */}
                        <div className="mb-5">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Problem Area</h3>
                          <div className="relative border rounded-lg overflow-hidden">
                            {uploadedImage && feedback?.issues[activeIssueIndex].cropArea ? (
                              <div className="relative">
                                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                  <img 
                                    src={uploadedImage} 
                                    alt="Problem area" 
                                    className="absolute"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: `${feedback.issues[activeIssueIndex].cropArea?.x || 50}% ${feedback.issues[activeIssueIndex].cropArea?.y || 50}%`,
                                      transform: `scale(${100 / (feedback.issues[activeIssueIndex].cropArea?.width || 100)})`,
                                      transformOrigin: `${feedback.issues[activeIssueIndex].cropArea?.x || 50}% ${feedback.issues[activeIssueIndex].cropArea?.y || 50}%`
                                    }}
                                  />
                                  <div className="absolute inset-0 shadow-inner">
                                    <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px]"></div>
                                    <div 
                                      className="absolute bg-transparent border-2 border-red-500 z-10" 
                                      style={{
                                        left: `${Math.max(0, 50 - (feedback.issues[activeIssueIndex].cropArea?.width || 100) / 2)}%`,
                                        top: `${Math.max(0, 50 - (feedback.issues[activeIssueIndex].cropArea?.height || 100) / 2)}%`,
                                        width: `${Math.min(100, feedback.issues[activeIssueIndex].cropArea?.width || 100)}%`,
                                        height: `${Math.min(100, feedback.issues[activeIssueIndex].cropArea?.height || 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs font-semibold px-2 py-1 rounded-sm">
                                  Problem Area
                                </div>
                              </div>
                            ) : (
                              <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <div className="text-center p-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Issue area visualization not available</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">The highlighted area shows where the issue is most apparent</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-[#00D1D1] mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Recommendation
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.issues[activeIssueIndex].recommendation}</p>
                        </div>
                      </div>
                      
                      {/* Navigation buttons */}
                      <div className="flex justify-between mt-10">
                        <button
                          onClick={() => setActiveIssueIndex(prev => Math.max(0, prev - 1))}
                          disabled={activeIssueIndex === 0}
                          className={`flex items-center text-sm font-medium ${
                            activeIssueIndex === 0 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300 hover:text-[#00D1D1] dark:hover:text-[#00D1D1]'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Previous Issue
                        </button>
                        
                        <button
                          onClick={() => setActiveIssueIndex(prev => Math.min(feedback.issues.length - 1, prev + 1))}
                          disabled={activeIssueIndex === feedback.issues.length - 1}
                          className={`flex items-center text-sm font-medium ${
                            activeIssueIndex === feedback.issues.length - 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300 hover:text-[#00D1D1] dark:hover:text-[#00D1D1]'
                          }`}
                        >
                          Next Issue
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'positives' && feedback && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Positive Aspects of Your Design</h2>
                  <div className="space-y-4">
                    {feedback.positives.map((positive, index) => (
                      <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{positive}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">Keep up the good work!</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      These positive aspects should be maintained in future iterations of your design.
                      They contribute to a better user experience and demonstrate good design principles.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackResults; 