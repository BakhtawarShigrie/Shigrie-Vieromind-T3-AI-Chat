import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatStats } from "../common/ChatStats";
import { CloseIcon } from "../icons";

interface StatsMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMessages: number;
  duration: number;
  participantCount: number;
  engagement: number;
}

export const StatsMobileModal: React.FC<StatsMobileModalProps> = ({
  isOpen,
  onClose,
  totalMessages,
  duration,
  participantCount,
  engagement,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-gray-100 p-4 dark:bg-gray-900 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div className="mb-4 flex flex-shrink-0 items-center justify-between border-b border-gray-200 pb-4 dark:border-white/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Conversation Stats
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-200 dark:text-gray-500 dark:hover:bg-white/10"
              aria-label="Close stats"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ChatStats
              totalMessages={totalMessages}
              duration={duration}
              participantCount={participantCount}
              engagement={engagement}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};