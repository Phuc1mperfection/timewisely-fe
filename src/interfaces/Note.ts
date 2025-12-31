export type NoteType = "STANDALONE" | "TASK_DESC" | "ACTIVITY_DESC";

export interface Note {
  id: number;
  title?: string | null;
  contentHtml: string;
  type: NoteType;
  // taskId is numeric in this frontend app
  taskId?: number | null;
  // activityId can be UUID string from backend
  activityId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title?: string | null;
  contentHtml: string;
  type: "STANDALONE";
}

export interface UpdateNoteDto {
  title?: string | null;
  contentHtml: string;
}

export interface NotesResponse {
  content: Note[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
