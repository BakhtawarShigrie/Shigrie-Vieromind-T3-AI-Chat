import type { Topic } from "../../lib/types";
import { useCrystalEffect } from "../../hooks/useCrystalEffect"; 
import { motion } from "framer-motion";

export const TopicCard = ({
  topic,
  onSelect,
  isSelected,
}: {
  topic: Topic;
  onSelect: (id: number) => void;
  isSelected: boolean;
}) => {
  const cardRef = useCrystalEffect<HTMLButtonElement>(); 

  return (
    <motion.button
    initial={{ 
        opacity: 0, 
        y: 0, 
        scale: 0.55, 
        filter: 'blur(50px)' 
    }}
    animate={{
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: 'blur(0px)', 
        transition: { duration: 0.5, ease: "easeOut" } 
    }}
      ref={cardRef} 
      onClick={() => onSelect(topic.id)}
      className={`crystal-effect rounded-2xl p-6 text-left cursor-pointer transition-all duration-300
        ${
          isSelected
            ? "border-cyan-400 bg-cyan-900/40 shadow-lg shadow-cyan-500/20"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
        }`
      } 
    >
      <div className="mb-3 text-3xl">{topic.icon}</div>
      <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{topic.title}</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{topic.description}</p>
      <div className="flex items-center space-x-2">
        {topic.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/30 px-2 py-1 text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.button>
  );
};