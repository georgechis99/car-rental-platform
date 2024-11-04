import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle } from '../shared/models/vehicle';
import { Pagination } from '../shared/models/pagination';
import { VehicleBrand } from '../shared/models/vehicle-brand';
import { VehicleModel } from '../shared/models/vehicle-model';
import { VehicleParams } from '../shared/models/vehicle-params';
import { environment } from 'src/environments/environment';
import { VehicleLocation } from '../shared/models/vehicle-location';
import { ICategory } from '../shared/models/vehicle-category';
import { IPriceRange } from '../shared/models/price-range';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getVehicles(vehicleParams: VehicleParams) {
    return this.http.post<Pagination<Vehicle[]>>(this.baseUrl + 'vehicle', vehicleParams);
  }

  getVehicle(id: number) {
    return this.http.get<Vehicle>(this.baseUrl + 'vehicle/' + id);
  }

  getDiscountedVehicle(id: number, pickupDate: Date, dropoffDate: Date, pickupLocationId?: number, dropoffLocationId?: number) {
    const parameters = new HttpParams()
      .append('id', id.toString())
      .append('pickupDate', pickupDate.toISOString())
      .append('dropoffDate', dropoffDate.toISOString())
      .append('pickupLocationId', pickupLocationId.toString())
      .append('dropoffLocationId', dropoffLocationId.toString());

    return this.http.get<Vehicle>(this.baseUrl + 'vehicle/discounted', { params: parameters });
  }

  getBrands() {
    return this.http.get<VehicleBrand[]>(this.baseUrl + 'vehicle/brands');
  }

  getModels() {
    return this.http.get<VehicleModel[]>(this.baseUrl + 'vehicle/models');
  }

  getModelsByBrand(brandId: number) {
    return this.http.get<VehicleModel[]>(this.baseUrl + 'vehicle/modelsByBrand/' + brandId);
  }

  getLocations() {
    return this.http.get<VehicleLocation[]>(this.baseUrl + 'vehicle/locations');
  }

  getVehicleInsuranceOptions(vehicleId: number){
    return this.http.get<any>(this.baseUrl + 'vehicle/insuranceDetails/' + vehicleId);
  }

  getVehicleCategories() {
    return this.http.get<ICategory>(this.baseUrl + 'vehicle/categories');
  }

  getVehiclePriceRanges() {
    return this.http.get<IPriceRange>(this.baseUrl + 'vehicle/priceRanges');
  }
}
