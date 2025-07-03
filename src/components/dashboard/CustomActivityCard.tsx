import type { Activity } from "@/interfaces/Activity";


export function CustomActivityCard({ activity }: { activity: Activity }) {
  return (
    <div
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        opacity: activity.completed ? 0.5 : 1, // Làm mờ nếu completed
        background: "transparent",
        textDecoration: activity.completed ? "line-through" : "none",
      }}
    >
      <span style={{ fontWeight: 600 }}>{activity.title}</span>
      {/* Nếu muốn hiển thị thêm thông tin ngắn gọn, có thể thêm ở đây */}
    </div>
  );
}
