import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Squares2X2Icon, ListBulletIcon, ArrowDownTrayIcon, MagnifyingGlassIcon , ArrowPathIcon } from "@heroicons/react/24/solid";
import FileDetailsModal from "./FileDetailsModal"; // Import modal component
import Pagination from "./Pagination"; // Import pagination component
import axios from 'axios'

const FileView = ({refreshTrigger}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [files, setFiles] = useState([]); // Store fetched files
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filesPerPage = 6; // Adjust how many files per page

  // Fetch files from API
  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await axios.get("http://localhost:3000/files");

      console.log(response.data.files)
  
      setFiles(response.data.files || []); // Ensure it's an array
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

// Step 1: Filter files first
const filteredFiles = files.filter((file) => {
  const fileType = file.mimetype?.split("/")[0]?.toLowerCase() || "document";

  // Normalize filename (remove underscores, dashes, and lowercase everything)
  const normalizedFilename = file.filename.replace(/[_-]/g, " ").toLowerCase();
  const normalizedQuery = searchQuery.toLowerCase();

  return (
    normalizedFilename.includes(normalizedQuery) ||  // Match filename
    fileType.includes(normalizedQuery)              // Match file type (image, video, etc.)
  );
});

// Step 2: Apply Pagination AFTER filtering
const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
const currentPageSafe = Math.min(currentPage, totalPages) || 1; // Ensure valid page number
const startIndex = (currentPageSafe - 1) * filesPerPage;
const paginatedFiles = filteredFiles.slice(startIndex, startIndex + filesPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Bar & View Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        
        <div className="flex gap-2">
          {/*ReFetch btn */}
      <button
        className="p-2 cursor-pointer flex bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        onClick={() => fetchFiles()}
      >
        <ArrowPathIcon className="w-6 h-6" />
      </button>
          <button
            className={`p-2 cursor-pointer rounded transition ${
              viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Squares2X2Icon className="w-6 h-6" />
          </button>
          <button
            className={`p-2 cursor-pointer rounded transition ${
              viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewMode("list")}
          >
            <ListBulletIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Show Loading or Error */}
      {loading && <p className="text-gray-500 text-center">Loading files...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}


      {/* File Display */}
      {!loading && !error && (
        <>
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {paginatedFiles.length > 0 ? (
                paginatedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 rounded-lg shadow bg-white cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedFile(file)}
                  >
                    <p className="font-bold text-xl text-gray-700">{file.filename}</p>
                    <p className="text-sm text-gray-500">
                      {["image", "video", "audio"].includes(file.mimetype.split("/")[0])
                        ? file.mimetype.split("/")[0]
                        : "document"}
                    </p>
                    <button
                      className="mt-2 text-blue-500 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.fileUrl, "_blank");
                      }}
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">No files found.</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md"
            >
              {paginatedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border-b cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => setSelectedFile(file)}
                >
                  <div>
                    <p className="font-medium text-gray-800">{file.filename}</p>
                    <p className="text-sm text-gray-500">
                    {["image", "video", "audio"].includes(file.mimetype.split("/")[0])
                        ? file.mimetype.split("/")[0]
                        : "document"}
                    </p>
                  </div>
                  <button
                    className="text-blue-500 flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(file.fileUrl, "_blank");
                    }}
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </>
      )}

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <AnimatePresence>{selectedFile && <FileDetailsModal file={selectedFile} onClose={() => setSelectedFile(null)} />}</AnimatePresence>
    </div>
  );
};

export default FileView;