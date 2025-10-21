import { motion } from "framer-motion"; 


const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex-1 rounded-lg bg-gray-100 p-5 text-center dark:bg-black/20">
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs mt-2 uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

export const ChatStats = ({ totalMessages, duration, participantCount, engagement }: { totalMessages: number; duration: number; participantCount: number; engagement: number }) => {
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60).toString().padStart(1, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
  };

  return (
      <motion.div
    initial={{ 
        opacity: 0, 
        y: 20, 
        scale: 0.95, 
        filter: 'blur(20px)' 
    }}
    animate={{
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: 'blur(0px)', 
        transition: { duration: 0.5, ease: "easeOut" } 
    }}
     className="w-full max-w-6xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0a2a4a] dark:to-[#1e1e38] dark:shadow-2xl">
              <div className="grid grid-cols-1 gap-6 md:flex">
                  <StatCard value={totalMessages} label="Total Messages" />
                  <StatCard value={formatTime(duration)} label="Duration" />
                  <StatCard value={participantCount} label="Participants" />
                  <StatCard value={`${engagement}%`} label="Engagement" />
              </div>
          </div>
      </motion.div>
  );
};