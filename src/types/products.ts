import { MarketNames, IUnit, ICategory } from "./market.types";
import type { ILocation } from "@/model/market.model";

interface MarketData {
  name: MarketNames;
  _id: string;
  location: ILocation;
}

export interface Products{
  _id:string,
  name:string;
  price:number;
  unit:IUnit;
  category:ICategory
  location:ILocation;
  quantityAvailable:number;
  market:MarketData;
  images?: string[];
  image?: File[];
  created_at:Date,
  update_at:Date,
}