import type { User } from './User';

export interface ProfileUpdateResponse {
  user: User;
  token: string | null;
}
