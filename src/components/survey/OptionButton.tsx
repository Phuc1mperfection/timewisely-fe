import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export const OptionButton = ({ 
  children, 
  selected, 
  onClick, 
  className 
}: OptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium",
        "hover:scale-[1.02] active:scale-[0.98]",
        selected 
          ? "bg-primary text-primary-foreground border-primary shadow-lg" 
          : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-accent",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm leading-relaxed">{children}</span>
        {selected && (
          <Check className="w-5 h-5 ml-3 flex-shrink-0" />
        )}
      </div>
    </button>
  );
};