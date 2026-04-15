export interface IGeolocation {
  latitude: string;
  longitude: string;
}

export interface ILocation {
  state: string;
  code: string;
  LGA?: string;
  country: string;
  coordinates?: IGeolocation;
}

export interface IMarketData {
  _id: string;
  name: string;
  currency: "NGN";
  location: ILocation;
  isActive: boolean;
  isDeleted: boolean;
}

// Deprecated in favor of IMarketData
export interface Market {
  _id: string;
  name: string;
  location: string;
  description?: string;
}
