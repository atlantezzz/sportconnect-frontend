export type Activity = {
  id: number;
  sport: string;
  title: string;
  location: string;
  time: string;
  participants: number;
  capacity: number;
  level: string;
  description: string;
  organizer: string;
  memberNames: string[];
  x: number;
  y: number;
  status?: "GEANNULEERD";
};
