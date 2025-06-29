export interface CustomEvent {
  title: string;
  location?: string;
  goalTag?: string;
  completed?: boolean;
  start: Date | string | number;
  end: Date | string | number;
  description?: string;
  color?: string;
}

export function CustomEventCard({ event }: { event: CustomEvent }) {
  return (
    <div
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        opacity: event.completed ? 0.5 : 1, // Làm mờ nếu completed
        background: "transparent",
        textDecoration: event.completed ? "line-through" : "none",
      }}
    >
      <span style={{ fontWeight: 600 }}>{event.title}</span>
      {/* Nếu muốn hiển thị thêm thông tin ngắn gọn, có thể thêm ở đây */}
    </div>
  );
}
