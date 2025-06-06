import React, { useState } from "react";

interface SurveyData {
  age: string;
  gender: string;
  hobbies: string[];
  isActive: string;
  likesReading: string;
  partyAnimal: string;
  horoscope: string;
}

const defaultSurvey: SurveyData = {
  age: "",
  gender: "",
  hobbies: [],
  isActive: "",
  likesReading: "",
  partyAnimal: "",
  horoscope: "",
};

// const hobbiesList = [
//   "Đọc sách",
//   "Thể thao",
//   "Du lịch",
//   "Âm nhạc",
//   "Nấu ăn",
//   "Chơi game",
//   "Xem phim",
// ];
// const horoscopeList = [
//   "Bạch Dương",
//   "Kim Ngưu",
//   "Song Tử",
//   "Cự Giải",
//   "Sư Tử",
//   "Xử Nữ",
//   "Thiên Bình",
//   "Bọ Cạp",
//   "Nhân Mã",
//   "Ma Kết",
//   "Bảo Bình",
//   "Song Ngư",
// ];

const Onboarding: React.FC<{ onSubmit?: (data: SurveyData) => void }> = ({
  onSubmit,
}) => {
  const [form, setForm] = useState<SurveyData>(defaultSurvey);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        hobbies: checked
          ? [...prev.hobbies, value]
          : prev.hobbies.filter((h) => h !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    // TODO: Gọi API lưu survey lên backend
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Khảo sát cá nhân</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Tuổi:</label>
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            className="border rounded px-2 py-1 ml-2"
            required
          />
        </div>
        <div>
          <label>Giới tính:</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border rounded px-2 py-1 ml-2"
            required
          >
            <option value="">Chọn</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div>
          <label>Sở thích:</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {/* {hobbiesList.map((hobby) => (
              <label key={hobby} className="flex items-center">
                <input
                  type="checkbox"
                  name="hobbies"
                  value={hobby}
                  checked={form.hobbies.includes(hobby)}
                  onChange={handleChange}
                  className="mr-1"
                />
                {hobby}
              </label>
            ))} */}
          </div>
        </div>
        <div>
          <label>Bạn có hay vận động không?</label>
          <select
            name="isActive"
            value={form.isActive}
            onChange={handleChange}
            className="border rounded px-2 py-1 ml-2"
            required
          >
            <option value="">Chọn</option>
            <option value="Có">Có</option>
            <option value="Không">Không</option>
          </select>
        </div>
        <div>
          <label>Bạn có thích đọc sách không?</label>
          <select
            name="likesReading"
            value={form.likesReading}
            onChange={handleChange}
            className="border rounded px-2 py-1 ml-2"
            required
          >
            <option value="">Chọn</option>
            <option value="Có">Có</option>
            <option value="Không">Không</option>
          </select>
        </div>
        <div>
          <label>Bạn có phải party animal?</label>
          <select
            name="partyAnimal"
            value={form.partyAnimal}
            onChange={handleChange}
            className="border rounded px-2 py-1 ml-2"
            required
          >
            <option value="">Chọn</option>
            <option value="Có">Có</option>
            <option value="Không">Không</option>
          </select>
        </div>
        <div>
          <label>Cung hoàng đạo:</label>
          <select
            name="horoscope"
            value={form.horoscope}
            onChange={handleChange}
            className="border rounded px-2 py-1 ml-2"
            required
          >
            <option value="">Chọn</option>
            {/* {horoscopeList.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))} */}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu thông tin
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
