import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ArrowUpTrayIcon, DocumentIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingText, setLoadingText] = useState("Please wait...");
  const fileInputRef = useRef(null);
  
  // Animated loading text effect
  useEffect(() => {
    if (!isUploading) return;
    
    const loadingTexts = ["Please wait...", "Loading...", "Uploading..."];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentIndex]);
    }, 800);
    
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length) {
      setSelectedFile(files[0]);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    const fileType = selectedFile.type.split('/')[0];
    
    switch (fileType) {
      case 'image':
        return <img 
          src={URL.createObjectURL(selectedFile)} 
          alt="Preview" 
          className="h-16 w-16 object-cover rounded" 
        />;
      default:
        return <DocumentIcon className="h-16 w-16 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      setUploadMessage("");

      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUploadMessage("Upload successful!");
      console.log("File uploaded:", response.data);

      // Reset after upload
      setSelectedFile(null);
      
      // Notify parent about successful upload and close modal
      if (onUploadSuccess) {
        // Short delay to show success message before closing
        setTimeout(() => {
          onUploadSuccess();
        }, 800);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMessage("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal Box */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upload File</h2>
              <button 
                className="hover:bg-gray-100 p-2 rounded-full transition-colors" 
                onClick={onClose}
                disabled={isUploading}
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Upload Area */}
            <div
              className={`mt-2 border-2 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"
              } p-8 rounded-xl text-center transition-all duration-200 ease-in-out ${
                selectedFile ? "bg-gray-50" : ""
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileChange} 
              />
              
              {!selectedFile ? (
                <div className="cursor-pointer flex flex-col items-center justify-center gap-3">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <ArrowUpTrayIcon className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">Drag & drop your file here</p>
                    <p className="text-gray-500 text-sm">or click to browse</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {getFileIcon()}
                  <div className="space-y-1 max-w-full overflow-hidden">
                    <p className="font-medium text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button 
                    className="text-sm text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Animated Loading Text */}
            {isUploading && (
              <motion.div 
                className="mt-4 flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex items-center space-x-2"
                >
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-blue-500 opacity-75 animate-ping absolute"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  </div>
                  <motion.span 
                    className="text-blue-500 font-medium"
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {loadingText}
                  </motion.span>
                </motion.div>
              </motion.div>
            )}

            {/* Upload Status Message */}
            {uploadMessage && (
              <div className={`mt-4 flex items-center justify-center gap-2 ${
                uploadMessage.includes("failed") ? "text-red-500" : "text-green-500"
              }`}>
                {uploadMessage.includes("failed") ? (
                  <ExclamationCircleIcon className="w-5 h-5" />
                ) : (
                  <CheckCircleIcon className="w-5 h-5" />
                )}
                <span>{uploadMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className={`px-5 py-2 font-medium rounded-lg transition-colors ${
                  !selectedFile || isUploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;