import type { Message } from "../../lib/types";

export const ChatMessage = ({ author, time, content, avatar, color, bubbleColor }: Message) => {
  const isUser = author === "You";
  return (
    <div className={`flex items-start space-x-4 ${isUser ? "justify-end text-right" : ""}`}>
      {!isUser && (
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl ${color}`}>{avatar}</div>
      )}
      <div className={`max-w-[75%] flex-1  ${isUser ? "flex flex-col items-end" : ""}`}>
        <div className={`flex items-baseline space-x-2 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
          <p className="font-bold text-white">{author}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
        <div className={`mt-2 rounded-lg border  border-white/10 p-4 text-white ${bubbleColor} ${isUser ? "rounded-tr-none" : "rounded-tl-none"}`}>
          <p className="text-sm leading-relaxed text-left ">{content}</p>
        </div>
      </div>
      {isUser && (
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl ${color}`}>{avatar}</div>
      )}
    </div>
  );
};