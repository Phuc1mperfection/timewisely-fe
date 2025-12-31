import { useState, useEffect } from "react";
import { Save, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/useToast";
import { QuillEditor } from "./QuillEditor";
import {
  useActivityNote,
  useUpdateActivityNote,
  useDeleteActivityNote,
} from "@/hooks/useStandaloneNote";

interface ActivityDescriptionEditorProps {
  activityId: string;
  defaultOpen?: boolean;
}

export function ActivityDescriptionEditor({
  activityId,
  defaultOpen = false,
}: ActivityDescriptionEditorProps) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [content, setContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: note, isLoading } = useActivityNote(activityId as any);
  const updateNote = useUpdateActivityNote();
  const deleteNote = useDeleteActivityNote();

  useEffect(() => {
    if (note) {
      setContent(note.contentHtml);
      setHasChanges(false);
    } else {
      setContent("");
      setHasChanges(false);
    }
  }, [note]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateNote.mutateAsync({
        activityId: activityId as any,
        dto: { contentHtml: content },
      } as any);
      setHasChanges(false);
      toast.success("Description saved");
    } catch (err) {
      toast.error("Failed to save description.");
    }
  };

  const handleClear = async () => {
    if (!note) return;
    const ok = window.confirm("Clear description? This cannot be undone.");
    if (!ok) return;
    try {
      await deleteNote.mutateAsync(activityId as any);
      setContent("");
      setHasChanges(false);
      toast.success("Description cleared");
    } catch (err) {
      toast.error("Failed to clear description.");
    }
  };

  const isSaving = updateNote.isPending;
  const isClearing = deleteNote.isPending;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <FileText className="h-4 w-4" />
          Description
          {note && <span className="text-xs text-primary">•</span>}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <>
            <QuillEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Add a description..."
              className="min-h-[120px]"
              maxLength={200000}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <span className="text-xs text-amber-500">Unsaved</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {note && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClear}
                    disabled={isClearing}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
