export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  hasCompletedSurvey?: boolean;
  token?: string;
  avatar?: string;
  googleConnected?: boolean;
  googleCalendarSynced?: boolean;
  // Thêm các trường khác nếu backend trả về
}
