import { motion } from "framer-motion";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <motion.div
      className="flex justify-center items-center space-x-2 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Previous Button */}
      <button
        className={`px-4 py-2 rounded-md ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`px-3 py-2 rounded-md ${
            currentPage === index + 1
              ? "bg-blue-500 cursor-pointer text-white"
              : "bg-gray-200 cursor-pointer hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </motion.div>
  );
};

export default Pagination;
