import { GoogleGenerativeAI } from '@google/generative-ai';
import { initialAnalysisPrompt, uiComponentPrompt, uxEvaluationPrompt } from './geminiPrompts';

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

// Coordinate extraction prompt to identify UI elements more precisely
const COORDINATE_EXTRACTION_PROMPT = `
CRITICALLY IMPORTANT: Your task is to provide GENUINE, ULTRA-TAILORED UI/UX feedback on THIS SPECIFIC DESIGN.

STEP 1 - PRECISE DESIGN IDENTIFICATION:
Begin by stating EXACTLY what you see:
• What is this UI specifically for? (Be exact - e.g., "a job listing page for a healthcare recruiting platform")
• What exact screens/views are visible?
• What exact interactions/flows are represented?
• What specific industry standards apply to THIS design?

STEP 2 - ELEMENT INVENTORY:
Document the EXACT UI components present:
• Navigation elements: Specify exact navigation patterns and their placement
• Content elements: Describe specific content structure and organization
• Interactive elements: List specific interactive controls you can see
• Visual design: Note exact colors, typography, layout principles used

STEP 3 - TARGETED FEEDBACK:
Based ONLY on WHAT YOU CAN SEE, provide feedback in this EXACT format:

Issues to Address:

1. **[PRECISE ISSUE NAME REFERENCING A VISIBLE ELEMENT]** (HIGH/MEDIUM/LOW Priority)
Problem: [Describe exactly what's wrong with this specific element and why it matters in simple terms. Never mention coordinates or technical specifications in this description.]
Recommendation: [Provide 2-3 specific, actionable steps with exact measurements, colors, or techniques. Include specific changes that should be made, not general advice.]
Design Principles Applied: [List relevant psychology principles that apply to this issue, using their emojis and names, e.g., "🧠 Cognitive Load", "👁️ Gestalt Principles"]
Coordinates: x:[10-85]%, y:[10-85]%, width:[5-30]%, height:[5-30]%

Things You Did Right:
- [Specific positive aspect with evidence from what you can see]
- [Another specific strength with exact details]
- [At least 3-4 positive points that show what works well in the design]

REQUIREMENTS:
• ACCESSIBLE LANGUAGE: Use simple, clear language that non-designers can easily understand. Avoid jargon and technical terms.
• EXPLAIN CONCEPTS: When mentioning design principles, briefly explain why they matter in practical terms.
• CONVERSATIONAL TONE: Write as if talking to a friend, not delivering a technical assessment.
• PRACTICAL EXAMPLES: Include real-world examples of how improvements will benefit users.
• ULTRA-PRECISE TARGETING: Coordinates must EXACTLY outline the specific UI element being discussed - be extremely precise and focus on the exact feature mentioned in the issue.
• CONSTRAINED COORDINATES: Use x/y values between 10-85% and width/height between 5-30%.
• ACTIONABLE RECOMMENDATIONS: Start each recommendation with an action verb (e.g., "Increase", "Reduce", "Align").
• NO TECHNICAL COORDINATES: Don't mention x/y positions or technical specifications in your written feedback.
• POSITIVE FEEDBACK: Always include at least 3-4 genuine positive aspects of the design.
• DESIGN PRINCIPLES: For each issue, list relevant psychology principles with their emojis and names.

Your feedback should feel like it was written by an expert who studied THIS SPECIFIC design extensively, but explained in a way that anyone can understand, regardless of their design background.
`;

