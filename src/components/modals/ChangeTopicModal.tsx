"use client";
import React from "react";
import { motion } from "framer-motion";

export const ChangeTopicModal = ({
  isOpen,
  onClose,
  onSelectTopic,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
}) => {
  if (!isOpen) return null;

  const topics = [
    "Is AI replacing human creativity?",
    "Should social media platforms be regulated more strictly?",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
    initial={{ 
        opacity: 0.5, 
        y: 0, 
        scale: 1, 
        filter: 'blur(20px)' 
    }}
    animate={{
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: 'blur(0px)', 
        transition: { duration: .5, ease: "easeOut" } 
    }} 
        className="w-[90%] max-w-sm rounded-2xl bg-[#2a2a4a] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white text-center mb-4">
          Select a New Topic
        </h2>

        <div className="space-y-3">
          {topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onSelectTopic(topic)}
              className="w-full rounded-lg bg-cyan-700/30 border border-cyan-600 text-white px-4 py-3 text-sm hover:bg-cyan-600/40 transition"
            >
              {topic}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};
