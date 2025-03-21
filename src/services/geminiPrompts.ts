// Stage 1: Initial analysis prompt to correctly identify UI components
export const INITIAL_ANALYSIS_PROMPT = `As an expert UI/UX designer with deep knowledge of mobile and web interface patterns, analyze this UI screenshot to identify the exact purpose and function of each component. Your analysis should demonstrate strong domain-specific knowledge of UI patterns.

CRITICAL: DO NOT make assumptions about functionality. ONLY describe what you can SEE and IDENTIFY with certainty.

1. What kind of application is this? (e.g., messaging app, e-commerce, social media, etc.)
   - Identify the specific screen/page shown
   - Note any recognizable UI patterns or design systems

2. For each visible UI element, analyze with extreme precision:
   - Exact purpose and function based on established UI patterns
   - Interactive vs non-interactive status
   - Relative importance in the interface hierarchy
   - Exact measurements (size, spacing, padding)
   - Color values and contrast ratios
   - Typography details (font size, weight, line height)

3. Specifically identify each of these with PRECISION:
   - Text elements: 
     * Headers (size, weight, color)
     * Body text (size, line height, color)
     * Messages (bubble style, padding)
     * Labels (position, alignment)
     * Placeholders (style, color)
   - Containers:
     * Cards (padding, shadow, border)
     * Panels (background, border)
     * Message bubbles (shape, padding, color)
     * Modal dialogs (overlay, animation)
   - Interactive elements:
     * Buttons (style, state, hover)
     * Decorative elements
     * Message content
   - Navigation elements:
     * Tabs (active state, indicator)
     * Menu items (spacing, icons)
     * Navigation bars (height, items)
   - Input fields:
     * Text inputs (height, padding)
     * Search bars (icon, placeholder)
     * Dropdown selectors (trigger, options)

4. For messaging/social apps:
   - Distinguish between message bubbles (content) vs interactive buttons
   - Identify which elements are user-generated content vs UI controls
   - Correctly label sender vs receiver content
   - Note message bubble styling (corners, padding, colors)

5. For any buttons or interactive elements:
   - Confirm they are ACTUALLY interactive based on standard UI patterns
   - Don't label text or content displays as "buttons" unless they have clear interactive affordances
   - Note exact dimensions and touch target sizes
   - Identify hover/active states
   
6. Create a detailed element inventory:
   [Element Type]: [Specific Purpose] - [Location] - [Interactive: Yes/No] - [Dimensions] - [Colors] - [Typography]

Your analysis must use INDUSTRY-STANDARD UI terminology and show expert understanding of UI/UX patterns.`;

// Stage 2: UI component understanding prompt 
export const UI_COMPONENT_UNDERSTANDING_PROMPT = `Based on your initial analysis, I need you to focus specifically on the UI COMPONENTS and their CORRECT FUNCTIONS. 

Carefully examine and correct any potential misidentifications from your first analysis:

1. VERIFY each component's true function with extreme precision:
   - Is it ACTUALLY a button or just styled text/content?
   - Is it ACTUALLY an input field or just a display element?
   - Is it ACTUALLY interactive or just visual information?
   - What are its EXACT dimensions and spacing?

2. For messaging or social apps specifically:
   - Message bubbles are NOT buttons - they contain MESSAGE CONTENT
   - Text within messages is CONTENT, not interactive elements
   - User content (posts, messages) is distinct from UI controls
   - Note exact bubble styling and content formatting

3. Revise your component inventory with extreme precision:
   - Component: [Exact Name]
   - Type: [Button | Text | Container | Message | Input | Icon | etc.]
   - Function: [Precise function in the interface]
   - Interactive: [Yes/No/Partial]
   - Location: [Precise location]
   - Dimensions: [Exact size and spacing]
   - Colors: [Exact color values]
   - Typography: [Font details if applicable]

This focused component analysis will be used for UX evaluation, so ACCURACY in identifying what components ACTUALLY ARE is crucial.`;

// Stage 3: UX evaluation prompt that builds on the correct component understanding
export const UX_EVALUATION_PROMPT = `Based on your precise component identification, evaluate the SPECIFIC UX/UI issues present in this exact interface.

IMPORTANT: Your feedback must directly reference the SPECIFIC UI elements you correctly identified, using their ACTUAL functions and purposes.

For each issue you identify:
1. Reference the ACTUAL component by its correct name and function
2. Describe the EXACT problem, with specific details about:
   - Position and layout
   - Size and spacing
   - Color values and contrast ratios
   - Typography details
   - Interactive states
3. Provide a CONCRETE, actionable recommendation with:
   - Exact measurements
   - Specific color values
   - Precise spacing
   - Typography specifications

Prioritize these key areas:
1. Contrast & Readability:
   - Text contrast ratios
   - Font sizes and weights
   - Line heights and spacing
   - Background colors

2. Touch Target Size:
   - Exact dimensions
   - Minimum size requirements
   - Spacing between targets
   - Interactive area calculations

3. Visual Hierarchy:
   - Component importance
   - Information density
   - Content grouping
   - Visual weight distribution

4. UI Consistency:
   - Component styling
   - Spacing patterns
   - Color usage
   - Typography system

5. Accessibility:
   - Color contrast
   - Text scaling
   - Touch targets
   - Screen reader compatibility

Your output MUST follow this EXACT format for each issue:

Issues to Address:
1️⃣ **[SPECIFIC TITLE WITH CORRECT COMPONENT FUNCTION]**  
   🔍 *Problem:* [DETAILED DESCRIPTION WITH SPECIFICS]  
   ⚠️ *Problem Area:* [EXACT CORRECT COMPONENT NAME + LOCATION]  
   ✅ *Recommendation:* [SPECIFIC, ACTIONABLE RECOMMENDATION WITH EXACT VALUES]
   📍 *Coordinates:* x:[X_POSITION]%, y:[Y_POSITION]%, width:[WIDTH]%, height:[HEIGHT]%

2️⃣ **[NEXT ISSUE TITLE]**  
   ...and so on

Do NOT recommend changes that would alter the core function of components you've identified. Focus on improving the existing design while respecting the established UI pattern.`; 