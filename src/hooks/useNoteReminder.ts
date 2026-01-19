import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/services/noteServices";
import type { SetReminderPayload, NoteReminder } from "@/services/noteServices";

export function useNoteReminder(noteId: number | null) {
  return useQuery<NoteReminder | null>({
    queryKey: ["noteReminder", noteId ?? ""],
    queryFn: () => noteService.getNoteReminder(noteId as number),
    enabled: noteId !== null,
  });
}

export function useSetNoteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: number;
      payload: SetReminderPayload;
    }) => noteService.setNoteReminder(noteId, payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["noteReminder", vars.noteId],
      });
      // Refresh notes list so any badges/status depending on reminder can update
      queryClient.invalidateQueries({ queryKey: ["notes", "standalone"] });
    },
  });
}

export function useCancelNoteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: number) => noteService.cancelNoteReminder(noteId),
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["noteReminder", noteId] });
      queryClient.invalidateQueries({ queryKey: ["notes", "standalone"] });
    },
  });
}
