import {type Product } from "./product.model";
export interface WatchList {
  _id: string;
  user: string; // Types.ObjectId
  product: Product; // Ideally populated Product data (e.g. from Product model)
  createdAt: string;
  updatedAt: string;
}
