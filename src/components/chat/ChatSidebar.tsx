import React, { useRef, useEffect } from "react";
import type { Participant } from "../../lib/types";
import { ParticipantCard } from "./ParticipantCard";
import { CloseIcon } from "../icons";

interface ChatSidebarProps {
  participants: Participant[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelectParticipant: (participant: Participant) => void;
  onOpenStats: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>; 
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  participants,
  isOpen,
  setIsOpen,
  onSelectParticipant,
  onOpenStats,
  menuButtonRef,
}) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen, menuButtonRef]);

  return (
    <>
    
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

     
      <aside
        ref={sidebarRef}
        className={`fixed sm:rounded-bl-3xl top-0 left-0 z-40 flex h-full w-64 flex-shrink-0 transform flex-col overflow-y-auto border-r border-gray-200 bg-white p-4 transition-transform duration-300 ease-in-out md:static md:h-auto md:w-64 md:translate-x-0 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1e1e38] dark:to-[#0a2a4a] dark:shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Participants and stats"
      >
       
        <div className="mb-4 mt-2 flex items-center justify-between ">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Participants
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-200 md:hidden dark:text-gray-500 dark:hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>

       
        <div className="flex-1 space-y-2 overflow-y-auto pr-1"> 
          {participants.map((p) => (
            <ParticipantCard
              key={p.name}
              {...p}
              onSelect={() => onSelectParticipant(p)}
            />
          ))}
        </div>

        <div className="mt-auto border-t pt-4 md:hidden dark:border-white/10">
          <button
            onClick={() => {
              onOpenStats();
              setIsOpen(false);
            }}
            className="w-full rounded-lg bg-gray-100 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Check stats
          </button>
        </div>
      </aside>
    </>
  );
};