import { useState, useEffect, useMemo } from "react";
import { Plus, Save, Trash2, Search, AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/useToast";
import { QuillEditor } from "./QuillEditor";
import { NoteListItem } from "./NoteListItem";
import { ReminderDialog } from "./ReminderDialog";
import {
  useStandaloneNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/useStandaloneNote";
import {
  useNoteReminder,
  useSetNoteReminder,
  useCancelNoteReminder,
} from "@/hooks/useNoteReminder";
import { format, parseISO } from "date-fns";
import type { Note } from "@/interfaces";

export function NotePage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [isNewNote, setIsNewNote] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, refetch } = useStandaloneNote({
    search: debouncedSearch,
    page: 0,
    size: 50,
  });

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const { data: reminder } = useNoteReminder(selectedNoteId);
  const setReminder = useSetNoteReminder();
  const cancelReminder = useCancelNoteReminder();

  const notes = useMemo(() => data?.content || [], [data?.content]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  // Track unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (isNewNote) {
      return editorTitle.trim() !== "" || editorContent.trim() !== "";
    }
    if (!selectedNote) return false;
    return (
      editorTitle !== (selectedNote.title || "") ||
      editorContent !== selectedNote.contentHtml
    );
  }, [isNewNote, selectedNote, editorTitle, editorContent]);

  // Load selected note into editor
  useEffect(() => {
    if (selectedNote && !isNewNote) {
      setEditorTitle(selectedNote.title || "");
      setEditorContent(selectedNote.contentHtml);
    }
  }, [selectedNote, isNewNote]);

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setEditorTitle("");
    setEditorContent("");
    setIsNewNote(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNoteId(note.id);
    setIsNewNote(false);
  };

  const handleSave = async () => {
    const contentHtml = editorContent.trim() || "<p></p>";
    const title = editorTitle.trim() || null;

    try {
      if (isNewNote) {
        const newNote = await createNote.mutateAsync({
          title,
          contentHtml,
          type: "STANDALONE",
        });
        setSelectedNoteId(newNote.id);
        setIsNewNote(false);
        toast.success("Note created");
      } else if (selectedNoteId) {
        await updateNote.mutateAsync({
          id: selectedNoteId,
          dto: { title, contentHtml },
        });
        toast.success("Note updated");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save note.");
    }
  };

  const handleDelete = async () => {
    if (!selectedNoteId) return;
    try {
      await deleteNote.mutateAsync(selectedNoteId);
      setSelectedNoteId(null);
      setEditorTitle("");
      setEditorContent("");
      setIsNewNote(false);
      toast.success("Note deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note.");
    }
    setDeleteDialogOpen(false);
  };

  const isSaving = createNote.isPending || updateNote.isPending;
  const isDeleting = deleteNote.isPending;

  return (
    <div className="h-full flex">
      {/* Left Panel - Notes List */}
      <div className="w-80 border-r border-border flex flex-col bg-muted/30">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Notes</h2>
            <Button size="sm" onClick={handleNewNote}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : error ? (
            <div className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Failed to load notes
              </p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : notes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">
                {search ? "No notes match your search" : "No notes yet"}
              </p>
              {!search && (
                <Button
                  size="sm"
                  variant="link"
                  onClick={handleNewNote}
                  className="mt-2"
                >
                  Create your first note
                </Button>
              )}
            </div>
          ) : (
            notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId && !isNewNote}
                onClick={() => handleSelectNote(note)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNoteId || isNewNote ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between gap-4">
              <Input
                placeholder="Note title..."
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                className="text-lg font-medium border-0 shadow-none focus-visible:ring-0 px-3 py-2 h-auto"
              />
              <div className="flex items-center gap-2">
                {!isNewNote &&
                  selectedNoteId &&
                  reminder?.status === "SCHEDULED" && (
                    <span className="text-xs text-muted-foreground">
                      Reminder: {format(parseISO(reminder.remindAt), "PP p")}
                    </span>
                  )}
                {hasUnsavedChanges && (
                  <span className="text-xs text-amber-500 font-medium">
                    Unsaved changes
                  </span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setReminderDialogOpen(true)}
                  disabled={isNewNote || !selectedNoteId}
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Remind
                </Button>
                {!isNewNote &&
                  selectedNoteId &&
                  reminder?.status === "SCHEDULED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (!selectedNoteId) return;
                        cancelReminder.mutate(selectedNoteId);
                      }}
                      disabled={cancelReminder.isPending}
                    >
                      Cancel
                    </Button>
                  )}
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                {!isNewNote && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <QuillEditor
                value={editorContent}
                onChange={setEditorContent}
                placeholder="Start writing your note..."
                className="h-full"
                maxLength={200000}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Select a note or create a new one</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNewNote}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Note
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reminder Dialog */}
      <ReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        existingReminder={reminder ?? null}
        onSchedule={(payload) => {
          if (!selectedNoteId) return;
          setReminder.mutate(
            { noteId: selectedNoteId, payload },
            {
              onSuccess: () => {
                setReminderDialogOpen(false);
              },
            }
          );
        }}
        isPending={setReminder.isPending}
      />
    </div>
  );
}
