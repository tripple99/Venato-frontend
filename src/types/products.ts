import { MarketNames,IUnit,ICategory } from "./market.types";


interface ICoordinates {
  longitude: string;
  latitude: string;
}

interface ILocation {
  state: string;
  code: string;
  LGA: string;
  cordinates: ICoordinates;
}

interface MarketData{
  name:MarketNames,
  _id:string,
  location:ILocation,
}
export interface Products{
  _id:string,
  name:string;
  price:number;
  unit:IUnit;
  category:ICategory
  market:MarketData,
  created_at:Date,
  update_at:Date,

}