import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Bảng thời gian biểu</h1>
      <p>
        Chào mừng bạn! Đây là nơi bạn có thể quản lý thời gian biểu, kéo thả
        hoạt động và nhận gợi ý từ AI.
      </p>
      {/* TODO: Thêm UI drag & drop và AI suggestion */}
    </div>
  );
};

export default Dashboard;
