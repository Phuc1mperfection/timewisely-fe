export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  hasCompletedSurvey?: boolean;
  // Thêm các trường khác nếu backend trả về
}
