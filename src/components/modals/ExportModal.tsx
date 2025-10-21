"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import jsPDF from "jspdf";
import type { Message } from "../../lib/types";

export const ExportModal = ({
  isOpen,
  onClose,
  messages,
  topicTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  topicTitle: string;
}) => {
  const [format, setFormat] = useState("txt");
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeSenderName, setIncludeSenderName] = useState(true);
  const [includeTypingIndicators, setIncludeTypingIndicators] = useState(false);
  const [includeMyMessages, setIncludeMyMessages] = useState(true);

  if (!isOpen) return null;

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    let filteredMessages = messages;
    if (!includeMyMessages) {
      filteredMessages = messages.filter((msg) => msg.author !== "You");
    }

    const fileName = `debate-${topicTitle.toLowerCase().replace(/\s+/g, "-")}`;

    if (format === "txt") {
      let content = `Topic: ${topicTitle}\n\n`;
      filteredMessages.forEach((msg) => {
        if (includeTypingIndicators && msg.author !== "You" && msg.author !== "System") {
          content += `${msg.author} is typing...\n\n`;
        }
        const timestamp = includeTimestamps ? `[${msg.time}] ` : "";
        const sender = includeSenderName ? `${msg.author}: ` : "";
        content += `${timestamp}${sender}${msg.content}\n\n`;
      });
      downloadFile(content, `${fileName}.txt`, "text/plain");
    }

    if (format === "json") {
      const transcript: object[] = [];
      filteredMessages.forEach((msg) => {
        if (includeTypingIndicators && msg.author !== "You" && msg.author !== "System") {
          transcript.push({ type: "indicator", author: msg.author });
        }
        const messageObject: Record<string, unknown> = { type: "message", content: msg.content };
        if (includeSenderName) messageObject.author = msg.author;
        if (includeTimestamps) messageObject.time = msg.time;
        transcript.push(messageObject);
      });
      const content = JSON.stringify({ topic: topicTitle, transcript }, null, 2);
      downloadFile(content, `${fileName}.json`, "application/json");
    }

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Debate Topic: ${topicTitle}`, 10, 15);
      doc.setFontSize(11);
      let y = 25;

      const addTextToPdf = (text: string, isIndicator = false) => {
        if (isIndicator) {
          doc.setFont("helvetica", "italic");
          doc.setTextColor(128, 128, 128);
        }
        const splitLines = doc.splitTextToSize(text, 180) as string[];
        const pageHeight = doc.internal.pageSize.height;
        if (y + splitLines.length * 6 > pageHeight - 15) {
          doc.addPage();
          y = 20;
        }
        doc.text(splitLines, 10, y);
        y += splitLines.length * 6 + (isIndicator ? 2 : 4);
        if (isIndicator) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
        }
      };

      filteredMessages.forEach((msg) => {
        if (includeTypingIndicators && msg.author !== "You" && msg.author !== "System") {
          addTextToPdf(`${msg.author} is typing...`, true);
        }
        const timestamp = includeTimestamps ? `[${msg.time}] ` : "";
        const sender = includeSenderName ? `${msg.author}: ` : "";
        addTextToPdf(`${timestamp}${sender}${msg.content}`);
      });
      doc.save(`${fileName}.pdf`);
    }

    onClose();
  };

  const FormatOption = ({
    value,
    label,
    description,
    icon,
  }: {
    value: string;
    label: string;
    description: string;
    icon: string;
  }) => (
    <div
      onClick={() => setFormat(value)}
      className={`flex cursor-pointer items-center space-x-2 rounded-md border p-2 transition-all ${
        format === value ? "border-cyan-500 bg-cyan-900/30" : "border-gray-600 hover:border-gray-500"
      }`}
    >
      <div className="text-sm">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );

  const CheckboxOption = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <label className="flex items-center space-x-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3 w-3 rounded cursor-pointer bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600"
      />
      <span className="text-gray-300">{label}</span>
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3"
      onClick={onClose}
    >
      <motion.div
    initial={{ 
        opacity: 0.5, 
        y: 0, 
        scale: .95, 
        filter: 'blur(10px)' 
    }}
    animate={{
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: 'blur(0px)', 
        transition: { duration: .3, ease: "easeOut" } 
    }} 
        className="w-full max-w-sm rounded-xl dark:bg-gradient-to-br dark:from-[#0a2a4a] dark:to-[#12121c] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white">Export Conversation</h2>
        <p className="mb-4 text-xs text-gray-400">Download the complete transcript</p>

        <div className="space-y-2">
          <FormatOption
            value="txt"
            label="Plain Text"
            description="Simple text format"
            icon="TXT"
          />
          <FormatOption
            value="json"
            label="JSON Format"
            description="Structured data"
            icon="JSON"
          />
          <FormatOption
            value="pdf"
            label="PDF Document"
            description="Formatted document"
            icon="PDF"
          />
        </div>

        <div className="my-4 rounded-md bg-black/20 p-3">
          <h3 className="mb-2 text-sm font-semibold text-gray-200">Include Options</h3>
          <div className="space-y-2">
            <CheckboxOption
              label="Include timestamps"
              checked={includeTimestamps}
              onChange={(e) => setIncludeTimestamps(e.target.checked)}
            />
            <CheckboxOption
              label="Include sender names"
              checked={includeSenderName}
              onChange={(e) => setIncludeSenderName(e.target.checked)}
            />
            <CheckboxOption
              label="Include typing indicators"
              checked={includeTypingIndicators}
              onChange={(e) => setIncludeTypingIndicators(e.target.checked)}
            />
            <CheckboxOption
              label="Include my messages"
              checked={includeMyMessages}
              onChange={(e) => setIncludeMyMessages(e.target.checked)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex-1 rounded-md cursor-pointer bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition-colors"
          >
            Export
          </button>
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
