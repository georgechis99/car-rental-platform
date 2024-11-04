import { IPriceRange } from "./price-range";
import { ICategory } from "./vehicle-category";

export class VehicleParams {
  brandId = 0;
  modelId = 0;
  sort = 'name';
  pageNumber = 1;
  pageSize = 6;
  search = '';
  pickupDate: Date;
  dropoffDate: Date;
  pickupLocationId: number;
  dropoffLocationId: number;
  pickupLocationName: string;
  dropoffLocationName: string;
  priceRanges:IPriceRange [];
  categories:ICategory [];
  transmissionTypes:string [];
}
