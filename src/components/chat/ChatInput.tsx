import React from "react";
import { MicIcon, SendIcon } from "../icons";

const MAX_CHARS = 500; 

interface ChatInputProps {
  userInput: string;
  setUserInput: (value: string) => void; 
  isListening: boolean;
  handleSendMessage: () => void;
  handleMicClick: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  userInput,
  setUserInput,
  isListening,
  handleSendMessage,
  handleMicClick,
}) => {
  const isSendDisabled = userInput.trim() === "";

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value.slice(0, MAX_CHARS));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSendDisabled) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="m-4 rounded-4xl bg-gray-100 p-4 dark:bg-black/20"> 
      <div className="relative flex items-center">
        <textarea
          rows={1}
          placeholder="Type your message..."
          value={userInput}
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
          maxLength={MAX_CHARS}
          className="scrollbar-hide ml-3 w-full resize-none border-none bg-transparent pr-21 md:pr-39 text-sm leading-tight text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-gray-400"
          style={{ paddingTop: "0.625rem", paddingBottom: "0.625rem" }}
          aria-label="Chat message input"
        />
        <div className="absolute right-2 flex items-center space-x-1 sm:space-x-2">
          
          <p
            className={`hidden text-xs md:block ${
              userInput.length >= MAX_CHARS
                ? "font-semibold text-red-500"
                : "text-gray-400"
            }`}
            aria-live="polite"
          >
            {userInput.length}/{MAX_CHARS}
          </p>
          
          <button
            onClick={handleMicClick}
            className={`cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-white/10 ${
              isListening ? "bg-red-500/20" : ""
            }`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <MicIcon isListening={isListening} />
          </button>
         
          <button
            onClick={handleSendMessage}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600`}
            disabled={isSendDisabled}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};