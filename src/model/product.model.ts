export interface MarketLocation {
  cordinates: {
    longitude: string;
    latitude: string;
  };
  state: string;
  code: string;
  LGA: string;
}

export interface Market {
  _id: string;
  name: string;
  currency: string;
  location: MarketLocation;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  market: Market; 
  createdBy: string;
  updatedBy?: string;
  __v?: number;
  description?: string;
}