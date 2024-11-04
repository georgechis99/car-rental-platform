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
}
