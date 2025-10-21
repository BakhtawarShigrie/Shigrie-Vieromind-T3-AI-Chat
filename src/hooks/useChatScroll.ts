import { useState, useEffect, useRef, useCallback } from "react";
import type { Message } from "../lib/types"; 

export function useChatScroll(messages: unknown[]) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      chatEndRef.current?.scrollIntoView({ behavior });
    },
    [],
  );

  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (el) {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      if (isNearBottom) {
        setUnreadCount(0);
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    }
  }, []);

  useEffect(() => {
    const newMessagesCount = messages.length - prevMessagesLength.current;
    if (newMessagesCount > 0) {
      if (isAtBottom) {
        scrollToBottom("auto");
      } else {
        const newIncomingMessages = (messages as Message[]) 
          .slice(prevMessagesLength.current)
          .filter((m: Message) => m.author !== "You").length;
        if (newIncomingMessages > 0) {
          setUnreadCount((prev) => prev + newIncomingMessages);
        }
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, isAtBottom, scrollToBottom, setUnreadCount]);

  const handleScrollDownClick = useCallback(() => {
    scrollToBottom("smooth");
  }, [scrollToBottom]);

  return {
    chatContainerRef,
    chatEndRef,
    unreadCount,
    isAtBottom,
    handleScroll,
    handleScrollDownClick,
    scrollToBottom, 
  };
}