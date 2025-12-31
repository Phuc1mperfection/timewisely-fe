import apiClient from "@/services/apiClient";
import type {
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  NotesResponse,
} from "@/interfaces/Note";

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

  getTaskNote: async (taskId: number): Promise<Note | null> => {
    try {
      const { data } = await apiClient.get(`/tasks/${taskId}/note`);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  updateTaskNote: async (taskId: number, dto: UpdateNoteDto): Promise<Note> => {
    const { data } = await apiClient.put(`/tasks/${taskId}/note`, dto);
    return data;
  },

  deleteTaskNote: async (taskId: number): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}/note`);
  },

  getActivityNote: async (activityId: string): Promise<Note | null> => {
    try {
      const { data } = await apiClient.get(`/activities/${activityId}/note`);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  updateActivityNote: async (
    activityId: string,
    dto: UpdateNoteDto
  ): Promise<Note> => {
    const { data } = await apiClient.put(`/activities/${activityId}/note`, dto);
    return data;
  },

  deleteActivityNote: async (activityId: string): Promise<void> => {
    await apiClient.delete(`/activities/${activityId}/note`);
  },
};
