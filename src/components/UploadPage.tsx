import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile && previewUrl) {
      // Store the image and file name in session storage
      sessionStorage.setItem('uploadedImage', previewUrl);
      sessionStorage.setItem('uploadedFileName', selectedFile.name);
      
      // Navigate to the context page
      navigate('/context');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9fa] to-[#e6f7f7] dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Upload Your Design
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Upload a screenshot of your UI design to get instant AI-powered feedback and recommendations.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 bg-white dark:bg-gray-800 shadow-md ${
              isDragging
                ? 'border-[#00D1D1] bg-[#00D1D1]/5'
                : 'border-gray-300 dark:border-gray-600 hover:border-[#00D1D1] hover:bg-[#00D1D1]/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-96 mx-auto rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedFile?.name}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Choose Different Image
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-[#00D1D1] text-white rounded-xl hover:bg-[#00D1D1]/90 transition-colors shadow-lg font-medium"
                  >
                    Customize Feedback
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-[#00D1D1]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[#00D1D1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-[#00D1D1] hover:text-[#00D1D1]/80 font-medium"
                  >
                    Click to upload
                  </label>
                  <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG up to 10MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                />
                
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700 mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your image will be analyzed by our AI to provide specific UI/UX feedback.
                    We do not store your images on our servers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage; 