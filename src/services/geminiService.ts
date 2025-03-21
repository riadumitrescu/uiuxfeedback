import { GoogleGenerativeAI } from '@google/generative-ai';
import { INITIAL_ANALYSIS_PROMPT, UI_COMPONENT_UNDERSTANDING_PROMPT, UX_EVALUATION_PROMPT } from './geminiPrompts';

// Your API key
const API_KEY = 'AIzaSyDxvCyONeV1_BNVKiVBslJUAjO1Kon4Yq8';

// Create a client
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to convert a file to base64
export const fileToGenerativePart = async (file: File): Promise<{
  inlineData: { data: string; mimeType: string }
}> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]); // Remove the data URL prefix
      }
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

// Function to analyze an image using Gemini API - now with three-step approach
export const analyzeUIUX = async (
  imageFile: File
): Promise<{ text: string; status: 'success' | 'error'; error?: string; fullResponse?: string }> => {
  try {
    // Convert the image to the format expected by the Gemini API
    const imagePart = await fileToGenerativePart(imageFile);

    // Create a model instance with appropriate configuration
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.05, // Very low temperature for precise analysis
        topP: 0.97,
        topK: 40,
        maxOutputTokens: 4096,
      }
    });

    // STEP 1: Initial analysis to understand what's in the image
    console.log("Step 1: Performing initial analysis of the UI components...");
    const initialAnalysisResult = await model.generateContent([INITIAL_ANALYSIS_PROMPT, imagePart]);
    const initialAnalysis = await initialAnalysisResult.response.text();
    
    // STEP 2: Focused understanding of UI components
    console.log("Step 2: Refining understanding of UI components...");
    const componentUnderstandingPrompt = `${UI_COMPONENT_UNDERSTANDING_PROMPT}\n\nHere is the initial analysis of the UI:\n${initialAnalysis}`;
    const componentAnalysisResult = await model.generateContent([componentUnderstandingPrompt, imagePart]);
    const componentAnalysis = await componentAnalysisResult.response.text();
    
    // STEP 3: Detailed UX evaluation based on correct component understanding
    console.log("Step 3: Performing detailed UX evaluation based on correct component understanding...");
    const evaluationPrompt = `${UX_EVALUATION_PROMPT}\n\nHere is your initial analysis of the UI:\n${initialAnalysis}\n\nHere is your refined component analysis:\n${componentAnalysis}`;
    
    const evaluationResult = await model.generateContent([evaluationPrompt, imagePart]);
    const evaluationText = await evaluationResult.response.text();
    
    // Combine all analyses for debugging
    const fullResponse = `
=== STEP 1: INITIAL UI ANALYSIS ===
${initialAnalysis}

=== STEP 2: REFINED COMPONENT UNDERSTANDING ===
${componentAnalysis}

=== STEP 3: UX EVALUATION BASED ON CORRECT COMPONENT UNDERSTANDING ===
${evaluationText}
`;

    // Store the full response in sessionStorage for debugging
    sessionStorage.setItem('fullGeminiAnalysis', fullResponse);

    return {
      text: evaluationText, // We only return the evaluation part to the UI
      status: 'success',
      fullResponse: fullResponse
    };
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    return {
      text: '',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Updated parser to better handle the structured response
export interface UXIssue {
  number: string;
  title: string;
  problem: string;
  problemArea: string;
  recommendation: string;
  cropCoordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const parseGeminiResponse = (response: string): UXIssue[] => {
  const issues: UXIssue[] = [];
  
  // Updated regex to also capture coordinates
  const issueRegex = /(\d️⃣)\s+\*\*(.*?)\*\*\s+🔍\s+\*(Problem|Issue):\*\s+(.*?)\s+⚠️\s+\*(Problem Area|Issue Area):\*\s+(.*?)\s+✅\s+\*(Recommendation|Solution):\*\s+(.*?)(?:📍\s+\*(Coordinates):\*\s+x:(\d+)%,\s*y:(\d+)%,\s*width:(\d+)%,\s*height:(\d+)%)?(?=\d️⃣|$)/gi;
  
  let match;
  while ((match = issueRegex.exec(response))) {
    issues.push({
      number: match[1],
      title: match[2],
      problem: match[4],
      problemArea: match[6],
      recommendation: match[8],
      cropCoordinates: match[9] ? {
        x: parseInt(match[10]),
        y: parseInt(match[11]),
        width: parseInt(match[12]),
        height: parseInt(match[13])
      } : undefined
    });
  }
  
  // If no issues were found with the regex, try a more flexible approach
  if (issues.length === 0) {
    // Attempt a more flexible parsing
    const lines = response.split('\n');
    let currentIssue: Partial<UXIssue> = {};
    
    for (const line of lines) {
      if (line.includes('**') && line.match(/\d+/) && !currentIssue.title) {
        const numberMatch = line.match(/\d+/);
        const titleMatch = line.match(/\*\*(.*?)\*\*/);
        if (numberMatch && titleMatch) {
          currentIssue.number = numberMatch[0] + '️⃣';
          currentIssue.title = titleMatch[1];
        }
      } else if (line.includes('Problem:') || line.includes('Issue:')) {
        currentIssue.problem = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Problem Area:') || line.includes('Issue Area:')) {
        currentIssue.problemArea = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Recommendation:') || line.includes('Solution:')) {
        currentIssue.recommendation = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Coordinates:')) {
        // Try to extract coordinates
        const xMatch = line.match(/x:(\d+)%/);
        const yMatch = line.match(/y:(\d+)%/);
        const widthMatch = line.match(/width:(\d+)%/);
        const heightMatch = line.match(/height:(\d+)%/);
        
        if (xMatch && yMatch && widthMatch && heightMatch) {
          currentIssue.cropCoordinates = {
            x: parseInt(xMatch[1]),
            y: parseInt(yMatch[1]),
            width: parseInt(widthMatch[1]),
            height: parseInt(heightMatch[1])
          };
        }
        
        // If we have all the required fields, add the issue and reset
        if (currentIssue.number && currentIssue.title && currentIssue.problem && 
            currentIssue.problemArea && currentIssue.recommendation) {
          issues.push(currentIssue as UXIssue);
          currentIssue = {};
        }
      }
    }
  }
  
  return issues;
}; 