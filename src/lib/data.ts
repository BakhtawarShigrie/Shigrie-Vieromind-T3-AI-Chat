import type { Participant, Topic } from "./types";

export const userParticipant: Participant = {
  name: "You",
  role: "Participant",
  avatar: "👤",
  color: "bg-blue-500",
  online: true,
};
const drSarah: Participant = {
  name: "Dr. Sarah Chen",
  role: "CBT Expert",
  avatar: "🧠",
  color: "bg-cyan-500",
  online: true,
};
const drJames: Participant = {
  name: "Dr. James Williams",
  role: "Holistic Healer",
  avatar: "✨",
  color: "bg-purple-500",
  online: true,
};
const drMaria: Participant = {
  name: "Dr. Maria Rodriguez",
  role: "Analytical Psychologist",
  avatar: "❤️‍🩹",
  color: "bg-red-500",
  online: true,
};

const allTherapists = [drSarah, drJames, drMaria, userParticipant];

export const topics: Topic[] = [
  {
    id: 1,
    icon: "😥",
    title: "Best Approaches for Treating Anxiety",
    description: "CBT, medication, and holistic approaches",
    tags: ["7 min", "Clinical"],
    participants: allTherapists,
    initialMessages: [
      {
        id: crypto.randomUUID(),
        author: "Dr. Sarah Chen",
        time: "2:34 PM",
        content:
          "Let's begin. From an evidence-based perspective, Cognitive Behavioral Therapy is the undeniable gold standard for treating anxiety. The data supports its efficacy more than any other modality.",
        avatar: "🧠",
        color: "bg-cyan-500",
        bubbleColor: "bg-cyan-600/50",
      },
    ],
  },
  {
    id: 2,
    icon: "💻",
    title: "Digital Therapy vs Traditional Sessions",
    description: "The effectiveness of online therapy sessions",
    tags: ["5 min", "Technology"],
    participants: allTherapists,
    initialMessages: [
      {
        id: crypto.randomUUID(),
        author: "Dr. James Williams",
        time: "10:15 AM",
        content:
          "The digital realm offers unprecedented access to care, but can a therapeutic connection truly flourish through a screen? I believe the energetic exchange of in-person sessions is irreplaceable.",
        avatar: "✨",
        color: "bg-purple-500",
        bubbleColor: "bg-purple-600/50",
      },
    ],
  },
  {
    id: 3,
    icon: "⚖️",
    title: "Work-Life Balance in Modern Times",
    description: "Strategies for preventing burnout",
    tags: ["6 min", "Lifestyle"],
    participants: allTherapists,
    initialMessages: [
      {
        id: crypto.randomUUID(),
        author: "Dr. Maria Rodriguez",
        time: "4:00 PM",
        content:
          "The concept of 'work-life balance' itself is intriguing. It often implies a conflict. I wonder, what childhood messages did we receive about work and rest that perpetuate this struggle?",
        avatar: "❤️‍🩹",
        color: "bg-red-500",
        bubbleColor: "bg-red-600/50",
      },
    ],
  },
];

export function getPersonaDescription(name: string): string {
  switch (name) {
    case "Dr. Sarah Chen":
      return "Believes in structured, research-backed methods. Often cites studies and statistics. Advocates for Cognitive Behavioral Therapy. Pragmatic and solution-focused.";
    case "Dr. James Williams":
      return "Emphasizes mind-body-spirit connection. Incorporates meditation and mindfulness. References Eastern philosophy. Calm and reflective communication style.";
    case "Dr. Maria Rodriguez":
      return "Focuses on understanding root causes. Explores childhood and past experiences. Advocates for long-term therapeutic relationships. Empathetic but probing questioning style.";
    default:
      return "A participant in the discussion, sharing their personal thoughts.";
  }
}