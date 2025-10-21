import type { Participant } from "../../lib/types";
import { getPersonaDescription } from "../../lib/data";
import { CloseIcon } from "../icons";
import { motion } from "framer-motion";

export const ParticipantProfileModal = ({ isOpen, onClose, participant }: { isOpen: boolean, onClose: () => void, participant: Participant | null }) => {
    if (!isOpen || !participant) return null;

    return (
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
        transition: { duration: .3, ease: "easeOut" } 
    }}  className="fixed p-4 inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-sm rounded-2xl dark:bg-gradient-to-br dark:from-[#0a2a4a] dark:to-[#1e1e38] p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 cursor-pointer right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <CloseIcon />
                </button>
                <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full text-5xl ${participant.color}`}>
                    {participant.avatar}
                </div>
                <h2 className="text-2xl font-bold text-white">{participant.name}</h2>
                <p className="text-cyan-400 mb-4">{participant.role}</p>
                <p className="text-gray-300 text-sm">{getPersonaDescription(participant.name)}</p>
            </div>
        </motion.div>
    );
};