export interface WatchList {
  _id: string;
  user: string; // Types.ObjectId
  product: any; // Ideally populated Product data (e.g. from Product model)
  createdAt: string;
  updatedAt: string;
}
