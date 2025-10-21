"use client";

import { useState } from "react";
import { topics } from "../../lib/data";
import type { Topic } from "../../lib/types";
import { TopicCard } from "./TopicCard";
import { useCrystalEffect } from "../../hooks/useCrystalEffect";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion"; 

export const TopicSelectionView = ({
  onStart,
}: {
  onStart: (topic: Topic) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(1);

  const handleStart = () => {
    if (selectedId !== null) {
      const topic = topics.find((t) => t.id === selectedId);
      if (topic) onStart(topic);
    }
  };

  const handleRandomSelect = () => {
    const availableTopics = topics.filter((t) => t.id !== selectedId);
    if (availableTopics.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTopics.length);
      const randomTopic = availableTopics[randomIndex];
      if (randomTopic) {
        setSelectedId(randomTopic.id);
      }
    }
  };

  const buttonVariants: Variants = {
    active: {
      background: [
        "linear-gradient(90deg, #2ddcff, #47539a, #41c0f6)",
        "linear-gradient(90deg, #f2dcbd, #65c8e7, #1f5d9f)",
        "linear-gradient(90deg, #56a5fa, #74f6f8, #7979fa)",
        "linear-gradient(90deg, #3586c8, #3144b1, #3affde)",
      ],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear",
      },
    },
    disabled: {
      background: "#6B7280",
      opacity: 0.7,
    },
  };

  const randomButtonRef = useCrystalEffect<HTMLButtonElement>();

  return (
    <main className="yy w-full max-w-4xl md:p-8">
      {/* NEW: Company Logo */}
      {/* <motion.div
      initial={{ 
          opacity: 0, 
          y: 0, 
          scale: 0, 
          filter: 'blur(50px)' // <-- Add initial blur
      }}
      animate={{
          opacity: 1, 
          y: 0, 
          scale: 1, 
          filter: 'blur(0px)', // <-- Animate to no blur
          transition: { duration: 0.5, ease: "easeOut" } 
      }} className="flex justify-center mb-4">
          <Image src="/logo.svg" alt="Company Logo" width={80} height={80} priority />
        </motion.div> */}

      <div className="mb-8 text-center md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: -50, filter: "blur(30px)", scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: 0.75, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.95,
          }}
        >
          <motion.h1
            initial={{
              backgroundPosition: "0% center",
              filter: "blur(.5px)",
              scale: 1.02,
            }}
            animate={{
              backgroundPosition: "200% center",
              filter: "blur(0px)",
              scale: 1,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, #f9f9f9, #41edd0, #6cb1e3, #ede793, #ffffff)",
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
            className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white"
          >
            Choose a Debate Topic
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select a topic to start the AI discussion
          </p>
        </motion.div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:mb-10 md:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onSelect={setSelectedId}
            isSelected={selectedId === topic.id}
          />
        ))}
      </div>

      <motion.div
        initial={{
          opacity: 0.5,
          y: 80,
          scale: 1,
          filter: "blur(50px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 1, ease: "easeOut" },
        }}
        className="mx-auto flex w-full max-w-xs flex-col gap-4 md:max-w-none md:flex-row md:justify-center"
      >
        <motion.button
          onClick={handleStart}
          disabled={!selectedId}
          variants={buttonVariants}
          animate={!selectedId ? "disabled" : "active"}
          whileHover={{
            scale: 1.01,
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-lg px-8 py-3 font-semibold text-white disabled:cursor-not-allowed"
        >
          Start Conversation
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          ref={randomButtonRef}
          onClick={handleRandomSelect}
          className="crystal-effect w-full cursor-pointer rounded-lg bg-gray-500/10 px-8 py-3 font-semibold text-gray-800 hover:scale-102 hover:bg-gray-500/20 dark:text-white dark:hover:bg-white/10"
        >
          Random Topic
        </motion.button>
      </motion.div>
    </main>
  );
};
