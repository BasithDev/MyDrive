import { motion } from "framer-motion";
import { useState } from "react";
import { XMarkIcon, ArrowDownTrayIcon, DocumentIcon, PhotoIcon, VideoCameraIcon, MusicalNoteIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const formatFileSize = (size) => {
  if (size >= 1_000_000_000) return (size / 1_000_000_000).toFixed(2) + " GB";
  if (size >= 1_000_000) return (size / 1_000_000).toFixed(2) + " MB";
  if (size >= 1_000) return (size / 1_000).toFixed(2) + " KB";
  return size + " bytes";
};

const FileDetailsModal = ({ file, onClose }) => {
  const [imageLoading, setImageLoading] = useState(true);
  
  if (!file) return null;
  
  const fileType = file.mimetype.split("/")[0];
  const fileExtension = file.filename.split('.').pop().toLowerCase();
  
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <PhotoIcon className="w-12 h-12 text-green-500" />;
      case 'video':
        return <VideoCameraIcon className="w-12 h-12 text-purple-500" />;
      case 'audio':
        return <MusicalNoteIcon className="w-12 h-12 text-pink-500" />;
      default:
        return <DocumentTextIcon className="w-12 h-12 text-blue-500" />;
    }
  };
  
  const getFileColorClass = () => {
    switch (fileType) {
      case 'image': return 'bg-green-50 border-green-200';
      case 'video': return 'bg-purple-50 border-purple-200';
      case 'audio': return 'bg-pink-50 border-pink-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      {/* Modal Content */}
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with file type banner */}
        <div className={`p-6 ${getFileColorClass()} border-b flex items-center`}>
          {/* File Icon */}
          <div className="bg-white p-3 rounded-lg shadow-sm flex-shrink-0">
            {getFileIcon()}
          </div>

          {/* File Details - Limit Width to Prevent Overflow */}
          <div className="ml-4 flex-grow min-w-0">
            <h2 className="text-xl font-bold text-gray-800 truncate max-w-[200px] sm:max-w-xs">
              {file.filename}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {fileType === "application" ? "Document" : fileType}
              {fileExtension && ` (.${fileExtension})`}
            </p>
          </div>

          {/* Close Button - Always Visible */}
          <button 
            className="p-2 hover:bg-white/50 rounded-full transition-colors flex-shrink-0"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* File Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-medium">Size</p>
              <p className="font-medium text-gray-800">{formatFileSize(file.size || 0)}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-medium">Type</p>
              <p className="font-medium text-gray-800">{file.mimetype || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg flex items-center">
            <CalendarDaysIcon className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Uploaded</p>
              <p className="font-medium text-gray-800">
                {new Date(file.uploadDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                })}
              </p>
            </div>
          </div>
          
          {/* Preview if it's an image */}
          {fileType === 'image' && file.fileUrl && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 relative">
              {/* Loading Spinner */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
                </div>
              )}
              
              {/* Image */}
              <img 
                src={file.fileUrl} 
                alt={file.filename} 
                className={`w-full h-auto object-contain ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                style={{maxHeight: "200px", transition: "opacity 0.3s ease"}}
                onLoad={handleImageLoad}
              />
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <a
              href={file.fileUrl}
              download={file.filename}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FileDetailsModal;