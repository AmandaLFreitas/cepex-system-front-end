import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { AnimatePresence, motion } from "framer-motion";

interface LoadingProps {
  open: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ open, message }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded shadow-lg w-1/4 h-[30%] overflow-y-auto"
          >
            <div className="w-full h-[100%] flex items-center justify-center flex-col">
              <ClipLoader size={100} className="mb-8" color="#000" />
              <p className="text-gray-800 text-center">
                {message ? message : ""}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
