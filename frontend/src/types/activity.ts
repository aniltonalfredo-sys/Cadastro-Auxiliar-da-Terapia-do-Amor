// types/activity.ts
export interface ActivityParticipant {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  foto?: string;
  igreja: string;
  regiao: string;
  obreiro: boolean;
  batizado: boolean;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  location?: string;
  description?: string;
  participants: ActivityParticipant[];
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityData {
  name: string;
  date: string;
  location?: string;
  description?: string;
  participantIds: (string | number)[];
}