import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Topic } from "../../lib/types";
import { topics } from "../../lib/data";
import { CloseIcon } from "../icons";

interface ChangeTopicMobileModalProps {
  isOpen: boolean;
  currentTopicId: number | string;
  onClose: () => void;
  onTopicSelect: (topic: Topic) => void;
}

export const ChangeTopicMobileModal: React.FC<ChangeTopicMobileModalProps> = ({
  isOpen,
  currentTopicId,
  onClose,
  onTopicSelect,
}) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }}
            className="w-[90%] max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-gradient-to-br dark:from-[#0a2a4a] dark:to-[#12121c]"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select a New Topic
              </h2>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-white/10"
                aria-label="Close topic selection"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="max-h-60 space-y-3 overflow-y-auto pr-1"> 
              {topics
                .filter((t) => t.id !== currentTopicId)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onTopicSelect(t)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-gray-900 dark:text-white">
                          {t.title}
                        </div>
                        <div className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                          {t.description}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                        {t.tags?.slice(0, 2).join(" • ") ?? ""}
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};