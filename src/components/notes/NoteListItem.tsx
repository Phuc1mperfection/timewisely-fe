import { format } from "date-fns";
import type { Note } from "@/interfaces";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

// Strip HTML tags for preview
function stripHtml(html: string): string {
  if (typeof document === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function NoteListItem({ note, isSelected, onClick }: NoteListItemProps) {
  const preview = stripHtml(note.contentHtml).slice(0, 80);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-colors",
        "hover:bg-accent/50",
        isSelected ? "bg-accent border-primary/30" : "bg-card border-border"
      )}
    >
      <div className="flex items-start gap-2">
        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">
            {note.title || "Untitled Note"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {preview || "No content"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(note.updatedAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>
    </button>
  );
}
