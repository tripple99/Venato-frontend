import { MarketNames,IUnit,ICategory } from "./market.types";

export interface Products{
  id:string,
  name:string;
  price:number;
  unit:IUnit;
  category:ICategory
  market:MarketNames,
  created_at:Date,
  update_at:Date,

}