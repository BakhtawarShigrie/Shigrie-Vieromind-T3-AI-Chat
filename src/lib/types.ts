

export type Participant = {
  name: string;
  role: string;
  avatar: string;
  color: string;
  online: boolean;
};

export type Message = {
  id: string;
  author: string;
  content: string;
  avatar: string;
  color: string;
  bubbleColor: string;
  time: string;
};

export type Topic = {
  id: number;
  icon: string;
  title:string;
  description: string;
  tags: string[];
  participants: Participant[];
  initialMessages: Message[];
};