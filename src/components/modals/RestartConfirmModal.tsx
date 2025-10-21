import { CloseIcon } from "../icons";
import { motion } from "framer-motion";

export const RestartConfirmModal = ({
  isOpen,
  onClose,
  onConfirmRestart,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestart: () => void;
  onSave: () => void;
}) => {
  if (!isOpen) return null;

  const handleConfirmAndClose = () => {
    onConfirmRestart(); 
    onClose(); 
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
          initial={{ 
              opacity: 0.5, 
              y: 0, 
              scale: .90, 
              filter: 'blur(20px)' 
          }}
          animate={{
              opacity: 1, 
              y: 0, 
              scale: 1, 
              filter: 'blur(0px)',
              transition: { duration: .3, ease: "easeOut" } 
          }} 
        className="relative w-full max-w-sm rounded-2xl dark:bg-gradient-to-br dark:from-[#0a2a4a] dark:to-[#12121c] p-8 m-4 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <CloseIcon />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">Restart Debate?</h2>
        <p className="mb-6 text-gray-400">
          If you restart, all previous messages will be deleted. Do you want to
          download your conversation first?
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onSave}
            className="w-full rounded-lg cursor-pointer bg-cyan-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-cyan-400"
          >
            Yes, Wanna save
          </button>
          <button
            onClick={handleConfirmAndClose}
            className="w-full rounded-lg cursor-pointer bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
          >
            Restart debate
          </button>
        </div>
      </motion.div>
    </div>
  );
};