"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Message, Participant, Topic } from "../../lib/types";
import { getPersonaDescription, userParticipant } from "../../lib/data";
import { normalizeTo50_60Words, speedOptions } from "../../lib/utils";
import { useChatScroll } from "../../hooks/useChatScroll";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChangeTopicMobileModal } from "./ChangeTopicMobileModal";
import { StatsMobileModal } from "./StatsMobileModal";
import { ParticipantProfileModal } from "../modals/ParticipantProfileModal";
import { RestartConfirmModal } from "../modals/RestartConfirmModal";
import { ExportModal } from "../modals/ExportModal";
import { motion } from "framer-motion";

interface GeminiResponse {
  candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
}

export const ChatView = ({
  topic,
  onChangeTopic,
  messages,
  setMessages,
  duration,
  setDuration,
}: {
  topic: Topic;
  onChangeTopic: (topic: Topic) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}) => {

  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingParticipant, setTypingParticipant] = useState<Participant | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeedIndex, setCurrentSpeedIndex] = useState(3); // Default speed index
  const [topicMenuOpen, setTopicMenuOpen] = useState(false); // Desktop topic menu
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRestartConfirmOpen, setIsRestartConfirmOpen] = useState(false);
  const [viewingParticipant, setViewingParticipant] = useState<Participant | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false); // Mobile actions menu
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false); // Mobile stats
  const [isChangeTopicOpen, setIsChangeTopicOpen] = useState(false); // Mobile change topic
  const [selectedNewTopic, setSelectedNewTopic] = useState<Topic | null>(null);
  const [restartAfterExport, setRestartAfterExport] = useState(false);
  const maxMessages = 30;
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for AI response timer
  const consoleErrorStyle = "background: #d32f2f; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;";
  const consoleInfoStyle = "background: #1976d2; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;";
  const menuButtonRef = useRef<HTMLButtonElement | null>(null); // Ref for mobile menu button

  const {
    chatContainerRef,
    chatEndRef,
    unreadCount,
    handleScroll,
    handleScrollDownClick,
    scrollToBottom,
  } = useChatScroll(messages);

  const { isListening, handleMicClick } = useSpeechRecognition(
    userInput,
    setUserInput,
    setMessages,
  );

  const handleSendMessage = useCallback(() => {
    if (userInput.trim() === "" || messages.length >= maxMessages) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      author: userParticipant.name,
      content: userInput.trim(),
      avatar: userParticipant.avatar,
      color: userParticipant.color,
      bubbleColor: "bg-blue-600/50",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsPaused(false);
    setTimeout(() => scrollToBottom("auto"), 0);
  }, [userInput, messages.length, setMessages, scrollToBottom]); 

  const getAITypingResponse = useCallback(async () => {
        if (messages.length >= maxMessages) {
      console.log(
        "%cDebate Ended",
        consoleInfoStyle,
        `Maximum message limit of ${maxMessages} reached.`,
      );
      setIsLoading(false);
      setTypingParticipant(null);
      return;
    }
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.log(
        "%cAPI Key Error",
        consoleErrorStyle,
        "Shigrie's Support team: Please ensure the API key in the .env file is uncommented to get responses from Gemini.",
      );
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        author: "System",
        content: "Error: Gemini API key is not configured.",
        avatar: "⚙️",
        color: "bg-gray-500",
        bubbleColor: "bg-gray-700/50",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      setTypingParticipant(null);
      return;
    }
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

    if (messages.length === 0) {
      console.log("%cTyping Error", consoleErrorStyle, "No messages to respond to.");
      setIsLoading(false);
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const aiParticipants = topic.participants.filter((p) => p.name !== "You");
    const lastSpeakerIndex = aiParticipants.findIndex(
      (p) => p.name === lastMessage?.author,
    );
    const nextSpeaker =
      aiParticipants[(lastSpeakerIndex + 1) % aiParticipants.length];

    if (!nextSpeaker) {
      console.log(
        "%cTyping Error",
        consoleErrorStyle,
        "Could not determine the next speaker."
      );
      setIsLoading(false);
      return;
    }

      setTypingParticipant(nextSpeaker);
    setIsLoading(true);
    try {
      let userInterventionInstruction = "";
      if (lastMessage?.author === "You") {
        userInterventionInstruction = `IMPORTANT: The user, a participant, has just said: "${lastMessage.content}". Your primary task is to respond directly to the user's message, acknowledging their point while staying in character as ${nextSpeaker.name}.`;
      }
      const prompt = `
          You are an expert AI debate simulator generating the next response in a debate between multiple AI therapist personas.
          The topic: "${topic.title} - ${topic.description}".
          Participants & Personas:
          ${topic.participants.map((p) => `- ${p.name} (${p.role}): ${getPersonaDescription(p.name)}`).join("\n")}
          Conversation History:
          ${messages.map((msg) => `${msg.author}: ${msg.content}`).join("\n")}
          ${userInterventionInstruction}
          The next speaker is ${nextSpeaker.name}.
          RULES:
          1. Generate natural and meaningful response as ${nextSpeaker.name} complete sentences.
          2. The message must continue the debate logically and emotionally, keeping the therapist’s style and tone.
          3. The total message length should be between 50 and 60 words — NOT shorter or longer.
          4. Avoid first-person filler not relevant to the message (keep it concise and professional).
          5. Do NOT include "${nextSpeaker.name}:" before the text.
          6. Respond strictly in valid JSON format with a single key: {"content": "text here"}.
        `;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = (await res.json()) as { error?: { message?: string } };
        throw new Error(
          errorData.error?.message ?? `Gemini API request failed`,
        );
      }
      const data = (await res.json()) as GeminiResponse;
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) throw new Error("Gemini returned an empty response.");
      const cleanedText = textContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedContent = JSON.parse(cleanedText) as { content: string };

      if (nextSpeaker && parsedContent.content) {
        const normalized = normalizeTo50_60Words(parsedContent.content);
        const colorName = nextSpeaker.color
          .replace("bg-", "")
          .replace("-500", "");
        const newMessage: Message = {
          id: crypto.randomUUID(),
          author: nextSpeaker.name,
          content: normalized,
          avatar: nextSpeaker.avatar,
          color: nextSpeaker.color,
          bubbleColor: `bg-${colorName}-600/50`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      const errorMessageText =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.log(
        "%cAPI Request Failed",
        consoleErrorStyle,
        `Could not fetch AI response. Reason: ${errorMessageText}`,
      );
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        author: "System",
        content: `Error: ${errorMessageText}`,
        avatar: "⚙️",
        color: "bg-gray-500",
        bubbleColor: "bg-gray-700/50",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTypingParticipant(null);
    }
  }, [messages, topic, setMessages, maxMessages]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const isDebateActive = !isPaused && !isExportModalOpen && !isRestartConfirmOpen && !viewingParticipant && messages.length < maxMessages;
    if (!isDebateActive) {
      setIsLoading(false); setTypingParticipant(null); return;
    }
    const lastMessageAuthor = messages.length > 0 ? messages[messages.length - 1]?.author : null;
    const delay = lastMessageAuthor === "You" ? 1500 : speedOptions[currentSpeedIndex]?.delay ?? 3000;
    timerRef.current = setTimeout(() => { void getAITypingResponse(); }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [ messages, isPaused, currentSpeedIndex, isExportModalOpen, isRestartConfirmOpen, viewingParticipant, getAITypingResponse, maxMessages ]);

  useEffect(() => {
    const isDebateActive = !isPaused && !isExportModalOpen && !isRestartConfirmOpen && !viewingParticipant && messages.length < maxMessages;
    let interval: NodeJS.Timeout | null = null;
    if (isDebateActive) {
      interval = setInterval(() => { setDuration((prev) => prev + 1); }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [ isPaused, isExportModalOpen, isRestartConfirmOpen, viewingParticipant, messages.length, setDuration, maxMessages ]);

  const resetForNewTopic = useCallback((newTopic: Topic) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessages(newTopic.initialMessages);
    setUserInput("");
    setTopicMenuOpen(false); setIsPaused(false); setDuration(0);
    onChangeTopic(newTopic); // Call parent handler
    setSelectedNewTopic(null);
    setIsLoading(false); setTypingParticipant(null);
    setTimeout(() => scrollToBottom("auto"), 50);
  }, [setMessages, setDuration, onChangeTopic, scrollToBottom]); 

  const handleResetDebate = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessages(topic.initialMessages);
    setUserInput("");
    setIsLoading(false); setTypingParticipant(null); setIsPaused(false); setDuration(0);
    setTimeout(() => scrollToBottom("auto"), 50);
  }, [topic.initialMessages, setMessages, setDuration, scrollToBottom]); 

  const handleCloseExportModal = useCallback(() => {
    setIsExportModalOpen(false);
    if (restartAfterExport) {
      if (selectedNewTopic) {
        resetForNewTopic(selectedNewTopic);
      } else {
        handleResetDebate();
      }
      setRestartAfterExport(false);
      setSelectedNewTopic(null);
    }
  }, [restartAfterExport, selectedNewTopic, resetForNewTopic, handleResetDebate]); 

  const handleConfirmRestart = useCallback(() => {
      if (selectedNewTopic) { resetForNewTopic(selectedNewTopic); }
      else { handleResetDebate(); }
      setIsRestartConfirmOpen(false);
  }, [selectedNewTopic, resetForNewTopic, handleResetDebate]); 

  const handleSaveAndRestart = useCallback(() => {
      setIsRestartConfirmOpen(false);
      setRestartAfterExport(true);
      setIsExportModalOpen(true);
  }, []); 

    const handleToggleSpeed = useCallback(() => {
    setCurrentSpeedIndex((prev) => (prev + 1) % speedOptions.length);
  }, []); 

  const userMessageCount = messages.filter((msg) => msg.author === "You").length;
  const engagement = messages.length > 0 ? Math.round((userMessageCount / messages.length) * 100) : 0;

  return (
    <>
      <ParticipantProfileModal
        isOpen={!!viewingParticipant}
        onClose={() => setViewingParticipant(null)}
        participant={viewingParticipant}
      />
      <RestartConfirmModal
        isOpen={isRestartConfirmOpen}
        onClose={() => {
          setIsRestartConfirmOpen(false);
          setSelectedNewTopic(null);
        }}
        onConfirmRestart={handleConfirmRestart}
        onSave={handleSaveAndRestart}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={handleCloseExportModal}
        messages={messages}
        topicTitle={topic.title}
      />
      <ChangeTopicMobileModal
          isOpen={isChangeTopicOpen}
          currentTopicId={topic.id}
          onClose={() => setIsChangeTopicOpen(false)}
          onTopicSelect={(newTopic) => {
              setSelectedNewTopic(newTopic);
              setIsChangeTopicOpen(false);
              setIsRestartConfirmOpen(true);
          }}
      />
      <StatsMobileModal
          isOpen={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          totalMessages={messages.length}
          duration={duration}
          participantCount={topic.participants.length}
          engagement={engagement}
      />

      <motion.main
        key={topic.id} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
        className="flex h-screen w-full flex-col bg-white transition-colors duration-300 md:h-[calc(90vh-110px)] md:max-h-[700px] md:max-w-6xl md:rounded-2xl md:border md:border-gray-200 md:shadow-lg dark:bg-gray-900 dark:md:border-white/10 dark:md:bg-gradient-to-br dark:md:from-[#2a2a4a] dark:md:to-[#1e1e38]"
      >
        <DesktopHeader
          topic={topic}
          topicMenuOpen={topicMenuOpen}
          setTopicMenuOpen={setTopicMenuOpen}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          currentSpeedIndex={currentSpeedIndex}
          speedOptions={speedOptions}
          handleToggleSpeed={handleToggleSpeed}
          setIsExportModalOpen={setIsExportModalOpen}
          setIsRestartConfirmOpen={setIsRestartConfirmOpen}
          setSelectedNewTopic={setSelectedNewTopic}
        />
        <MobileHeader
          topic={topic}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isActionsMenuOpen={isActionsMenuOpen}
          setIsActionsMenuOpen={setIsActionsMenuOpen}
          setIsChangeTopicOpen={setIsChangeTopicOpen}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          currentSpeedIndex={currentSpeedIndex}
          speedOptions={speedOptions}
          handleToggleSpeed={handleToggleSpeed}
          setIsExportModalOpen={setIsExportModalOpen}
          setIsRestartConfirmOpen={setIsRestartConfirmOpen}
          setSelectedNewTopic={setSelectedNewTopic}
          menuButtonRef={menuButtonRef} 
        />

        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar
            participants={topic.participants}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            onSelectParticipant={setViewingParticipant}
            onOpenStats={() => setIsStatsModalOpen(true)}
            menuButtonRef={menuButtonRef} 
          />

          <div className="flex flex-1 flex-col overflow-hidden md:rounded-br-2xl lg:rounded-br-2xl dark:bg-gradient-to-br dark:from-[#0a2a4a] dark:to-[#1e1e38] dark:shadow-2xl">
            <MessageList
              messages={messages}
              isLoading={isLoading}
              typingParticipant={typingParticipant}
              chatContainerRef={chatContainerRef} 
              chatEndRef={chatEndRef}             
              unreadCount={unreadCount}
              handleScroll={handleScroll}
              handleScrollDownClick={handleScrollDownClick}
            />
            <ChatInput
              userInput={userInput}
              setUserInput={setUserInput}
              isListening={isListening}
              handleSendMessage={handleSendMessage}
              handleMicClick={handleMicClick}
            />
          </div>
        </div>
      </motion.main>
    </>
  );
};