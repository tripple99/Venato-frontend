import {type ILocation } from "./market.model";

export interface Market {
  _id: string;
  name: string;
  currency: string;
  location: ILocation;
}


export interface Product {
  _id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  quantityAvailable:number;
  market: Market; 
  createdBy: string;
  updatedBy?: string;
  description?: string;
  images?: string[];
}