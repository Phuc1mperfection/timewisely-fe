export interface Activity {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  color?: string;
  allDay?: boolean;
  location?: string;
  goalTag?: string;
  completed?: boolean;
  loading?: boolean;
}