// Function to analyze an image with a custom prompt
export const analyzeUIUXWithCustomPrompt = async (
  imageFile: File,
  customPrompt: string
): Promise<{ text: string; status: 'success' | 'error'; error?: string; fullResponse?: string }> => {
  try {
    // Convert the image to the format expected by the Gemini API
    const imagePart = await fileToGenerativePart(imageFile);

    // Create a model instance with appropriate configuration
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.01, // Ultra-low temperature for maximum precision
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 4096,
      }
    });

    // Add coordinate extraction instructions to the custom prompt
    const enhancedPrompt = `
You are a world-renowned UI/UX design consultant with 20+ years of experience critiquing interfaces for the most prestigious tech companies and design agencies.

Your expertise is in providing EXCEPTIONALLY SPECIFIC, action-oriented feedback that precisely identifies real issues in the exact design you're analyzing.

${customPrompt}

CRITICAL INSTRUCTIONS FOR THIS ANALYSIS:

1. FIRST, DEEPLY UNDERSTAND THE DESIGN: Spend time considering what exact problem this interface is solving and for whom.

2. ANALYZE ONLY WHAT YOU CAN SEE: Do not make up UI elements that aren't visible in the image.

3. BE CONCRETE AND SPECIFIC: Every piece of feedback must reference exact UI elements visible in the image.

4. PROVIDE PRECISE COORDINATES: Each issue needs exact x/y/width/height values (as percentages). 
   IMPORTANT: Keep x and y values between 10-90%, and width/height between 5-40% to ensure highlighting stays within visible bounds.

5. AVOID GENERIC FEEDBACK: Every comment should be so specific to this design that it couldn't possibly apply to any other interface.

${COORDINATE_EXTRACTION_PROMPT}

Remember: Your goal is to provide feedback a senior designer would find genuinely insightful and specific to their actual work.
`;
    
    console.log("Analyzing UI/UX with custom prompt...");
    
    // First attempt with detailed prompt
    let analysisText = "";
    try {
      const analysisResult = await model.generateContent([enhancedPrompt, imagePart]);
      analysisText = await analysisResult.response.text();
    } catch (err) {
      console.warn("First analysis attempt failed:", err);
      // If first attempt fails, try with a more direct approach
      const fallbackPrompt = `
        You are a senior UI/UX designer analyzing THIS SPECIFIC design image.
        
        1. IDENTIFY what this exact design is for (be specific about product/purpose)
        2. LIST only UI elements you can clearly see in the image
        3. PROVIDE tailored feedback on specific visible elements
        
        For each issue, include precise coordinates (x:10-90%, y:10-90%, width:5-40%, height:5-40%)
        Keep coordinates within these bounds to ensure highlighting stays within the visible image.
        
        ONLY comment on elements you can actually see. NO generic advice.
        
        ${COORDINATE_EXTRACTION_PROMPT}
      `;
      
      const fallbackResult = await model.generateContent([fallbackPrompt, imagePart]);
      analysisText = await fallbackResult.response.text();
    }
    
    // Check if the response indicates this is not a UI/UX design
    if (analysisText.toLowerCase().includes("not a ui design") || 
        analysisText.toLowerCase().includes("not a ux design") ||
        analysisText.toLowerCase().includes("not a user interface") ||
        analysisText.toLowerCase().includes("unable to analyze") ||
        (analysisText.toLowerCase().includes("not") && analysisText.toLowerCase().includes("ui/ux design"))) {
      
      return {
        text: `It appears that the uploaded image is not a UI/UX design. Please upload an image showing a user interface design for analysis.`,
        status: 'error',
        error: 'Not a UI/UX design',
        fullResponse: analysisText
      };
    }

    // If we have coordinates, return the analysis
    if (analysisText.includes("Coordinates:") && analysisText.match(/x:\d+%/)) {
      // Clean up coordinates to ensure they're within bounds
      analysisText = ensureCoordinatesWithinBounds(analysisText);
      return {
        text: analysisText,
        status: 'success',
        fullResponse: analysisText
      };
    }
    
    // If no coordinates, make a second call specifically asking for them
    console.log("Coordinates missing from initial analysis, requesting specifically...");
    
    const coordinatePrompt = `
    Your UI/UX analysis was excellent, but you need to add PRECISE COORDINATES for each issue to enable visual highlighting.
    
    For each issue in your analysis, add exact coordinates that precisely locate the UI element being discussed:
    
    Format: Coordinates: x:[10-90]%, y:[10-90]%, width:[5-40]%, height:[5-40]%
    
    IMPORTANT: Keep coordinates within these bounds:
    - x and y values between 10-90%
    - width and height between 5-40%
    
    This ensures highlighting rectangles stay within the visible area of the image.
    
    Add these coordinates at the end of each issue's recommendations:
    ${analysisText}
    `;
    
    try {
      const coordinateResult = await model.generateContent([coordinatePrompt, imagePart]);
      analysisText = await coordinateResult.response.text();
      
      // Check if we now have coordinates
      if (!analysisText.includes("Coordinates:") || !analysisText.match(/x:\d+%/)) {
        // If still no coordinates, make one more attempt
        console.log("Still missing coordinates, making final attempt...");
        
        const finalAttemptPrompt = `
        I need EXACT COORDINATES for each issue you identified in this UI design.
        
        For EACH issue, add this line at the end of its section:
        Coordinates: x:[value]%, y:[value]%, width:[value]%, height:[value]%
        
        CRITICAL: Keep coordinates within these bounds:
        - x and y values between 10-90%
        - width and height between 5-40%
        
        This ensures highlighting rectangles stay within the visible image.
        
        Example:
        1. **Issue Title** (PRIORITY)
        Problem: Description...
        Problem Area: Area...
        Recommendation: Solution...
        Coordinates: x:25%, y:40%, width:30%, height:15%
        
        Please add these precisely positioned coordinates to each issue.
        `;
        
        const finalResult = await model.generateContent([finalAttemptPrompt, imagePart]);
        const finalText = await finalResult.response.text();
        
        // Check if we finally have coordinates
        if (finalText.includes("Coordinates:") && finalText.match(/x:\d+%/)) {
          analysisText = ensureCoordinatesWithinBounds(finalText);
        } else {
          // Give up and add fallback coordinates
          analysisText = addConstrainedFallbackCoordinates(analysisText);
        }
      } else {
        // Ensure coordinates are within bounds
        analysisText = ensureCoordinatesWithinBounds(analysisText);
      }
    } catch (err) {
      console.warn("Coordinate extraction attempts failed:", err);
      // Generate fallback coordinates
      analysisText = addConstrainedFallbackCoordinates(analysisText);
    }
    
    return {
      text: analysisText,
      status: 'success',
      fullResponse: analysisText
    };
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    
    return {
      text: "There was an error analyzing your design. Please try again or upload a different image.",
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to analyze an image using Gemini API - now with improved approach
export const analyzeUIUX = async (
  imageFile: File
): Promise<{ text: string; status: 'success' | 'error'; error?: string; fullResponse?: string }> => {
  try {
    // Check if there's a custom prompt in sessionStorage
    const customPrompt = sessionStorage.getItem('geminiPrompt');
    if (customPrompt) {
      // Use the custom prompt approach
      return analyzeUIUXWithCustomPrompt(imageFile, customPrompt);
    }
    
    // Otherwise, use our optimized two-step approach
    const imagePart = await fileToGenerativePart(imageFile);

    // Create a model instance with appropriate configuration
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.01, // Ultra-low temperature for maximum precision
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 4096,
      }
    });

    // STEP 1: Detailed design identification phase - understand exactly what we're looking at
    console.log("Step 1: Precise identification of the design...");
    
    const identificationPrompt = `
    You are a world-class UI/UX expert. First, PRECISELY identify what this specific design represents.
    
    Study this image carefully and identify:
    
    1. What specific product/service/application is this design for? Be ultra-specific.
    2. What exact screen/view/state is shown?
    3. What specific user workflows are represented?
    4. What industry-specific design patterns and standards apply?
    5. What exact UI elements and components are visible?
    
    Be extremely precise about what you can actually see in the image.
    If you cannot determine something with certainty, explicitly acknowledge that limitation.
    Avoid making assumptions about elements that aren't clearly visible.
    `;
    
    let designIdentification = "";
    try {
      const identificationResult = await model.generateContent([identificationPrompt, imagePart]);
      designIdentification = await identificationResult.response.text();
      
      // Check if it's not a UI/UX design
      if (designIdentification.toLowerCase().includes("not a ui design") || 
          designIdentification.toLowerCase().includes("not a user interface") ||
          (designIdentification.toLowerCase().includes("not") && designIdentification.toLowerCase().includes("ui/ux design"))) {
        
        return {
          text: `It appears that the uploaded image is not a UI/UX design. Please upload an image showing a user interface design for analysis.`,
          status: 'error',
          error: 'Not a UI/UX design',
          fullResponse: designIdentification
        };
      }
    } catch (err) {
      console.warn("Design identification step failed:", err);
      // Create a minimal identification to continue
      designIdentification = "This appears to be a user interface design with various UI elements.";
    }
    
    // STEP 2: Expert analysis based on precise identification
    console.log("Step 2: Performing expert analysis based on precise design identification...");
    
    const expertAnalysisPrompt = `
    Based on your identification of this design:

    ${designIdentification}

    Now provide expert-level UI/UX feedback for THIS EXACT design. Your feedback must be:

    1. ULTRA-SPECIFIC: Only mention elements you can actually see
    2. EVIDENCE-BASED: Reference visual details from the actual image
    3. ACTIONABLE: Provide specific, measurable recommendations
    4. PROPERLY LOCATED: Use precise coordinates for each issue

    IMPORTANT: For coordinates, use the following constraints:
    - x and y values between 10-90%
    - width and height between 5-40%

    This ensures all highlights stay within the visible image boundaries.

    ${COORDINATE_EXTRACTION_PROMPT}

    Focus on providing genuinely valuable, non-obvious insights that will help improve this specific design.
    Avoid generic UI/UX advice that could apply to any interface.
    `;
    
    let analysisText = "";
    try {
      const analysisResult = await model.generateContent([expertAnalysisPrompt, imagePart]);
      analysisText = await analysisResult.response.text();
    } catch (err) {
      console.warn("Expert analysis step failed:", err);
      
      // Try with a simplified expert prompt
      const simplifiedExpertPrompt = `
        As a senior UI/UX consultant, analyze this specific design with EXTREME PRECISION.
        
        1. Identify exactly what this specific interface is for
        2. Provide feedback ONLY on UI elements you can actually see
        3. Use coordinates between these ranges to ensure proper highlighting:
           - x and y values: 10-90%
           - width and height: 5-40%
        
        Be ultra-specific about exactly what you see in the image. No generic advice.
        
        ${COORDINATE_EXTRACTION_PROMPT}
      `;
      
      try {
        const fallbackResult = await model.generateContent([simplifiedExpertPrompt, imagePart]);
        analysisText = await fallbackResult.response.text();
      } catch (secondErr) {
        console.error("Both analysis attempts failed:", secondErr);
        return {
          text: "There was an error analyzing your design. Please try again.",
          status: 'error', 
          error: 'Analysis failed'
        };
      }
    }
    
    // Check if coordinates are present and properly formatted
    if (!analysisText.includes("Coordinates:") || !analysisText.match(/x:\d+%/)) {
      console.log("Coordinates missing from analysis, requesting specifically...");
      
      const coordinatePrompt = `
      Your UI/UX analysis was excellent, but you need to add PRECISE COORDINATES for each issue.
      
      For each issue, add coordinates that exactly locate the UI element:
      Coordinates: x:[10-90]%, y:[10-90]%, width:[5-40]%, height:[5-40]%
      
      IMPORTANT: Keep coordinates within these bounds to ensure highlights stay visible.
      Place these coordinates at the end of each issue's section.
      
      Here's your analysis - add coordinates to each issue:
      ${analysisText}
      `;
      
      try {
        const coordinateResult = await model.generateContent([coordinatePrompt, imagePart]);
        const coordinateText = await coordinateResult.response.text();
        
        // Check if we got coordinates this time
        if (coordinateText.includes("Coordinates:") && coordinateText.match(/x:\d+%/)) {
          analysisText = ensureCoordinatesWithinBounds(coordinateText);
        } else {
          // Fallback: generate constrained coordinates
          analysisText = addConstrainedFallbackCoordinates(analysisText);
        }
      } catch (err) {
        console.warn("Coordinate extraction attempt failed:", err);
        // Generate fallback coordinates
        analysisText = addConstrainedFallbackCoordinates(analysisText);
      }
    } else {
      // Ensure coordinates are properly constrained
      analysisText = ensureCoordinatesWithinBounds(analysisText);
    }
    
    // Combine all analyses for debugging
    const fullResponse = `
=== PRECISE DESIGN IDENTIFICATION ===
${designIdentification}

=== EXPERT UI/UX ANALYSIS ===
${analysisText}
`;

    // Store the full response in sessionStorage for debugging
    sessionStorage.setItem('fullGeminiAnalysis', fullResponse);

    return {
      text: analysisText, // We only return the analysis part to the UI
      status: 'success',
      fullResponse: fullResponse
    };
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    
    return {
      text: "There was an error analyzing your design. Please try again.",
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to ensure all coordinates in analysis text are within proper bounds
function ensureCoordinatesWithinBounds(analysisText: string): string {
  // Find all coordinate sections and adjust values if needed
  return analysisText.replace(
    /Coordinates:\s*x:(\d+\.?\d*)%\s*,\s*y:(\d+\.?\d*)%\s*,\s*width:(\d+\.?\d*)%\s*,\s*height:(\d+\.?\d*)%/gi,
    (match, x, y, width, height) => {
      // Parse values
      const xVal = parseFloat(x);
      const yVal = parseFloat(y);
      const widthVal = parseFloat(width);
      const heightVal = parseFloat(height);
      
      // Constrain values - more restrictive bounds for tighter targeting
      const newX = Math.max(10, Math.min(85, xVal));
      const newY = Math.max(10, Math.min(85, yVal));
      const newWidth = Math.max(5, Math.min(30, Math.min(widthVal, 90 - newX)));
      const newHeight = Math.max(5, Math.min(30, Math.min(heightVal, 90 - newY)));
      
      // Return formatted coordinates
      return `Coordinates: x:${newX}%, y:${newY}%, width:${newWidth}%, height:${newHeight}%`;
    }
  );
}

// Function to add constrained fallback coordinates to analysis
function addConstrainedFallbackCoordinates(analysisText: string): string {
  // Extract issue sections - look for numbered issues or sections with titles that might be issues
  const issueRegex = /(\d+[\.)]|\*\*[\w\s]+\*\*)/g;
  const issueIndices: number[] = [];
  let match;
  
  // Find all potential issue start positions
  while ((match = issueRegex.exec(analysisText)) !== null) {
    issueIndices.push(match.index);
  }
  
  // If we didn't find any issues, try to add coordinates to the whole text
  if (issueIndices.length === 0) {
    return analysisText + "\n\nCoordinates: x:50%, y:50%, width:25%, height:15%";
  }
  
  // Add coordinates to each issue
  let modifiedText = analysisText;
  let offset = 0;
  
  for (let i = 0; i < issueIndices.length; i++) {
    const currentIndex = issueIndices[i] + offset;
    const nextIndex = (i < issueIndices.length - 1) ? issueIndices[i + 1] + offset : modifiedText.length;
    
    // Extract the issue text
    const issueText = modifiedText.substring(currentIndex, nextIndex);
    
    // Skip if this issue already has coordinates
    if (issueText.includes("Coordinates:") && issueText.match(/x:\d+%/)) {
      continue;
    }
    
    // Generate different coordinates for each issue to spread them across the UI
    // Use a grid-like pattern to ensure even distribution
    const rows = Math.ceil(Math.sqrt(issueIndices.length));
    const cols = Math.ceil(issueIndices.length / rows);
    
    const colIndex = i % cols;
    const rowIndex = Math.floor(i / cols);
    
    // Calculate grid cell position (with margins)
    const cellWidth = 60 / cols;
    const cellHeight = 60 / rows;
    
    const x = 15 + colIndex * cellWidth; 
    const y = 15 + rowIndex * cellHeight;
    const width = Math.min(20, cellWidth * 0.8);
    const height = Math.min(15, cellHeight * 0.8);
    
    const coordinateText = `\nCoordinates: x:${x.toFixed(0)}%, y:${y.toFixed(0)}%, width:${width.toFixed(0)}%, height:${height.toFixed(0)}%\n`;
    
    // Insert coordinates at the end of this issue's text
    modifiedText = modifiedText.substring(0, nextIndex) + coordinateText + modifiedText.substring(nextIndex);
    
    // Update offset for subsequent insertions
    offset += coordinateText.length;
  }
  
  return modifiedText;
}

