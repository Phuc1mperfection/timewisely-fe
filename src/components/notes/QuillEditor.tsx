import { useEffect, useMemo, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  maxLength?: number;
}

export function QuillEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  readOnly = false,
  maxLength,
}: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const lastHtmlRef = useRef<string>("");

  const modules = useMemo(
    () => ({
      toolbar: readOnly
        ? false
        : [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
    }),
    [readOnly]
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "blockquote",
      "code-block",
      "link",
    ],
    []
  );

  // Init Quill once
  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      placeholder,
      readOnly,
      modules,
      formats,
    });

    quillRef.current = quill;

    // set initial value
    quill.clipboard.dangerouslyPasteHTML(value || "");
    lastHtmlRef.current = value || "";

    const handler = () => {
      const html = quill.root.innerHTML;
      const emptyHtml = "<p><br></p>";
      let out = html === emptyHtml ? "" : html;

      if (maxLength && out.length > maxLength) {
        out = out.slice(0, maxLength);
        // sync back into editor to reflect trimming
        const sel = quill.getSelection();
        quill.clipboard.dangerouslyPasteHTML(out);
        if (sel) quill.setSelection(sel.index, sel.length);
      }

      // avoid infinite loops
      if (out !== lastHtmlRef.current) {
        lastHtmlRef.current = out;
        onChange(out);
      }
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep editor in sync when parent changes `value`
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const next = value || "";
    if (next !== lastHtmlRef.current) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(next);
      lastHtmlRef.current = next;
      if (sel) quill.setSelection(sel.index, sel.length);
    }
  }, [value]);

  // Update readOnly dynamically
  useEffect(() => {
    quillRef.current?.enable(!readOnly);
  }, [readOnly]);

  return (
    <div className={cn("quill-editor-wrapper", className)}>
      <div ref={containerRef} />
    </div>
  );
}
