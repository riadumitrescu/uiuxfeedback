import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseGeminiResponse, UXIssue, PositiveFeedback } from '../services/geminiService';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { AnimatePresence, motion } from 'framer-motion';
import { principles } from '../pages/PsychologyPrinciples';

const FeedbackResults: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [issues, setIssues] = useState<UXIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<UXIssue | null>(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [fullAnalysis, setFullAnalysis] = useState<string | null>(null);
  const [positiveFeedback, setPositiveFeedback] = useState<PositiveFeedback[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);

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

    // Debug logging
    console.log('Full Analysis from session storage:', storedAnalysis);

    // Parse the Gemini response to extract issues
    const parsedResult = parseGeminiResponse(storedAnalysis);
    
    // Debug logging
    console.log('Parsed Result:', parsedResult);
    
    if (parsedResult && parsedResult.issues) {
      // Filter out empty or generic issues
      const filteredIssues = parsedResult.issues.filter(issue => {
        // Check if the issue has meaningful content
        const hasTitle = issue.title && issue.title.trim().length > 0 && issue.title !== "UI Issue";
        const hasProblem = issue.problem && issue.problem.trim().length > 0 && issue.problem !== "UI issue identified";
        const hasRecommendation = issue.recommendation && issue.recommendation.trim().length > 0;
        
        return hasTitle && hasProblem && hasRecommendation;
      });
      
      setIssues(filteredIssues);
      
      if (filteredIssues.length > 0) {
        setSelectedIssue(filteredIssues[0]);
      }
    }
    
    // Set positive feedback
    if (parsedResult && parsedResult.positive && parsedResult.positive.length > 0) {
      setPositiveFeedback(parsedResult.positive);
    }
  }, [navigate]);

  const handleIssueClick = (issue: UXIssue) => {
    setSelectedIssue(issue);
  };

  const getPriorityColor = (priority: string) => {
    // Normalize priority to lowercase for consistency in comparisons
    const normalizedPriority = priority.toLowerCase();
    
    switch (normalizedPriority) {
      case 'high':
        return {
          bg: 'bg-red-500',
          text: 'text-red-800',
          bgLight: 'bg-red-100',
          bgDark: 'dark:bg-red-900/30',
          textDark: 'dark:text-red-300',
          border: 'border-red-500',
          highlight: 'rgba(239, 68, 68, 0.2)'
        };
      case 'medium':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-800',
          bgLight: 'bg-orange-100',
          bgDark: 'dark:bg-orange-900/30',
          textDark: 'dark:text-orange-300',
          border: 'border-orange-500',
          highlight: 'rgba(249, 115, 22, 0.2)'
        };
      case 'low':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-800',
          bgLight: 'bg-yellow-100',
          bgDark: 'dark:bg-yellow-900/30',
          textDark: 'dark:text-yellow-300',
          border: 'border-yellow-500',
          highlight: 'rgba(234, 179, 8, 0.2)'
        };
      default:
        // Default to medium priority if not specified
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-800',
          bgLight: 'bg-orange-100',
          bgDark: 'dark:bg-orange-900/30',
          textDark: 'dark:text-orange-300',
          border: 'border-orange-500',
          highlight: 'rgba(249, 115, 22, 0.2)'
        };
    }
  };

  // Function to render markdown content safely
  const renderMarkdown = (content: string) => {
    if (!content) return { __html: '' };
    
    // Replace technical coordinates with nothing
    const cleanedContent = content.replace(/\(x:[^)]+\)/g, '')
                                   .replace(/\([^)]*?(?:width|height|coordinates):[^)]*?\)/g, '')
                                   .replace(/\(\s*\d+%\s*,\s*\d+%\s*,\s*\d+%\s*,\s*\d+%\s*\)/g, '');
    
    // Replace *bold* with <strong> tags
    const boldContent = cleanedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert markdown to HTML using synchronous version
    const rawMarkup = marked.parse(boldContent) as string;
    
    // Sanitize HTML to prevent XSS
    const cleanHtml = DOMPurify.sanitize(rawMarkup);
    
    return { __html: cleanHtml };
  };
  
  // Function to format the recommendation steps
  const formatRecommendationSteps = (recommendation: string) => {
    if (!recommendation) return { __html: '' };
    
    // Split by newlines or bullet points
    const steps = recommendation.split(/\n\s*[-•*]|\n\s*\d+\.|\n+/).filter(step => step.trim().length > 0);
    
    // If there are no clear steps, return the original
    if (steps.length <= 1) {
      return renderMarkdown(recommendation);
    }
    
    // Format as numbered steps
    let html = '<ol class="list-decimal list-inside space-y-2 pl-1">';
    steps.forEach(step => {
      html += `<li class="pl-2">${DOMPurify.sanitize(marked.parse(step.trim()) as string)}</li>`;
    });
    html += '</ol>';
    
    return { __html: html };
  };

  // Handle image load to get dimensions for better coordinate calculation
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setImageLoaded(true);
  };

  // Function to make the highlight rectangles more precise
  const calculateAccurateRectanglePosition = (coordinates: {x: number, y: number, width: number, height: number}) => {
    // Add a small margin for better visibility around the element
    const margin = 0.5; // 0.5% margin

    return {
      left: `${Math.min(Math.max(coordinates.x - margin, 0), 100)}%`,
      top: `${Math.min(Math.max(coordinates.y - margin, 0), 100)}%`,
      width: `${Math.min(coordinates.width + (margin * 2), 100 - Math.min(Math.max(coordinates.x - margin, 0), 100))}%`,
      height: `${Math.min(coordinates.height + (margin * 2), 100 - Math.min(Math.max(coordinates.y - margin, 0), 100))}%`,
    };
  };

  if (!uploadedImage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9fa] to-[#e6f7f7] dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Design Analysis Results
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here's what our AI found in your design. Click on issues to see detailed feedback and recommendations.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-[#00D1D1] text-white rounded-xl hover:bg-[#00D1D1]/90 transition-colors text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Analyze Another Design
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Display */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00D1D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Your Design
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">Click on issues to highlight areas that need improvement</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-center">
                <div className="relative inline-block max-w-full" style={{ maxHeight: '650px' }}>
                  <img
                    src={uploadedImage}
                    alt="Uploaded UI Design"
                    className="max-w-full h-auto object-contain rounded-lg shadow-sm"
                    onLoad={handleImageLoad}
                    style={{ maxHeight: '650px' }}
                  />
                  {imageLoaded && selectedIssue?.coordinates && (
                      <div
                      className={`absolute border-2 ${getPriorityColor(selectedIssue.priority).border} pointer-events-none`}
                        style={{
                        ...calculateAccurateRectanglePosition(selectedIssue.coordinates),
                        backgroundColor: getPriorityColor(selectedIssue.priority).highlight,
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.3)',
                        zIndex: 10
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Positive Feedback Section */}
            {positiveFeedback.length > 0 && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    What You're Doing Well
                  </h2>
                </div>
                <div className="p-6">
                  <div className="p-5 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl">
                    <ul className="space-y-8 text-gray-700 dark:text-gray-300 text-base">
                      {positiveFeedback.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 dark:bg-green-900/50 dark:text-green-300 mt-0.5 mr-3 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          <div className="leading-relaxed flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <strong className="text-gray-900 dark:text-white">{item.category}</strong>
                              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</span>
                            </div>
                            
                            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Why it's effective:</span>
                                <span>{item.effectiveness}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Impact:</span>
                                <span>{item.impact}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Industry context:</span>
                                <span>{item.context}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Learning point:</span>
                                <span>{item.learning}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Best practice alignment:</span>
                                <span>{item.bestPracticeAlignment}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Implementation details:</span>
                                <span>{item.implementationDetails}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">User benefit:</span>
                                <span>{item.userBenefit}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Business value:</span>
                                <span>{item.businessValue}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Innovation level:</span>
                                <span>{item.innovationLevel}</span>
                              </div>
                              
                              {item.designPrinciples.length > 0 && (
                                <div className="mt-4">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Design Principles Applied:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {item.designPrinciples.map((principle, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                                        {principle}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {(item.resources.articles.length > 0 || 
                                item.resources.caseStudies.length > 0 || 
                                item.resources.documentation.length > 0 || 
                                item.resources.research.length > 0) && (
                                <div className="mt-4">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Resources for Further Learning:</span>
                                  <div className="mt-2 space-y-2">
                                    {item.resources.articles.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Articles:</span>
                                        <ul className="mt-1 space-y-1">
                                          {item.resources.articles.map((article, idx) => (
                                            <li key={idx}>
                                              <a href={article} target="_blank" rel="noopener noreferrer" 
                                                 className="text-sm text-green-600 dark:text-green-400 hover:underline">
                                                {article}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {item.resources.caseStudies.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Case Studies:</span>
                                        <ul className="mt-1 space-y-1">
                                          {item.resources.caseStudies.map((study, idx) => (
                                            <li key={idx}>
                                              <a href={study} target="_blank" rel="noopener noreferrer" 
                                                 className="text-sm text-green-600 dark:text-green-400 hover:underline">
                                                {study}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {item.resources.documentation.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentation:</span>
                                        <ul className="mt-1 space-y-1">
                                          {item.resources.documentation.map((doc, idx) => (
                                            <li key={idx}>
                                              <a href={doc} target="_blank" rel="noopener noreferrer" 
                                                 className="text-sm text-green-600 dark:text-green-400 hover:underline">
                                                {doc}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {item.resources.research.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Research:</span>
                                        <ul className="mt-1 space-y-1">
                                          {item.resources.research.map((research, idx) => (
                                            <li key={idx}>
                                              <a href={research} target="_blank" rel="noopener noreferrer" 
                                                 className="text-sm text-green-600 dark:text-green-400 hover:underline">
                                                {research}
                                              </a>
                          </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Columns: Issues List and Selected Issue */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 gap-8">
              {/* Issues List */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00D1D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Issues to Address
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">
                    Priority: <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span> High
                    <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mx-1 ml-2"></span> Medium
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mx-1 ml-2"></span> Low
                  </p>
              </div>
                <div className="p-4 max-h-[650px] overflow-y-auto">
                  <div className="space-y-4">
                  {issues.map((issue, index) => {
                      const priority = issue.priority?.toLowerCase() || 'medium';
                      const priorityColors = getPriorityColor(priority);
                    return (
                      <div
                        key={index}
                        onClick={() => handleIssueClick(issue)}
                          className={`p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedIssue === issue
                              ? `bg-[#00D1D1]/10 border-2 border-[#00D1D1] shadow-md`
                              : `hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-sm`
                        }`}
                      >
                        <div className="flex items-start">
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs mr-3 flex-shrink-0 ${priorityColors.bg}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                              <div className="flex items-center flex-wrap mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-base break-words mr-2">{issue.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full mt-1 flex-shrink-0 ${priorityColors.bgLight} ${priorityColors.text} ${priorityColors.bgDark} ${priorityColors.textDark}`}>
                                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{issue.problem}</p>
                            </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* Selected Issue Details */}
        {selectedIssue && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedIssue.title}</h2>
                        {selectedIssue.category && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Category: {selectedIssue.category}
                          </p>
                        )}
                      </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        getPriorityColor(selectedIssue.priority).bgLight} ${
                        getPriorityColor(selectedIssue.priority).text} ${
                        getPriorityColor(selectedIssue.priority).bgDark} ${
                        getPriorityColor(selectedIssue.priority).textDark
                      }`}>
                        {selectedIssue.priority.charAt(0).toUpperCase() + 
                        selectedIssue.priority.slice(1)} Priority
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Problem
                      </h3>
                      <div className="ml-7">
                        <p 
                          className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                          dangerouslySetInnerHTML={renderMarkdown(selectedIssue.problem)}
                        />
                      </div>
              </div>
              
              {selectedIssue.impact && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Impact
                  </h3>
                  <div className="ml-7">
                    <p 
                      className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                      dangerouslySetInnerHTML={renderMarkdown(selectedIssue.impact)}
                    />
                  </div>
                </div>
              )}

              {/* New Design Principles Applied Section */}
              {selectedIssue?.designPrinciples && selectedIssue.designPrinciples.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Design Principles Applied
                  </h3>
                  <div className="ml-7">
                    <div className="flex flex-wrap gap-2">
                      {selectedIssue.designPrinciples?.map((principle: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPrinciple(principle)}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                        >
                          {principle}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Action Steps
                      </h3>
                      <div className="ml-7">
                        <div className="p-5 bg-[#00D1D1]/10 border border-[#00D1D1] rounded-xl">
                          <div 
                            className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none text-base"
                            dangerouslySetInnerHTML={formatRecommendationSteps(selectedIssue.recommendation)}
                          />
              </div>
                </div>
              </div>

              {/* Add Principle Detail Modal */}
              <AnimatePresence>
                {selectedPrinciple && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedPrinciple(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {selectedPrinciple}
                            </h2>
                          </div>
                          <button
                            onClick={() => setSelectedPrinciple(null)}
                            className="text-gray-500 hover:text-[#00D1D1] dark:text-gray-400 dark:hover:text-[#00D1D1] transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-[#00D1D1] mb-2">
                              Articles
                            </h4>
                            <div className="space-y-2">
                              {principles.find((p: { name: string }) => p.name === selectedPrinciple)?.resources.articles.map((article: { title: string; url: string }, index: number) => (
                                <a
                                  key={index}
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#00D1D1] transition-colors">
                                      {article.title}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#00D1D1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-[#00D1D1] mb-2">
                              Case Studies
                            </h4>
                            <div className="space-y-2">
                              {principles.find((p: { name: string }) => p.name === selectedPrinciple)?.resources.caseStudies.map((study: { title: string; url: string }, index: number) => (
                                <a
                                  key={index}
                                  href={study.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#00D1D1] transition-colors">
                                      {study.title}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#00D1D1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-[#00D1D1] mb-2">
                              Research Papers
                            </h4>
                            <div className="space-y-2">
                              {principles.find((p: { name: string }) => p.name === selectedPrinciple)?.resources.research.map((paper: { title: string; url: string }, index: number) => (
                                <a
                                  key={index}
                                  href={paper.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#00D1D1] transition-colors">
                                      {paper.title}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#00D1D1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedIssue.learning_resources && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Learning Resources
                  </h3>
                  <div className="ml-7">
                    <p 
                      className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                      dangerouslySetInnerHTML={renderMarkdown(selectedIssue.learning_resources)}
                    />
                  </div>
                </div>
              )}

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
        </div>
      </div>
    </div>
  );
};

export default FeedbackResults; 