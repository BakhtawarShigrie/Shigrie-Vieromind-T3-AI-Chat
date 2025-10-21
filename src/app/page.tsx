"use client";

import React, { useState } from "react";
import { TopicSelectionView } from "../components/chat/TopicSelectionView";
import { ChatView } from "../components/chat/ChatView";
import { ChatStats } from "../components/common/ChatStats";
import type { Message, Topic } from "../lib/types";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"topicSelection" | "chat">("topicSelection");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [duration, setDuration] = useState(0);

  const handleStartConversation = (topic: Topic) => {
    setSelectedTopic(topic);
    setMessages(topic.initialMessages);
    setDuration(0);
    setCurrentView("chat");
  };

  const handleChangeTopic = (topic: Topic) => {
    setSelectedTopic(topic);
  };
  
  const userMessageCount = messages.filter(msg => msg.author === "You").length;
  const engagement = messages.length > 0 ? Math.round((userMessageCount / messages.length) * 100) : 0;

  return (
    <div className="relative min-h-screen w-full bg-gray-100 font-sans text-gray-900 transition-colors duration-300 overflow-y-hidden dark:bg-gradient-to-br dark:from-[#224d78] dark:to-[#0c0c29] dark:shadow-2xl dark:text-gray-200 md:flex md:items-center md:justify-center">
      
      {currentView === "topicSelection" && (
        <div className="p-4">
            <TopicSelectionView onStart={handleStartConversation} />
        </div>
      )}

      {currentView === "chat" && selectedTopic && (
        <div className="flex w-full flex-col items-center md:space-y-4">
          <ChatView 
              topic={selectedTopic} 
              onChangeTopic={handleChangeTopic}
              messages={messages}
              setMessages={setMessages}
              duration={duration}
              setDuration={setDuration}
          />
          <div className="hidden w-full md:block">
            <ChatStats
                totalMessages={messages.length}
                duration={duration}
                participantCount={selectedTopic.participants.length}
                engagement={engagement}
            />
          </div>
        </div>
      )}
    </div>
  );
}