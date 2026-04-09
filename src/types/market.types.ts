
export enum IUnit {
  KG = "kg",
  LITRE = "litre",
  MUDU = "mudu",
  TIYA = "tiya",
}

export enum ICategory {
  Grains = "Grains",
  LegumesAndNuts = "Legumes",
  Vegetables = "Vegetables",
  OilsAndSeeds = "Oils & Seeds",
  Livestock = "Livestock",
  RootsAndTubers = "Roots and Tubers",
  Fruits = "Fruit",
  Others = "Others",
}


export enum MarketNames{
  Charanci = "Charanci",
  Ajiwa = "Ajiwa",
  Dawanau = "Dawanau"
}
export interface IMarketProduct {
  name: string;
  unit:IUnit;
  price: number;
  category:ICategory;
  quantityAvailable?: number;
  description?: string;
  marketId: string;
}

// export type MarketNames = {
//   names: "Charanci" | "Ajiwa " | "Dawanau"
// }
// export interface IMarketNames{
//    names:MarketNames
// }