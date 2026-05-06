export interface ReservationTime {
  id: number;
  startAt: string;
}

export interface Theme {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string;
}

export interface Reservation {
  id: number;
  name: string;
  date: string;
  time: ReservationTime;
  theme: Theme;
}

export interface AvailableTime extends ReservationTime {
  alreadyBooked?: boolean;
}
