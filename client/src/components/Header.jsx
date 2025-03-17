import { useState } from "react";
import UploadModal from "./UploadModal";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

const Header = ({ onUploadSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadSuccess = () => {
    setIsModalOpen(false);  // Close the modal
    if (onUploadSuccess) onUploadSuccess();  // Trigger refresh in parent
  };

  return (
    <>
      <header className="bg-gray-900 text-white shadow-md">
        <div className="mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold tracking-wide text-blue-400">MyDrive</h1>
          <div className="ml-auto">
            <button
              className="flex cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => setIsModalOpen(true)}
            >
              <CloudArrowUpIcon className="h-6 w-6" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default Header;