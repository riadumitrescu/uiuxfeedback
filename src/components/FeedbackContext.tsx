import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for our form data
interface FeedbackContextForm {
  platformType: string;
  targetAudience: string;
  mainFocus: string[];
  colorScheme: string;
  typography: string;
  layout: string;
  buttonStyle: string;
  animationUsage: string;
  accessibilityFeatures: string[];
}

// For multi-select options
interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

const FeedbackContext: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form data state
  const [formData, setFormData] = useState<FeedbackContextForm>({
    platformType: '',
    targetAudience: '',
    mainFocus: [],
    colorScheme: '',
    typography: '',
    layout: '',
    buttonStyle: '',
    animationUsage: '',
    accessibilityFeatures: [],
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

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle multi-select changes (checkboxes)
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const prevValue = prev[category as keyof FeedbackContextForm];
      const currentValues = Array.isArray(prevValue) ? [...prevValue] : [];
      
      if (checked) {
        return {
          ...prev,
          [category]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [category]: currentValues.filter(item => item !== value)
        };
      }
    });
  };

  // Generate the Gemini prompt based on user selections
  const generatePrompt = (): string => {
    const { 
      platformType, 
      targetAudience, 
      mainFocus, 
      colorScheme, 
      typography, 
      layout, 
      buttonStyle, 
      animationUsage, 
      accessibilityFeatures 
    } = formData;

    let prompt = `You are a UX design expert evaluating a UI design for a ${platformType || 'web application'}`;
    
    if (targetAudience) {
      prompt += ` targeted at ${targetAudience}.`;
    } else {
      prompt += '.';
    }
    
    // Add main focus areas
    if (mainFocus.length > 0) {
      prompt += ` The user is specifically concerned about ${mainFocus.map(f => `[${f}]`).join(', ')}.`;
    }
    
    // Add design details
    const designDetails = [];
    if (colorScheme) designDetails.push(`a [${colorScheme}] color scheme`);
    if (typography) designDetails.push(`[${typography}] typography`);
    if (layout) designDetails.push(`a [${layout}] layout`);
    if (buttonStyle) designDetails.push(`[${buttonStyle}] buttons`);
    if (animationUsage) designDetails.push(`[${animationUsage}] for animations`);
    
    if (designDetails.length > 0) {
      prompt += ` The UI features ${designDetails.join(', ')}.`;
    }
    
    // Add accessibility concerns
    if (accessibilityFeatures.length > 0) {
      prompt += ` Pay special attention to accessibility, particularly for ${accessibilityFeatures.map(f => `[${f}]`).join(', ')}.`;
    }
    
    // Final instructions
    prompt += `\n\nBased on the UI design image, please provide:
1. A concise evaluation of the overall design
2. 3-5 specific UX/UI issues you've identified, ordered by priority
3. Actionable recommendations for each issue
4. Positive aspects of the design that should be maintained

Focus on concrete, practical advice that could improve the user experience. Be specific about what elements need changes and why.`;

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
    setProgressMessage('Preparing your design for analysis...');
    
    try {
      // Generate the prompt
      const prompt = generatePrompt();
      
      // Store both image and prompt in session storage
      sessionStorage.setItem('geminiPrompt', prompt);
      
      // Simulate API processing time with messages
      setTimeout(() => {
        setProgressMessage('Analyzing design patterns...');
        
        setTimeout(() => {
          setProgressMessage('Identifying UX opportunities...');
          
          setTimeout(() => {
            setProgressMessage('Generating feedback report...');
            
            setTimeout(() => {
              // Navigate to results page
              navigate('/feedback-results');
            }, 1200);
          }, 1000);
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error('Error generating feedback:', error);
      alert('There was an error processing your feedback. Please try again.');
      setIsGenerating(false);
    }
  };

  // Platform type options
  const platformTypes: SelectOption[] = [
    { value: 'Mobile App', label: '📱 Mobile App' },
    { value: 'Web App', label: '💻 Web App' },
    { value: 'Desktop App', label: '🖥️ Desktop App' },
    { value: 'Dashboard/UI-heavy', label: '📊 Dashboard/UI-heavy' },
    { value: 'E-commerce Store', label: '🛒 E-commerce Store' },
    { value: 'Portfolio/Creative', label: '✏️ Portfolio/Creative' },
    { value: 'Text-heavy (blogs, news)', label: '📄 Text-heavy (blogs, news)' },
  ];

  // Target audience options
  const audienceTypes: SelectOption[] = [
    { value: 'Children (Under 12)', label: '👶 Children (Under 12)' },
    { value: 'Business Users', label: '🏢 Business Users' },
    { value: 'General Public', label: '🧑‍🎓 General Public' },
    { value: 'Elderly (60+)', label: '🏥 Elderly (60+)' },
    { value: 'People with disabilities', label: '♿ People with disabilities' },
    { value: 'Gamers', label: '🕹️ Gamers' },
    { value: 'Shoppers', label: '🛍️ Shoppers' },
  ];

  // UX Focus areas (multi-select)
  const focusAreas: SelectOption[] = [
    { value: 'Visual Design & Aesthetics', label: '🎨 Visual Design & Aesthetics' },
    { value: 'Accessibility & Readability', label: '👁️ Accessibility & Readability' },
    { value: 'Navigation & Usability', label: '🛠️ Navigation & Usability' },
    { value: 'Performance & Speed', label: '⚡ Performance & Speed' },
    { value: 'Mobile Optimization', label: '📲 Mobile Optimization' },
    { value: 'Interaction & Clickability', label: '👆 Interaction & Clickability' },
    { value: 'Conversion Rate Optimization', label: '🎯 Conversion Rate Optimization' },
  ];

  // Color scheme options
  const colorSchemes: SelectOption[] = [
    { value: 'Dark Mode UI', label: '⚫ Dark Mode UI' },
    { value: 'Light Mode UI', label: '⚪ Light Mode UI' },
    { value: 'Mixed (Toggle between light & dark)', label: '🌗 Mixed (Toggle between light & dark)' },
    { value: 'High-contrast colors', label: '🎨 High-contrast colors' },
    { value: 'Soft pastel colors', label: '🎭 Soft pastel colors' },
    { value: 'Not sure / Default', label: '🚫 Not sure / Default' },
  ];

  // Typography options
  const typographyOptions: SelectOption[] = [
    { value: 'Small & Dense Text (12-14px)', label: '🔤 Small & Dense Text (12-14px, like news sites)' },
    { value: 'Comfortable Reading (16-18px)', label: '📖 Comfortable Reading (16-18px, blog-like)' },
    { value: 'Large Text UI (20px+)', label: '🖥️ Large Text UI (20px+, minimal UI)' },
    { value: 'Corporate / Business Fonts', label: '🏢 Corporate / Business Fonts (Sans-serif)' },
    { value: 'Creative & Expressive Fonts', label: '🎨 Creative & Expressive Fonts (Handwritten, serif)' },
    { value: 'Tech & Modern UI Fonts', label: '🚀 Tech & Modern UI Fonts (Geometric, futuristic)' },
  ];

  // Layout options
  const layoutOptions: SelectOption[] = [
    { value: 'Grid-based Layout', label: '🏗️ Grid-based Layout (Consistent columns & rows)' },
    { value: 'Full-screen Layout', label: '🏞️ Full-screen Layout (Large images, minimal text)' },
    { value: 'Long-scrolling', label: '📜 Long-scrolling (Storytelling, blogs)' },
    { value: 'Card-based UI', label: '⬜ Card-based UI (Like dashboards)' },
    { value: 'List-based UI', label: '🔗 List-based UI (Text-heavy, bullet points)' },
    { value: 'Experimental/Asymmetrical Design', label: '🌀 Experimental/Asymmetrical Design' },
  ];

  // Button style options
  const buttonOptions: SelectOption[] = [
    { value: 'Rounded buttons', label: '⭕ Rounded buttons (Soft UI)' },
    { value: 'Sharp-edged buttons', label: '◼ Sharp-edged buttons (Minimalist UI)' },
    { value: 'Floating Action Buttons', label: '🎛️ Floating Action Buttons (FAB)' },
    { value: 'Large, bold CTA buttons', label: '🚀 Large, bold CTA buttons' },
    { value: 'Flat buttons', label: '🔲 Flat buttons (Subtle, text-based)' },
  ];

  // Animation options
  const animationOptions: SelectOption[] = [
    { value: 'Micro-interactions', label: '⚡ Micro-interactions (Subtle animations, hover effects)' },
    { value: 'Large, dramatic animations', label: '🎬 Large, dramatic animations' },
    { value: 'Looping effects / Auto-playing', label: '🔄 Looping effects / Auto-playing' },
    { value: 'No animations', label: '🚫 No animations (Static UI)' },
  ];

  // Accessibility options (multi-select)
  const accessibilityOptions: SelectOption[] = [
    { value: 'Colorblind-friendly palette', label: '🏳️‍🌈 Colorblind-friendly palette' },
    { value: 'Voice-assist & screen-reader support', label: '🎙️ Voice-assist & screen-reader support' },
    { value: 'High contrast & large text', label: '🔤 High contrast & large text' },
    { value: 'Motion reduction / no autoplay', label: '🔇 Motion reduction / no autoplay' },
    { value: 'None / Not sure', label: '🚫 None / Not sure' },
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
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image preview sidebar */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-20">
            <h3 className="text-xl font-semibold mb-3">Your Design</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm mb-4">
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="Your uploaded design" 
                  className="w-full object-contain"
                />
              )}
            </div>
            <p className="text-sm font-medium truncate mb-1">{fileName}</p>
            <p className="text-xs text-gray-500 mb-4">Add context about your UI to get the most relevant feedback</p>
            
            <div className="bg-[#00D1D1]/10 rounded-lg p-4 border border-[#00D1D1]/20">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00D1D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How This Works
              </h4>
              <ol className="text-sm space-y-1 text-gray-600">
                <li>1. Describe your UI using the form</li>
                <li>2. We'll generate a customized prompt</li>
                <li>3. AI analyzes your design</li>
                <li>4. Get tailored UX improvement feedback</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Describe Your UI Design</h2>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step indicator */}
            <div className="hidden md:flex justify-between items-center px-2">
              <div className="w-1/3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#00D1D1] flex items-center justify-center text-white font-semibold">1</div>
                <p className="text-xs mt-2 font-medium">Basic Information</p>
              </div>
              <div className="w-1/3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">2</div>
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">Design Details</p>
              </div>
              <div className="w-1/3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">3</div>
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">Accessibility</p>
              </div>
              <div className="absolute left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 top-5 -z-10"></div>
            </div>

            {/* Section 1: Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#00D1D1] flex items-center justify-center text-white text-xs font-bold mr-2">1</span>
                Basic Information
              </h3>
              
              {/* Platform Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="platformType">
                  Platform Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {platformTypes.slice(0, 4).map(option => (
                    <div
                      key={option.value}
                      className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                        formData.platformType === option.value 
                          ? 'border-[#00D1D1] bg-[#00D1D1]/5 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-[#00D1D1]/30'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, platformType: option.value }))}
                    >
                      <div className="font-medium text-center">
                        <div className="text-xl mb-1">{option.label.split(' ')[0]}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{option.label.split(' ').slice(1).join(' ')}</p>
                      </div>
                      {formData.platformType === option.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00D1D1] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <select
                  id="platformType"
                  name="platformType"
                  value={formData.platformType}
                  onChange={handleInputChange}
                  className="mt-3 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-[#00D1D1] focus:ring focus:ring-[#00D1D1]/10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Platform Type</option>
                  {platformTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="targetAudience">
                  Target Audience
                </label>
                <div className="flex flex-wrap gap-2">
                  {audienceTypes.slice(0, 4).map(option => (
                    <div
                      key={option.value}
                      className={`rounded-full px-4 py-2 text-sm cursor-pointer transition-all ${
                        formData.targetAudience === option.value 
                          ? 'bg-[#00D1D1] text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, targetAudience: option.value }))}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
                <select
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="mt-3 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-[#00D1D1] focus:ring focus:ring-[#00D1D1]/10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Target Audience</option>
                  {audienceTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Design Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold mr-2">2</span>
                Design Details
              </h3>

              {/* Main UX Focus */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Main UX Focus <span className="text-xs text-gray-500 dark:text-gray-400">(Select 1-3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map(option => (
                    <div
                      key={option.value}
                      className={`rounded-lg px-3 py-2 text-sm cursor-pointer transition-all flex items-center ${
                        formData.mainFocus.includes(option.value) 
                          ? 'bg-[#00D1D1]/10 border border-[#00D1D1] text-[#00D1D1]' 
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => {
                        const e = {
                          target: {
                            value: option.value,
                            checked: !formData.mainFocus.includes(option.value)
                          }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleMultiSelectChange(e, 'mainFocus');
                      }}
                    >
                      {formData.mainFocus.includes(option.value) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {option.label.split(' ').slice(1).join(' ')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Design System */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Scheme */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Color Scheme
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {colorSchemes.slice(0, 3).map(option => (
                      <div
                        key={option.value}
                        className={`p-2 rounded-md cursor-pointer flex items-center ${
                          formData.colorScheme === option.value 
                            ? 'ring-2 ring-[#00D1D1]' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, colorScheme: option.value }))}
                      >
                        {option.value.includes('Dark') && (
                          <div className="w-8 h-8 bg-gray-900 rounded-full mr-2"></div>
                        )}
                        {option.value.includes('Light') && (
                          <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded-full mr-2"></div>
                        )}
                        {option.value.includes('Mixed') && (
                          <div className="w-8 h-8 rounded-full mr-2 bg-gradient-to-r from-gray-900 to-gray-100"></div>
                        )}
                        <span className="text-sm">{option.value.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                  <select
                    id="colorScheme"
                    name="colorScheme"
                    value={formData.colorScheme}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-[#00D1D1] focus:ring focus:ring-[#00D1D1]/10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Color Scheme</option>
                    {colorSchemes.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Typography */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Typography
                  </label>
                  <select
                    id="typography"
                    name="typography"
                    value={formData.typography}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-[#00D1D1] focus:ring focus:ring-[#00D1D1]/10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Typography Style</option>
                    {typographyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Accessibility & Animation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold mr-2">3</span>
                Accessibility Features
              </h3>
              
              {/* Accessibility Features */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {accessibilityOptions.filter(o => o.value !== 'None / Not sure').map(option => (
                    <div
                      key={option.value}
                      className={`rounded-lg px-3 py-2 text-sm cursor-pointer transition-all flex items-center gap-2 ${
                        formData.accessibilityFeatures.includes(option.value) 
                          ? 'bg-[#00D1D1]/10 border border-[#00D1D1] text-[#00D1D1]' 
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => {
                        const e = {
                          target: {
                            value: option.value,
                            checked: !formData.accessibilityFeatures.includes(option.value)
                          }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleMultiSelectChange(e, 'accessibilityFeatures');
                      }}
                    >
                      {option.label.split(' ')[0]}
                      {formData.accessibilityFeatures.includes(option.value) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <span className="font-semibold">Tip:</span> Adding accessibility information will help our AI provide more relevant feedback for creating inclusive designs.
                  </p>
                </div>
              </div>
                         
              {/* Animation Usage - more simplified */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Animation Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {animationOptions.map(option => (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-all text-center ${
                        formData.animationUsage === option.value 
                          ? 'border-[#00D1D1] bg-[#00D1D1]/5' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-[#00D1D1]/30'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, animationUsage: option.value }))}
                    >
                      {option.value.split(' ')[0]}
                    </div>
                  ))}
                </div>
                <input 
                  type="hidden"
                  name="animationUsage"
                  value={formData.animationUsage}
                />
              </div>
            </div>
                      
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-4 bg-[#00D1D1] text-white rounded-lg font-medium hover:bg-[#00D1D1]/90 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Generate AI UX Feedback</span>
              </button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                Our AI will analyze your design based on the context you provided
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackContext; 