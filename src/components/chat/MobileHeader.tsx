import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Topic } from "../../lib/types";
import {
  MenuIcon,
  MoreVerticalIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
  DownloadIcon,
} from "../icons";

const ActionMenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface MobileHeaderProps {
  topic: Topic;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isActionsMenuOpen: boolean;
  setIsActionsMenuOpen: (isOpen: boolean) => void;
  setIsChangeTopicOpen: (isOpen: boolean) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  currentSpeedIndex: number;
  speedOptions: Array<{ label: string; delay: number }>;
  handleToggleSpeed: () => void;
  setIsExportModalOpen: (isOpen: boolean) => void;
  setIsRestartConfirmOpen: (isOpen: boolean) => void;
  setSelectedNewTopic: (topic: Topic | null) => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>; 
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  topic,
  isSidebarOpen,
  setIsSidebarOpen,
  isActionsMenuOpen,
  setIsActionsMenuOpen,
  setIsChangeTopicOpen,
  isPaused,
  setIsPaused,
  currentSpeedIndex,
  speedOptions,
  handleToggleSpeed,
  setIsExportModalOpen,
  setIsRestartConfirmOpen,
  setSelectedNewTopic,
  menuButtonRef, 
}) => {
  const actionsMenuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const actionsMenuRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    if (!isActionsMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(target) &&
        actionsMenuTriggerRef.current &&
        !actionsMenuTriggerRef.current.contains(target)
      ) {
        setIsActionsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActionsMenuOpen, setIsActionsMenuOpen]);

  return (
    <header className="relative flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 md:hidden dark:border-white/10">
      <button
        ref={menuButtonRef} 
        onClick={() => !isSidebarOpen && setIsSidebarOpen(true)}
        className="p-2"
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </button>

      <div
        onClick={() => setIsChangeTopicOpen(true)}
        className="flex cursor-pointer flex-col items-center"
      >
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          AI Therapy Chat
        </h1>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Topic: {topic.title}
        </span>
      </div>

      <div className="relative">
        <button
          ref={actionsMenuTriggerRef} 
          onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
          className="p-2"
          aria-label="Open actions menu"
        >
          <MoreVerticalIcon />
        </button>
        <AnimatePresence>
          {isActionsMenuOpen && (
            <motion.div
              ref={actionsMenuRef} 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }}
              className="absolute top-full right-0 z-20 mt-2 w-56 origin-top-right rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0a2a4a] dark:to-[#1e1e38] dark:shadow-2xl"
            >
              <ActionMenuItem
                icon={isPaused ? <PlayIcon /> : <PauseIcon />}
                label={isPaused ? "Resume" : "Pause"}
                onClick={() => { setIsPaused(!isPaused); setIsActionsMenuOpen(false); }}
              />
              <ActionMenuItem
                icon={<RefreshIcon />}
                label="Restart Debate"
                onClick={() => {
                  setSelectedNewTopic(null);
                  setIsRestartConfirmOpen(true);
                  setIsActionsMenuOpen(false);
                }}
              />
              <ActionMenuItem
                icon={
                  <span className="flex h-5 w-5 items-center justify-center font-bold">
                    {speedOptions[currentSpeedIndex]?.label ?? "1x"}
                  </span>
                }
                label="Toggle Speed"
                onClick={handleToggleSpeed} 
              />
              <ActionMenuItem
                icon={<DownloadIcon />}
                label="Export"
                onClick={() => { setIsExportModalOpen(true); setIsActionsMenuOpen(false); }}
              />
              <ActionMenuItem
                icon={<span className="text-sm font-semibold">CT</span>}
                label="Change Topic"
                onClick={() => { setIsChangeTopicOpen(true); setIsActionsMenuOpen(false); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};