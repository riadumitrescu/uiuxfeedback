import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ImageUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      handleFile(uploadedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile: File) => {
    // Check if it's an image
    if (!uploadedFile.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    // Store the file
    setFile(uploadedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prevProgress => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Store the image in session storage to pass to the next page
          if (preview) {
            sessionStorage.setItem('uploadedImage', preview);
            sessionStorage.setItem('uploadedFileName', file?.name || 'Uploaded Image');
          }
          
          // Navigate to the feedback context page after "upload" completes
          setTimeout(() => {
            navigate('/feedback-context');
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    simulateUpload();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Your UI Design</h2>
      
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDragging 
              ? 'border-[#00D1D1] bg-[#00D1D1]/5' 
              : 'border-gray-300 hover:border-[#00D1D1]'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileInput}
            accept="image/*"
            ref={fileInputRef}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">
              Drag & drop your UI design here<br />or <span className="text-[#00D1D1]">click to browse</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports JPG, PNG, GIF, WEBP (max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative border rounded-lg overflow-hidden shadow-md">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full object-contain max-h-96"
            />
            <button 
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="p-4 bg-black/5 border-t">
              <p className="font-medium truncate">{file?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{(file?.size || 0) / 1024 < 1000 
                ? `${Math.round((file?.size || 0) / 1024)} KB` 
                : `${Math.round((file?.size || 0) / 1024 / 1024 * 10) / 10} MB`}
              </p>
            </div>
          </div>
          
          {uploading ? (
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#00D1D1] h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm">
                {uploadProgress < 100 
                  ? `Uploading... ${uploadProgress}%` 
                  : 'Upload complete, redirecting...'}
              </p>
            </div>
          ) : (
            <button 
              onClick={handleUpload}
              className="w-full py-3 px-4 bg-[#00D1D1] text-white rounded-lg font-medium hover:bg-[#00D1D1]/90 transition-colors flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>Continue to UX Feedback Setup</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 