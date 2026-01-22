import apiClient from "@/services/apiClient";
import type {
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  NotesResponse,
} from "@/interfaces/Note";

export type Channel = "EMAIL" | "PUSH";
export type ReminderStatus = "SCHEDULED" | "SENT" | "CANCELLED";

export interface NoteReminder {
  remindAt: string; // ISO string in UTC
  channels: Channel[];
  status: ReminderStatus;
}

export interface SetReminderPayload {
  remindAt: string; // ISO string in UTC
  channels: Channel[];
}

export const noteService = {
  createNote: async (dto: CreateNoteDto): Promise<Note> => {
    const { data } = await apiClient.post("/notes", dto);
    return data;
  },

  getNotes: async (params: {
    search?: string;
    page?: number;
    size?: number;
  }): Promise<NotesResponse> => {
    const { search = "", page = 0, size = 20 } = params;
    const { data } = await apiClient.get("/notes", {
      params: { type: "STANDALONE", search, page, size },
    });
    // Backend may return either a paginated response { content: Note[] , ... }
    // or a raw array of notes. Normalize to a NotesResponse shape so the
    // UI always reads `data.content`.
    if (Array.isArray(data)) {
      return {
        content: data,
        page,
        size,
        totalElements: data.length,
        totalPages: Math.ceil(data.length / size),
      } as unknown as NotesResponse;
    }

    return data as NotesResponse;
  },

  getNote: async (id: number): Promise<Note> => {
    const { data } = await apiClient.get(`/notes/${id}`);
    return data;
  },

  updateNote: async (id: number, dto: UpdateNoteDto): Promise<Note> => {
    const { data } = await apiClient.put(`/notes/${id}`, dto);
    return data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },

  // Note reminder APIs
  getNoteReminder: async (id: number): Promise<NoteReminder | null> => {
    try {
      const { data } = await apiClient.get(`/notes/${id}/reminder`);
      return data as NoteReminder;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  setNoteReminder: async (
    id: number,
    payload: SetReminderPayload,
  ): Promise<void> => {
    await apiClient.put(`/notes/${id}/reminder`, payload);
  },

  cancelNoteReminder: async (id: number): Promise<void> => {
    await apiClient.delete(`/notes/${id}/reminder`);
  },
};
export interface NoteAIRequest {
  prompt: string;
  tone?: "professional" | "casual" | "formal" | "creative";
  format?: "meeting-summary" | "checklist" | "study-notes" | "freeform";
  context?: string;
}

export interface NoteAIResponse {
  contentHtml: string;
  model: string;
  detectedLanguage: string;
}

// AI Note Generation Service
export const noteAIService = {
  generateContent: async (request: NoteAIRequest): Promise<NoteAIResponse> => {
    const { data } = await apiClient.post("/notes/ai/generate", request);
    return data;
  },
};
