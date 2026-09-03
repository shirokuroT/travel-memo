export type TripPage = {
  id: string;
  title: string;
  memo: string;
};

export type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  pages: TripPage[];
};