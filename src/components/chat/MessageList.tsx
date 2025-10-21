import React from "react";
import type { Message, Participant } from "../../lib/types";
import { ChatMessage } from "./ChatMessage";
import { ScrollDownButton } from "../common/ScrollDownButton";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  typingParticipant: Participant | null;
  chatContainerRef: React.RefObject<HTMLDivElement | null>; 
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  unreadCount: number;
  handleScroll: () => void;
  handleScrollDownClick: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  typingParticipant,
  chatContainerRef,
  chatEndRef,
  unreadCount,
  handleScroll,
  handleScrollDownClick,
}) => {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto">
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex-1 space-y-6 overflow-y-auto p-6" // Use scrollbar-hide if desired
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}

        {isLoading && typingParticipant && (
          <div className="flex items-center space-x-4">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl ${typingParticipant.color} animate-pulse`}
            >
              {typingParticipant.avatar}
            </div>
            <div className="text-sm italic text-gray-500 dark:text-gray-400">
              {typingParticipant.name} is typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <ScrollDownButton count={unreadCount} onClick={handleScrollDownClick} />
    </div>
  );
};