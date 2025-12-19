import { motion } from "framer-motion";
import type { PeriodFilter } from "@/interfaces/Goal";

interface PeriodSelectorProps {
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
}

export function PeriodSelector({
  period,
  onPeriodChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
      {(["week", "month"] as const).map((p) => (
        <button
          key={p}
          onClick={() => onPeriodChange(p)}
          className="relative px-4 py-2 text-sm font-medium rounded-md transition-colors"
        >
          {period === p && (
            <motion.div
              layoutId="period-selector"
              className="absolute inset-0 bg-card shadow-sm rounded-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span
            className={`relative z-10 ${
              period === p ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {p === "week" ? "This Week" : "This Month"}
          </span>
        </button>
      ))}
    </div>
  );
}
