import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-white">
      <div className="bg-white/80 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          401 Unauthorized
        </h1>
        <p className="mb-6 text-gray-700">
          Bạn không có quyền truy cập trang này hoặc phiên đăng nhập đã hết hạn.
        </p>
        <Button
          onClick={() => navigate("/auth")}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Đăng nhập lại
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="ml-4"
        >
          Về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