// Updated parser to better handle the structured response
export interface UXIssue {
  title: string;
  problem: string;
  impact?: string;
  recommendation: string;
  priority: string;
  category?: string;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  learning_resources?: string;
  designPrinciples?: string[];
}

export interface PositiveFeedback {
  category: string;
  detail: string;
  effectiveness: string;
  impact: string;
  context: string;
  learning: string;
  bestPracticeAlignment: string;
  implementationDetails: string;
  userBenefit: string;
  businessValue: string;
  innovationLevel: string;
  designPrinciples: string[];
  resources: {
    articles: string[];
    caseStudies: string[];
    documentation: string[];
    research: string[];
  };
}

export const parseGeminiResponse = (response: string): { positive: PositiveFeedback[], issues: UXIssue[] } => {
  console.log("PARSING RESPONSE:", response);
  
  // Safety check for null/undefined/empty response
  if (!response || typeof response !== 'string') {
    console.warn("Invalid response received:", response);
    return { 
      positive: [{
        category: "General",
        detail: "The analysis could not be processed. Please try again.",
        effectiveness: "N/A",
        impact: "N/A",
        context: "N/A",
        learning: "N/A",
        bestPracticeAlignment: "N/A",
        implementationDetails: "N/A",
        userBenefit: "N/A",
        businessValue: "N/A",
        innovationLevel: "N/A",
        designPrinciples: [],
        resources: {
          articles: [],
          caseStudies: [],
          documentation: [],
          research: []
        }
      }], 
      issues: [{
        title: "Analysis Error",
        priority: "high",
        problem: "The analysis service returned an invalid response.",
        recommendation: "Please try uploading your design again or check your internet connection.",
        coordinates: { x: 15, y: 15, width: 25, height: 15 }
      }] 
    };
  }
  
  // Initialize the result structure
  const result = {
    positive: [] as PositiveFeedback[],
    issues: [] as UXIssue[]
  };

  try {
    // Extract positive feedback section using various possible headers
    const positiveSectionRegex = /(?:Things You Did Right|Positive Aspects|What Works Well|What You're Doing Well|Strengths|Positive Elements):([\s\S]*?)(?=\n\n|\n(?:Areas for Improvement|Issues|Problems|$)|$)/i;
    const positiveSection = response.match(positiveSectionRegex);
    
    if (positiveSection && positiveSection[1]) {
      const positiveFeedback = positiveSection[1].trim();
      
      if (positiveFeedback) {
        // Split into individual feedback points
        const feedbackPoints = positiveFeedback.split(/\n\s*•\s*/).filter(point => point.trim().length > 0);
        
        feedbackPoints.forEach(point => {
          try {
            // Extract the structured components of each positive point
            const categoryMatch = point.match(/\[([^\]]+)\]:\s*([^\n]+)/);
            const whyMatch = point.match(/Why it'?s? effective:\s*([^\n]+)/i);
            const impactMatch = point.match(/Impact:\s*([^\n]+)/i);
            const contextMatch = point.match(/(?:Industry )?context:\s*([^\n]+)/i);
            const learningMatch = point.match(/Learning (?:point|value):\s*([^\n]+)/i);
            const bestPracticeMatch = point.match(/Best practice alignment:\s*([^\n]+)/i);
            const implementationMatch = point.match(/Implementation details:\s*([^\n]+)/i);
            const userBenefitMatch = point.match(/User benefit:\s*([^\n]+)/i);
            const businessValueMatch = point.match(/Business value:\s*([^\n]+)/i);
            const innovationMatch = point.match(/Innovation level:\s*([^\n]+)/i);
            
            // Extract design principles
            const principlesMatch = point.match(/Design Principles Applied:\s*([^\n]+)/i);
            const principles = principlesMatch ? principlesMatch[1].split(',').map(p => p.trim()) : [];
            
            // Extract resources
            const resourcesMatch = point.match(/Resources for Further Learning:([\s\S]*?)(?=\n\n|\n(?:Areas for Improvement|Issues|Problems|$)|$)/i);
            const resources = {
              articles: [] as string[],
              caseStudies: [] as string[],
              documentation: [] as string[],
              research: [] as string[]
            };
            
            if (resourcesMatch) {
              const resourcesText = resourcesMatch[1];
              const articleMatches = resourcesText.match(/\[Link to relevant article\/resource\]:\s*([^\n]+)/g);
              const caseStudyMatches = resourcesText.match(/\[Link to case study\]:\s*([^\n]+)/g);
              const docMatches = resourcesText.match(/\[Link to design system documentation\]:\s*([^\n]+)/g);
              const researchMatches = resourcesText.match(/\[Link to research paper\]:\s*([^\n]+)/g);
              
              resources.articles = articleMatches ? articleMatches.map(m => m.replace('[Link to relevant article/resource]:', '').trim()) : [];
              resources.caseStudies = caseStudyMatches ? caseStudyMatches.map(m => m.replace('[Link to case study]:', '').trim()) : [];
              resources.documentation = docMatches ? docMatches.map(m => m.replace('[Link to design system documentation]:', '').trim()) : [];
              resources.research = researchMatches ? researchMatches.map(m => m.replace('[Link to research paper]:', '').trim()) : [];
            }
            
            if (categoryMatch || whyMatch || impactMatch) {
              const feedback: PositiveFeedback = {
                category: categoryMatch ? categoryMatch[1].trim() : "Design Aspect",
                detail: categoryMatch ? categoryMatch[2].trim() : point.split('\n')[0].trim(),
                effectiveness: whyMatch ? whyMatch[1].trim() : "Effective implementation noted",
                impact: impactMatch ? impactMatch[1].trim() : "Positive user experience impact",
                context: contextMatch ? contextMatch[1].trim() : "Follows industry standards",
                learning: learningMatch ? learningMatch[1].trim() : "Demonstrates good design principles",
                bestPracticeAlignment: bestPracticeMatch ? bestPracticeMatch[1].trim() : "Aligns with category best practices",
                implementationDetails: implementationMatch ? implementationMatch[1].trim() : "Well-implemented design choices",
                userBenefit: userBenefitMatch ? userBenefitMatch[1].trim() : "Enhanced user experience",
                businessValue: businessValueMatch ? businessValueMatch[1].trim() : "Positive business impact",
                innovationLevel: innovationMatch ? innovationMatch[1].trim() : "Standard implementation",
                designPrinciples: principles,
                resources
              };
              
              result.positive.push(feedback);
            }
          } catch (pointError) {
            console.warn("Error processing positive feedback point:", pointError);
          }
        });
      }
    }
    
    // If no positive feedback was found or parsed, add a default one
    if (result.positive.length === 0) {
      result.positive.push({
        category: "General Design",
        detail: "Your design shows potential for improvement",
        effectiveness: "Basic design principles are applied",
        impact: "Provides foundation for user interaction",
        context: "Meets basic industry standards",
        learning: "Demonstrates understanding of core UI/UX concepts",
        bestPracticeAlignment: "Follows fundamental design guidelines",
        implementationDetails: "Standard implementation of design elements",
        userBenefit: "Basic user experience functionality",
        businessValue: "Foundation for business goals",
        innovationLevel: "Standard approach",
        designPrinciples: ["Visual Hierarchy", "Consistency", "Simplicity"],
        resources: {
          articles: ["https://www.nngroup.com/articles/ten-usability-heuristics/"],
          caseStudies: ["https://www.interaction-design.org/case-studies"],
          documentation: ["https://material.io/design"],
          research: ["https://www.nngroup.com/articles/"]
        }
      });
    }
    
    // Extract and parse issues section
    const issuesSectionRegex = /(?:Areas for Improvement|Issues to Address|Issues|Problems|Recommendations):([\s\S]*?)(?=\n\n\s*(?:Conclusion|Summary|$)|$)/i;
    const issuesMatch = response.match(issuesSectionRegex);
    let issuesSection = issuesMatch ? issuesMatch[1].trim() : response;
    
    // Split issues into blocks
    const issueBlocks = issuesSection.split(/(?:\n|^)\s*\d+\.\s+/).filter(block => block.trim().length > 0);
    
    issueBlocks.forEach((block, index) => {
      try {
        const issue: UXIssue = {
          title: "",
          priority: "medium",
          problem: "",
          recommendation: "",
          impact: "",
          learning_resources: "",
          category: ""
        };
        
        // Extract title (with or without markdown)
        const titleMatch = block.match(/\*\*([^*]+)\*\*/) || block.match(/^([^:\n(]+)(?:\s*\(|\s*:|\n)/);
        issue.title = titleMatch ? titleMatch[1].trim() : "UI Issue";
        
        // Extract category if present
        const categoryMatch = block.match(/\[([^\]]+)\]/);
        if (categoryMatch) {
          issue.category = categoryMatch[1].trim();
        }
        
        // Extract priority
        const priorityMatch = block.match(/\((HIGH|MEDIUM|LOW)[^)]*\)/i) || 
                               block.match(/Priority:\s*(HIGH|MEDIUM|LOW)/i) ||
                            block.match(/Priority\s*[:-]\s*(HIGH|MEDIUM|LOW)/i);
        issue.priority = (priorityMatch ? priorityMatch[1].toLowerCase() : "medium") as 'high' | 'medium' | 'low';
        
        // Extract problem description
        const problemMatch = block.match(/Problem\s*[:-]\s*([^]*?)(?=\n\s*(?:Impact|Recommendation|Coordinates|$))/i);
        issue.problem = problemMatch ? problemMatch[1].trim() : "UI issue identified";
        
        // Extract impact
        const impactMatch = block.match(/Impact\s*[:-]\s*([^]*?)(?=\n\s*(?:Recommendation|Coordinates|$))/i);
        issue.impact = impactMatch ? impactMatch[1].trim() : undefined;
        
        // Extract recommendation
        const recommendationMatch = block.match(/Recommendation\s*[:-]\s*([^]*?)(?=\n\s*(?:Learning|Coordinates|$))/i);
        issue.recommendation = recommendationMatch ? recommendationMatch[1].trim() : "Consider revising this element";
        
        // Extract learning resources
        const learningMatch = block.match(/Learning[^:]*:\s*([^]*?)(?=\n\s*(?:Coordinates|$))/i);
        issue.learning_resources = learningMatch ? learningMatch[1].trim() : undefined;
        
        // Extract design principles
        const principlesMatch = block.match(/Design Principles Applied:\s*([^]*?)(?=\n\s*(?:Coordinates|$))/i);
        if (principlesMatch) {
          const principlesText = principlesMatch[1].trim();
          // Extract principles with their emojis
          const principles = principlesText.split(',').map(p => p.trim());
          issue.designPrinciples = principles;
        }
        
        // Extract coordinates
        const coordinatesMatch = block.match(/Coordinates\s*[:-]\s*(?:x\s*:\s*(\d+\.?\d*)%\s*,\s*y\s*:\s*(\d+\.?\d*)%\s*,\s*width\s*:\s*(\d+\.?\d*)%\s*,\s*height\s*:\s*(\d+\.?\d*)%)/i);
        
        if (coordinatesMatch) {
          issue.coordinates = {
            x: parseFloat(coordinatesMatch[1]) || 15,
            y: parseFloat(coordinatesMatch[2]) || 15,
            width: parseFloat(coordinatesMatch[3]) || 25,
            height: parseFloat(coordinatesMatch[4]) || 15
          };
        } else {
          // Generate fallback coordinates based on issue index
          issue.coordinates = {
            x: 15 + (index % 3) * 20,
            y: 15 + Math.floor(index / 3) * 20,
            width: 25,
            height: 15
          };
        }
        
        result.issues.push(issue);
      } catch (blockError) {
        console.error("Error processing issue block:", blockError);
      }
    });
    
    // If no issues were successfully parsed, add a fallback issue
    if (result.issues.length === 0) {
      result.issues.push({
        title: "Analysis Error",
        priority: "high",
        problem: "No specific issues were identified in the design. This could mean either the design is well-implemented or the analysis couldn't process the image properly.",
        recommendation: "Please try uploading a clearer image or contact support if the issue persists.",
        coordinates: { x: 15, y: 15, width: 25, height: 15 }
      });
    }
    
    console.log("Parsed result:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return { 
      positive: [{
        category: "Analysis Error",
        detail: "Analysis parsing encountered an error",
        effectiveness: "N/A",
        impact: "N/A",
        context: "N/A",
        learning: "N/A",
        bestPracticeAlignment: "N/A",
        implementationDetails: "N/A",
        userBenefit: "N/A",
        businessValue: "N/A",
        innovationLevel: "N/A",
        designPrinciples: [],
        resources: {
          articles: [],
          caseStudies: [],
          documentation: [],
          research: []
        }
      }],
      issues: [{
        title: "Analysis Error",
        priority: "high",
        problem: "There was an error processing the analysis results. The system encountered an unexpected issue while analyzing your design.",
        recommendation: "Please try uploading your design again. If the problem persists, try using a different image format or contact support.",
        coordinates: { x: 15, y: 15, width: 25, height: 15 }
      }] 
    };
  }
}; 