import { useState, useEffect, useRef } from "react";
import type { Message } from "../lib/types";

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognition;
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

const consoleErrorStyle =
  "background: #d32f2f; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;";

export function useSpeechRecognition(
  userInput: string,
  setUserInput: (value: string) => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptPrefixRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition ?? window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        const recognition: SpeechRecognition | null = recognitionRef.current;
        if (!recognition) return;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
          }
          let interimTranscript = "";
          let finalTranscript = "";
          const results = Array.from(event.results);
          for (const result of results.slice(event.resultIndex)) {
            const transcriptPart = result[0]?.transcript ?? "";
            if (result.isFinal) {
              finalTranscript += transcriptPart;
            } else {
              interimTranscript += transcriptPart;
            }
          }
          setUserInput(
            transcriptPrefixRef.current + finalTranscript + interimTranscript,
          );
          speechTimeoutRef.current = setTimeout(() => {
            recognition.stop();
          }, 500);
        };

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
          if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
          setIsListening(false);
        };
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
          console.log(
            "%cSpeech Recognition Error",
            consoleErrorStyle,
            event.error,
          );
          setIsListening(false);
        };
      }
    }
    return () => {
      recognitionRef.current?.stop();
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    };
  }, [setUserInput]); 

  const handleMicClick = () => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    const recognition = recognitionRef.current;

    if (!recognition) {
      const unsupportedMessage: Message = {
        id: crypto.randomUUID(), 
        author: "System",
        content: "Sorry, your browser does not support Speech-to-Text.",
        avatar: "⚙️",
        color: "bg-gray-500",
        bubbleColor: "bg-gray-700/50",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, unsupportedMessage]);
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      transcriptPrefixRef.current = userInput ? userInput + " " : "";
      recognition.start();
    }
  };

  return { isListening, handleMicClick };
}