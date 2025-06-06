export interface User {
  id: string;
  username: string;
  email: string;
  hasCompletedSurvey?: boolean;
  // Thêm các trường khác nếu backend trả về
}
