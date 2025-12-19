import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ActivityFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  filterColor: string | null;
  setFilterColor: (v: string | null) => void;
  filterAllDay: boolean | null;
  setFilterAllDay: (v: boolean | null) => void;
  loading?: boolean;
}

// Memoize to prevent unnecessary re-renders
export const ActivityFilterBar = React.memo<ActivityFilterBarProps>(
  ({
    search,
    setSearch,
    filterColor,
    setFilterColor,
    filterAllDay,
    setFilterAllDay,
    loading,
  }) => {
    // Memoize color options
    const colorOptions = React.useMemo(
      () => ["#D4AF37", "#5eead4", "#f9a8d4",  "#1e1e2f", "#6b7280"],
      []
    );

    return (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 animate-fade-in">
            <Loader2 className="animate-spin w-12 h-12 text-[var(--wisely-gold)]" />
          </div>
        )}
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <Input
            placeholder="Search activity title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
          <Label>Color:</Label>
          <button
            className={cn(
              "w-6 h-6 rounded-full border-2",
              !filterColor ? "border-[var(--wisely-gold)]" : "border-gray-200"
            )}
            style={{
              background:
                "linear-gradient(90deg,#D4AF37,#5eead4,#f9a8d4,#fde699,#1e1e2f,#6b7280)",
            }}
            onClick={() => setFilterColor(null)}
            title="All colors"
          />
          {colorOptions.map((c) => (
            <button
              key={c}
              className={cn(
                "w-6 h-6 rounded-full border-2",
                filterColor === c
                  ? "border-[var(--wisely-gold)]"
                  : "border-gray-200"
              )}
              style={{ backgroundColor: c }}
              onClick={() => setFilterColor(c)}
              title={c}
            />
          ))}
          <Label>All day:</Label>
          <div className="flex gap-1">
            <Label
              asChild
              className={cn(
                "px-2 py-1 rounded border cursor-pointer",
                filterAllDay === null
                  ? "border-[var(--wisely-gold)]"
                  : "border-gray-200"
              )}
            >
              <button type="button" onClick={() => setFilterAllDay(null)}>
                All
              </button>
            </Label>
            <Label
              asChild
              className={cn(
                "px-2 py-1 rounded border cursor-pointer",
                filterAllDay === true
                  ? "border-[var(--wisely-gold)]"
                  : "border-gray-200"
              )}
            >
              <button type="button" onClick={() => setFilterAllDay(true)}>
                Yes
              </button>
            </Label>
            <Label
              asChild
              className={cn(
                "px-2 py-1 rounded border cursor-pointer",
                filterAllDay === false
                  ? "border-[var(--wisely-gold)]"
                  : "border-gray-200"
              )}
            >
              <button type="button" onClick={() => setFilterAllDay(false)}>
                No
              </button>
            </Label>
          </div>
        </div>
      </div>
    );
  }
);
