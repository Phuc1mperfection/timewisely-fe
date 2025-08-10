import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewActivityButtonProps {
  onOpenModal: (slot?: { start: Date; end: Date }) => void;
  presetSlot?: { start: Date; end: Date };
  label?: string;
  className?: string;
}

export function NewActivityButton({
  onOpenModal,
  presetSlot,
  label = "New Activity",
  className = "",
}: NewActivityButtonProps) {
  const handleClick = () => {
    onOpenModal(presetSlot);
  };

  return (
    <Button onClick={handleClick} className={className}>
      <Plus className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
