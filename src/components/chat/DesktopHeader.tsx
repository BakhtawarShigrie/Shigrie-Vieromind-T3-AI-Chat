import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Topic } from "../../lib/types";
import { topics } from "../../lib/data";
import {
  ChevronDownIcon,
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
} from "../icons";

interface DesktopHeaderProps {
  topic: Topic;
  topicMenuOpen: boolean;
  setTopicMenuOpen: (isOpen: boolean) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  currentSpeedIndex: number;
  speedOptions: Array<{ label: string; delay: number }>;
  handleToggleSpeed: () => void;
  setIsExportModalOpen: (isOpen: boolean) => void;
  setIsRestartConfirmOpen: (isOpen: boolean) => void;
  setSelectedNewTopic: (topic: Topic | null) => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  topic,
  topicMenuOpen,
  setTopicMenuOpen,
  isPaused,
  setIsPaused,
  currentSpeedIndex,
  speedOptions,
  handleToggleSpeed,
  setIsExportModalOpen,
  setIsRestartConfirmOpen,
  setSelectedNewTopic,
}) => {
  return (
    <header className="hidden flex-shrink-0 items-center justify-between rounded-t-2xl border-b border-gray-200 p-4 md:flex dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1e1e38] dark:to-[#0a2a4a] dark:shadow-2xl">
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Current Topic:
        </span>
        <div className="topic-menu-root relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTopicMenuOpen(!topicMenuOpen);
            }}
            className="flex w-96 cursor-pointer items-center justify-center space-x-2 rounded-lg bg-gray-100 px-3 py-1.5 text-gray-900 transition hover:bg-gray-200 dark:bg-black/20 dark:text-white dark:hover:bg-white/10"
          >
            <span className="font-semibold">{topic.title}</span>
            <motion.div
              animate={{ rotate: topicMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDownIcon />
            </motion.div>
          </button>
          <AnimatePresence>
            {topicMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: "easeOut" },
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                  transition: { duration: 0.5, ease: "easeIn" },
                }}
                className="absolute top-11 left-0 z-50 w-96 transform-gpu rounded-lg border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1e1e38] dark:to-[#0a2a4a]"
              >
                <div className="mb-2 text-xs text-gray-600 dark:text-gray-300">
                  Switch topic — start a new debate:
                </div>

                <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                  {topics
                    .filter((t) => t.id !== topic.id)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-white/10 dark:bg-black/20"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex-shrink-0 rounded-full bg-gray-200 px-3 py-2 text-lg dark:bg-white/5">
                            {t.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {t.title}
                            </div>
                            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {t.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 flex-col items-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedNewTopic(t);
                              setTopicMenuOpen(false); 
                              setIsRestartConfirmOpen(true); 
                            }}
                            className="whitespace-nowrap rounded-md bg-cyan-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-cyan-400"
                          >
                            Start
                          </button>
                          <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            {t.tags?.join(" • ") ?? ""}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-3 border-t border-gray-200 pt-2 dark:border-white/5">
                  <button
                    onClick={() => setTopicMenuOpen(false)}
                    className="w-full cursor-pointer rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-200 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
          aria-label={isPaused ? "Resume debate" : "Pause debate"}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button
          onClick={() => {
            setSelectedNewTopic(null); 
            setIsRestartConfirmOpen(true);
          }}
          className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
          aria-label="Restart debate"
        >
          <RefreshIcon />
        </button>
        <button
          onClick={handleToggleSpeed}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full p-2 text-sm font-bold transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
          aria-label={`Toggle speed, current: ${speedOptions[currentSpeedIndex]?.label ?? 'Default'}`}
        >
          {speedOptions[currentSpeedIndex]?.label ?? "1x"}
        </button>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
          aria-label="Export conversation"
        >
          <DownloadIcon />
        </button>
      </div>
    </header>
  );
};