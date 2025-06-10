export interface CustomEvent {
  title: string;
  location?: string;
  goalTag?: string;
  completed?: boolean;
  start: Date | string | number;
  end: Date | string | number;
}

export function CustomEventCard({ event }: { event: CustomEvent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 2 }}>
      <span style={{ fontWeight: 600 }}>{event.title}</span>
      <span style={{ fontSize: 12, color: "#888" }}>
        {(() => {
          const duration =
            (new Date(event.end).getTime() - new Date(event.start).getTime()) /
            (1000 * 60 * 60);
          const rounded = duration.toFixed(1);
          return `${rounded} hour${Number(rounded) === 1 ? "" : "s"}`;
        })()}
      </span>{" "}
      {event.location && (
        <span style={{ fontSize: 12, color: "#555" }}>📍 {event.location}</span>
      )}
      {event.goalTag && (
        <span style={{ fontSize: 12, color: "#888" }}>
          Goal: {event.goalTag}
        </span>
      )}
      {typeof event.completed === "boolean" && (
        <span
          style={{
            fontSize: 12,
            color: event.completed ? "#22c55e" : "#f87171",
          }}
        >
          {event.completed ? "✔ Completed" : "✗ Not completed"}
        </span>
      )}
    </div>
  );
}
