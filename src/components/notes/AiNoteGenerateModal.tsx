import { useState, useCallback } from "react";
import { Wand2, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { noteAIService } from "@/services/noteServices";
import type { NoteAIRequest } from "@/services/noteServices";
import { toast } from "sonner";

interface AiNoteGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentContent: string;
  onInsert: (html: string) => void;
}

type ToneType = "professional" | "casual" | "formal" | "creative";
type FormatType = "meeting-summary" | "checklist" | "study-notes" | "freeform";

const TONE_OPTIONS: { value: ToneType; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "creative", label: "Creative" },
];

const FORMAT_OPTIONS: { value: FormatType; label: string }[] = [
  { value: "meeting-summary", label: "Meeting Summary" },
  { value: "checklist", label: "Checklist" },
  { value: "study-notes", label: "Study Notes" },
  { value: "freeform", label: "Freeform" },
];

const PROMPT_EXAMPLES = `Examples:
• "Summarize our Q4 planning discussion"
• "Create a checklist for launching a new feature"
• "Generate study notes on React hooks"
• "Write an overview of project milestones"`;

export function AiNoteGenerateModal({
  open,
  onOpenChange,
  currentContent,
  onInsert,
}: AiNoteGenerateModalProps) {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState<ToneType>("professional");
  const [format, setFormat] = useState<FormatType>("freeform");
  const [includeContext, setIncludeContext] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const hasCurrentContent =
    currentContent.trim().length > 0 &&
    currentContent !== "<p></p>" &&
    currentContent !== "<p><br></p>";

  const canGenerate = prompt.trim().length > 0 && !isGenerating;
  const canRegenerate = generatedContent !== null && !isGenerating;
  const canInsert = generatedContent !== null && !isGenerating;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate && !canRegenerate) return;

    setIsGenerating(true);
    setError(null);

    try {
      const request: NoteAIRequest = {
        prompt: prompt.trim(),
        tone,
        format,
        context:
          includeContext && hasCurrentContent ? currentContent : undefined,
      };

      const response = await noteAIService.generateContent(request);
      setGeneratedContent(response.contentHtml);

      // Show language detection info
      if (response.detectedLanguage === "vi") {
        toast.success("Đã tạo nội dung bằng tiếng Việt");
      } else {
        toast.success("Content generated successfully");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Failed to generate content";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [
    prompt,
    tone,
    format,
    includeContext,
    hasCurrentContent,
    currentContent,
    canGenerate,
    canRegenerate,
  ]);

  const handleCopy = useCallback(async () => {
    if (!generatedContent) return;

    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy");
    }
  }, [generatedContent]);

  const handleAppend = useCallback(() => {
    if (!generatedContent) return;
    // Append to existing content
    const combinedContent = hasCurrentContent
      ? currentContent + generatedContent
      : generatedContent;
    onInsert(combinedContent);
    toast.success("Content appended to note");
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setPrompt("");
      setTone("professional");
      setFormat("freeform");
      setIncludeContext(true);
      setGeneratedContent(null);
      setError(null);
      setCopied(false);
    }, 200);
  }, [
    generatedContent,
    hasCurrentContent,
    currentContent,
    onInsert,
    onOpenChange,
  ]);

  const handleReplace = useCallback(() => {
    if (!generatedContent) return;
    // Replace entire content
    onInsert(generatedContent);
    toast.success("Content replaced");
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setPrompt("");
      setTone("professional");
      setFormat("freeform");
      setIncludeContext(true);
      setGeneratedContent(null);
      setError(null);
      setCopied(false);
    }, 200);
  }, [generatedContent, onInsert, onOpenChange]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setPrompt("");
      setTone("professional");
      setFormat("freeform");
      setIncludeContext(true);
      setGeneratedContent(null);
      setError(null);
      setCopied(false);
    }, 200);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Note Generator
          </DialogTitle>
          <DialogDescription>
            Generate content for your note using AI. Describe what you want and
            customize the output.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">
              What would you like to generate?{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="ai-prompt"
              placeholder={PROMPT_EXAMPLES}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="min-h-25 resize-none"
              aria-label="AI generation prompt"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {prompt.length}/500 characters
            </p>
          </div>

          {/* Options Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ai-tone">Tone</Label>
              <Select
                value={tone}
                onValueChange={(v) => setTone(v as ToneType)}
                disabled={isGenerating}
              >
                <SelectTrigger id="ai-tone" aria-label="Select tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-format">Output Format</Label>
              <Select
                value={format}
                onValueChange={(v) => setFormat(v as FormatType)}
                disabled={isGenerating}
              >
                <SelectTrigger id="ai-format" aria-label="Select output format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {FORMAT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Include Context Checkbox */}
          {hasCurrentContent && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-context"
                checked={includeContext}
                onCheckedChange={(checked) =>
                  setIncludeContext(checked === true)
                }
                disabled={isGenerating}
                aria-label="Include current note content as context"
              />
              <Label
                htmlFor="include-context"
                className="text-sm font-normal cursor-pointer"
              >
                Include current note content as context
              </Label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating content with AI…</span>
            </div>
          )}

          {/* Generated Content Preview */}
          {generatedContent && !isGenerating && (
            <div className="flex-1 min-h-0 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Label>Preview</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 gap-1.5"
                  aria-label="Copy generated content"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div
                className="flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4"
                style={{ minHeight: "150px", maxHeight: "250px" }}
              >
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatedContent }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isGenerating}
            aria-label="Cancel and close"
          >
            Cancel
          </Button>

          <div className="flex gap-2 sm:ml-auto">
            {canRegenerate && (
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={!canRegenerate}
                aria-label="Regenerate content"
              >
                Regenerate
              </Button>
            )}

            {!generatedContent ? (
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                aria-label="Generate content"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleAppend}
                  disabled={!canInsert}
                  aria-label="Append to existing note"
                >
                  Append to Note
                </Button>
                <Button
                  onClick={handleReplace}
                  disabled={!canInsert}
                  aria-label="Replace entire note content"
                >
                  Replace Content
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
