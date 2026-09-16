export type LinkType =
  | "place"
  | "route"
  | "website";

export type SpotLink = {
  id: string;

  name: string;

  type: LinkType;

  url: string;
};

export type TripPage = {
  id: string;
  title: string;
  memo: string;

  links: SpotLink[];
};

export type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  pages: TripPage[];
};
