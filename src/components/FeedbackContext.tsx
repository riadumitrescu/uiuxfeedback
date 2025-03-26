import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for our form data
interface FeedbackContextForm {
  platformType: string;
  mainFocus: string[];
  targetAudience: string;
  accessibilityNeeds: boolean;
  customFeedback: string;
}

// For option types
interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

const FeedbackContext: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form data state - simplified with fewer options
  const [formData, setFormData] = useState<FeedbackContextForm>({
    platformType: '',
    mainFocus: [],
    targetAudience: '',
    accessibilityNeeds: false,
    customFeedback: '',
  });

  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');

  // Get the uploaded image from session storage
  useEffect(() => {
    const image = sessionStorage.getItem('uploadedImage');
    const name = sessionStorage.getItem('uploadedFileName');
    
    if (!image) {
      // Redirect back to upload if no image is found
      navigate('/');
      return;
    }
    
    setUploadedImage(image);
    if (name) setFileName(name);
  }, [navigate]);

  // Handle single select changes
  const handleSelectChange = (value: string, field: keyof FeedbackContextForm) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle multi-select toggle
  const toggleFocusItem = (value: string) => {
    setFormData(prev => {
      const currentValues = [...prev.mainFocus];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          mainFocus: currentValues.filter(item => item !== value)
        };
      } else {
        // Limit to 2 selections
        if (currentValues.length < 2) {
        return {
          ...prev,
            mainFocus: [...currentValues, value]
        };
        }
        return prev;
      }
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      accessibilityNeeds: e.target.checked
    }));
  };

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      customFeedback: e.target.value
    }));
  };

  // Generate the Gemini prompt based on user selections
  const generatePrompt = (): string => {
    const { 
      platformType, 
      mainFocus, 
      targetAudience,
      accessibilityNeeds,
      customFeedback
    } = formData;

    let prompt = `You are a senior UI/UX designer evaluating a UI design for a ${platformType || 'digital product'}`;
    
    if (targetAudience) {
      prompt += ` targeted at ${targetAudience} users.`;
    } else {
      prompt += '.';
    }
    
    // Add main focus areas if selected
    if (mainFocus.length > 0) {
      prompt += ` Please focus your analysis especially on ${mainFocus.join(' and ')}.`;
    }
    
    // Add accessibility concerns if selected
    if (accessibilityNeeds) {
      prompt += ` Pay special attention to accessibility best practices and WCAG guidelines in your evaluation.`;
    }
    
    // Add custom feedback requests if provided
    if (customFeedback.trim()) {
      prompt += ` The user has specific concerns: "${customFeedback.trim()}"`;
    }
    
    // Final instructions
    prompt += `\n\nBased on the UI design image, please provide:
1. A brief, concise evaluation of the overall design
2. 3-5 specific UX/UI issues you've identified, ordered by priority
3. Clear, actionable recommendations for each issue
4. At least 2 positive aspects of the design that should be maintained

For each issue, include:
- The specific UI element or area that needs improvement
- Why it's problematic from a UX perspective
- How it could be improved (be specific with design suggestions)

Focus on practical, implementable advice for improving the user experience. Be specific about what elements need changes and why.`;

    return prompt;
  };

  // Process the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedImage) {
      alert('No image found. Please upload an image first.');
      navigate('/');
      return;
    }
    
    setIsGenerating(true);
    setProgressMessage('Preparing your feedback request...');
    
    try {
      // Generate the prompt
      const prompt = generatePrompt();
      
      // Store prompt in session storage
      sessionStorage.setItem('geminiPrompt', prompt);
      
      // Navigate to loading page
      setTimeout(() => {
        navigate('/loading');
      }, 800);
    } catch (error) {
      console.error('Error generating feedback:', error);
      alert('There was an error processing your feedback. Please try again.');
      setIsGenerating(false);
    }
  };

  // Skip context and go straight to loading/analysis
  const handleSkip = () => {
    // Generate a generic prompt
    const genericPrompt = `You are a senior UI/UX designer evaluating a UI design. 
    
Based on the UI design image, please provide:
1. A brief, concise evaluation of the overall design
2. 3-5 specific UX/UI issues you've identified, ordered by priority
3. Clear, actionable recommendations for each issue
4. At least 2 positive aspects of the design that should be maintained

For each issue, include:
- The specific UI element or area that needs improvement
- Why it's problematic from a UX perspective
- How it could be improved (be specific with design suggestions)`;

    sessionStorage.setItem('geminiPrompt', genericPrompt);
    navigate('/loading');
  };

  // Platform type options - expanded to 6 categories
  const platformTypes: SelectOption[] = [
    { 
      value: 'Mobile App', 
      label: 'Mobile App', 
      icon: '📱', 
      description: 'iOS, Android or cross-platform mobile applications with touch interactions' 
    },
    { 
      value: 'Web Application', 
      label: 'Web Application', 
      icon: '💻', 
      description: 'Browser-based applications with complex functionality and user interactions' 
    },
    { 
      value: 'Data Visualization', 
      label: 'Data Visualization', 
      icon: '📊', 
      description: 'Dashboards, charts, and interactive data displays for analytics and reporting' 
    },
    { 
      value: 'Brand Identity', 
      label: 'Brand Identity', 
      icon: '🎨', 
      description: 'Logos, brand guidelines, and visual identity systems' 
    },
    { 
      value: 'Marketing Design', 
      label: 'Marketing Design', 
      icon: '🎯', 
      description: 'Advertisements, social media content, and promotional materials' 
    },
    { 
      value: 'Enterprise UI', 
      label: 'Enterprise UI', 
      icon: '🏢', 
      description: 'Business applications, admin panels, and internal tools' 
    }
  ];

  // Focus area options - simplified
  const focusAreas: SelectOption[] = [
    { value: 'Visual Design', label: 'Visual Design', icon: '🎨', description: 'Colors, typography, and aesthetics' },
    { value: 'Usability', label: 'Usability', icon: '🛠️', description: 'Ease of use and intuitive navigation' },
    { value: 'Information Architecture', label: 'Information Architecture', icon: '🏗️', description: 'Organization and hierarchy of content' },
    { value: 'Conversion Optimization', label: 'Conversion Optimization', icon: '🎯', description: 'Improving user actions and conversions' }
  ];

  // Target audience options - simplified
  const audienceTypes: SelectOption[] = [
    { value: 'General', label: 'General Users', icon: '👥', description: 'Broad audience with varied technical skills' },
    { value: 'Technical', label: 'Technical Users', icon: '👩‍💻', description: 'Users comfortable with technology' },
    { value: 'Business', label: 'Business Users', icon: '💼', description: 'Professionals in corporate environments' },
    { value: 'Creative', label: 'Creative Professionals', icon: '🎭', description: 'Designers, artists, and content creators' }
  ];

  if (isGenerating) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 px-4 text-center">
        <div className="mb-8">
          <div className="inline-block rounded-full bg-[#00D1D1]/20 p-4 mb-4">
            <svg className="animate-spin h-12 w-12 text-[#00D1D1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">{progressMessage}</h2>
          <p className="text-gray-500">This will take just a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9fa] to-[#e6f7f7] dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Customize Your Feedback
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tell us a bit about your design to receive more relevant feedback
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-16 h-16 bg-[#00D1D1]/10 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 text-[#00D1D1]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Design
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {fileName || "Uploaded image"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Image preview */}
            <div className="w-full md:w-1/3 p-6 md:border-r border-gray-100 dark:border-gray-700">
              <div className="aspect-[9/16] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden mb-4">
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="Your uploaded design" 
                    className="w-full h-full object-contain"
                />
              )}
            </div>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  All fields are optional. The more context you provide, the more tailored your feedback will be.
                </p>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleSkip}
                  className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Skip and analyze now
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="w-full md:w-2/3 p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
              {/* Platform Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    1. What type of platform is this?
                </label>
                  <div className="grid grid-cols-2 gap-3">
                    {platformTypes.map(option => (
                    <div
                      key={option.value}
                        onClick={() => handleSelectChange(option.value, 'platformType')}
                        className={`relative border rounded-xl p-4 cursor-pointer transition-all ${
                        formData.platformType === option.value 
                          ? 'border-[#00D1D1] bg-[#00D1D1]/5 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-[#00D1D1]/30'
                      }`}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{option.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                          </div>
                      </div>
                      {formData.platformType === option.value && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00D1D1] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                </div>

              {/* Main UX Focus */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    2. What aspects are you most interested in? <span className="text-xs text-gray-500">(Select up to 2)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {focusAreas.map(option => (
                      <div
                        key={option.value}
                        onClick={() => toggleFocusItem(option.value)}
                        className={`relative border rounded-xl p-4 cursor-pointer transition-all ${
                          formData.mainFocus.includes(option.value) 
                            ? 'border-[#00D1D1] bg-[#00D1D1]/5 shadow-sm' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#00D1D1]/30'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{option.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                          </div>
                        </div>
                        {formData.mainFocus.includes(option.value) && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00D1D1] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    3. Who is your target audience?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {audienceTypes.map(option => (
                    <div
                      key={option.value}
                        onClick={() => handleSelectChange(option.value, 'targetAudience')}
                        className={`relative border rounded-xl p-4 cursor-pointer transition-all ${
                          formData.targetAudience === option.value 
                            ? 'border-[#00D1D1] bg-[#00D1D1]/5 shadow-sm' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#00D1D1]/30'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{option.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                          </div>
                        </div>
                        {formData.targetAudience === option.value && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00D1D1] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                          </div>
                      )}
                    </div>
                  ))}
                </div>
                </div>
                
                {/* Accessibility Toggle & Custom Feedback */}
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      id="accessibility"
                      name="accessibility"
                      type="checkbox"
                      checked={formData.accessibilityNeeds}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5 text-[#00D1D1] border-gray-300 rounded focus:ring-[#00D1D1]"
                    />
                    <label htmlFor="accessibility" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      4. Include accessibility evaluation in the feedback
                    </label>
              </div>
                         
              <div>
                    <label htmlFor="customFeedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      5. Any specific concerns or questions? (optional)
                </label>
                    <textarea
                      id="customFeedback"
                      name="customFeedback"
                      value={formData.customFeedback}
                      onChange={handleTextChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-[#00D1D1] focus:ring focus:ring-[#00D1D1]/10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="E.g., Is my navigation intuitive? How can I improve the checkout flow?"
                />
              </div>
            </div>
                      
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                    className="w-full py-4 px-4 bg-[#00D1D1] text-white rounded-xl font-medium hover:bg-[#00BFBF] transition-colors flex items-center justify-center shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
              >
                    Generate Customized Feedback
              </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackContext; 