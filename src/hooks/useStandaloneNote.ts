import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/services/noteService";
import type { CreateNoteDto, UpdateNoteDto } from "@/interfaces/Note";

export function useStandaloneNote(params: {
  search?: string;
  page?: number;
  size?: number;
}) {
  const { search, page, size } = params;
  return useQuery({
    queryKey: ["notes", "standalone", search ?? "", page ?? 0, size ?? 20],
    queryFn: () => noteService.getNotes({ search, page, size }),
  });
}

export function useNote(id: number | null) {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => noteService.getNote(id!),
    enabled: id !== null,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateNoteDto) => noteService.createNote(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "standalone"] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateNoteDto }) =>
      noteService.updateNote(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", "standalone"] });
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "standalone"] });
    },
  });
}

// Task description hooks
export function useTaskNote(taskId: number | null) {
  return useQuery({
    queryKey: ["notes", "task", taskId ?? ""],
    queryFn: () => noteService.getTaskNote(taskId!),
    enabled: taskId !== null,
  });
}

export function useUpdateTaskNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, dto }: { taskId: number; dto: UpdateNoteDto }) =>
      noteService.updateTaskNote(taskId, dto),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", "task", taskId] });
    },
  });
}

export function useDeleteTaskNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => noteService.deleteTaskNote(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ["notes", "task", taskId] });
    },
  });
}

// Activity description hooks
export function useActivityNote(activityId: string | null) {
  return useQuery({
    queryKey: ["notes", "activity", activityId ?? ""],
    queryFn: () => noteService.getActivityNote(activityId!),
    enabled: activityId !== null,
  });
}

export function useUpdateActivityNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activityId,
      dto,
    }: {
      activityId: string;
      dto: UpdateNoteDto;
    }) => noteService.updateActivityNote(activityId, dto),
    onSuccess: (_, { activityId }) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", "activity", activityId],
      });
    },
  });
}

export function useDeleteActivityNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activityId: string) =>
      noteService.deleteActivityNote(activityId),
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", "activity", activityId],
      });
    },
  });
}
