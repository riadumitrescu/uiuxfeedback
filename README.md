# AI-Powered UI/UX Feedback Tool

A modern web application that uses AI to provide detailed UI/UX feedback on design uploads. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Design Upload**: Drag-and-drop interface for uploading UI designs
- **Context Gathering**: Form to collect information about design context and goals
- **AI Analysis**: Processing of designs with the Gemini Vision API
- **Detailed Feedback**: AI-generated analysis of UX issues with specific areas highlighted
- **Light/Dark Mode**: Full support for both light and dark color schemes

## Technical Stack

- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Modern, responsive design with accessibility features

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/components`: React components
  - `ImageUpload.tsx`: Handles image uploads
  - `FeedbackContext.tsx`: Form to gather design context
  - `FeedbackResults.tsx`: Displays AI-generated feedback with highlighted issues

## Future Enhancements

- Integration with real design tools (Figma, Sketch)
- Team collaboration features
- Feedback history and comparison
- Customizable feedback categories

## License

MIT

## Acknowledgments

- This project was created as a demonstration of modern web development techniques
- Inspired by the growing need for automated UX feedback in the design workflow
