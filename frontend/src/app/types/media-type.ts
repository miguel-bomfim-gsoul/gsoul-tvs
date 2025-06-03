export interface MediaItem {
  id: number;
  name: string;
  thumbnail: string;
  order: number;
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  progress: number;
  tvs: number[];
}