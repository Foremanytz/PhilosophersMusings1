
export interface Philosopher {
  id: string;
  name: string;
  description: string;
  avatar: string;
  era: string;
}

export interface DialogueMessage {
  role: 'philosopher_a' | 'philosopher_b' | 'moderator';
  philosopherName: string;
  content: string;
  timestamp: number;
}
