import { DiscountsUpdateModel } from './../shared/models/discountsUpdateModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Booking } from '../shared/models/booking';
import { BehaviorSubject, Observable } from 'rxjs';
import { VehicleDetails } from '../shared/models/vehicleDetails';
import { Vehicle } from '../shared/models/vehicle';
import { VehicleUnavailability } from '../shared/models/vehicleUnavailability';
import { Discount } from '../shared/models/discount';
import { VehicleInsuranceDetail } from '../shared/models/vehicleInsuranceDetail';
import { InsuranceType } from '../shared/models/insuranceType';
import { VehicleInsuranceDetailsUpdateModel } from '../shared/models/vehicleInsuranceDetailsUpdateModel';
import { VehicleLocation } from '../shared/models/vehicle-location';
import { PickupDropoffLocation } from '../shared/models/pickupDropoffLocation';
import { LocationNameResponseDto } from '../shared/models/locationNameResponseDto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.adminUrl;
  private bookings: Date[] = [];
  private bookingsSubject: BehaviorSubject<Date[]> = new BehaviorSubject<
    Date[]
  >(this.bookings);

  constructor(private http: HttpClient, private router: Router) {}

  getBookings(): Observable<Date[]> {
    return this.bookingsSubject.asObservable();
  }

  setBookings(bookings: Date[]): void {
    this.bookings = bookings;
    this.bookingsSubject.next(this.bookings);
  }

  getBookingsForVehicleForInterval(
    startDate: Date,
    endDate: Date,
    vehicleId: string,
    ownerEmail: string
  ) {
    const validStartDate = new Date(startDate);
    const validEndDate = new Date(endDate);

    if (isNaN(validStartDate.getTime())) {
      throw new Error('startDate must be a valid Date object.');
    }

    if (isNaN(validEndDate.getTime())) {
      throw new Error('endDate must be a valid Date object.');
    }

    const parsedVehicleId = parseInt(vehicleId, 10); // Convert vehicleId to an integer

    if (isNaN(parsedVehicleId)) {
      throw new Error('vehicleId must be a valid integer.');
    }

    const params = new HttpParams()
      .set('startDate', validStartDate.toISOString())
      .set('endDate', validEndDate.toISOString())
      .set('vehicleId', parsedVehicleId)
      .set('ownerEmail', ownerEmail);

    return this.http.get<Booking[]>(
      this.baseUrl + 'booking/bookingsForVehicleInInterval',
      { params }
    );
  }

  getBookingsForVehicle(vehicleId: string) {
    const parsedVehicleId = parseInt(vehicleId, 10);
    const params = new HttpParams().set('vehicleId', parsedVehicleId);

    return this.http.get<Booking[]>(this.baseUrl + 'booking/bookings', {
      params,
    });
  }

  getBookingsOnDate(vehicleId: string, date: string) {
    const parsedVehicleId = parseInt(vehicleId, 10);
    const params = new HttpParams()
      .set('vehicleId', parsedVehicleId)
      .set('date', date);

    return this.http.get<Booking[]>(this.baseUrl + 'booking/bookings/onDate', {
      params,
    });
  }

  getUnavailableDatesForVehicle(vehicleId: string) {
    const parsedVehicleId = parseInt(vehicleId, 10);
    const params = new HttpParams().set('vehicleId', parsedVehicleId);

    return this.http.get<VehicleUnavailability[]>(
      this.baseUrl + 'booking/unavailableDates',
      { params }
    );
  }

  getVehicleDetailsForOwner(ownerEmail: string) {
    return this.http.get<VehicleDetails[]>(
      this.baseUrl + 'vehicle/details/' + ownerEmail
    );
  }

  getPickupDropoffLocationsForOwnerEmail(ownerEmail: string) {
    return this.http.get<PickupDropoffLocation[]>(
      this.baseUrl + 'vehicle/pickupDropoffLocations/' + ownerEmail
    );
  }

  getVehicleById(id: number) {
    return this.http.get<Vehicle>(this.baseUrl + 'vehicle/' + id);
  }

  updateVehicle(id: number, updatedVehicle: Vehicle) {
    return this.http.put<Vehicle>(
      this.baseUrl + 'vehicle/' + id,
      updatedVehicle
    );
  }

  getIntervalDiscountsForVehicle(id: number) {
    return this.http.get<Discount[]>(
      this.baseUrl + 'vehicle/discounts/' + id + '/' + 1
    );
  }

  getMonthDiscountsForVehicle(id: number) {
    return this.http.get<Discount[]>(
      this.baseUrl + 'vehicle/discounts/' + id + '/' + 2
    );
  }

  updateDiscounts(discountUpdateModel: DiscountsUpdateModel) {
    return this.http.post(
      this.baseUrl + 'vehicle/discounts',
      discountUpdateModel
    );
  }

  getVehicleInsuranceDetails(id: number) {
    return this.http.get<VehicleInsuranceDetail[]>(
      this.baseUrl + 'vehicle/vehicleInsuranceDetails/' + id
    );
  }

  getInsuranceTypes() {
    return this.http.get<InsuranceType[]>(
      this.baseUrl + 'vehicle/insuranceTypes'
    );
  }

  getLocations() {
    return this.http.get<VehicleLocation[]>(this.baseUrl + 'vehicle/locations');
  }

  getLocationNameById(locationId: number) {
    return this.http.get<LocationNameResponseDto>(
      this.baseUrl + 'vehicle/locationNameById/' + locationId
    );
  }

  updateVehicleInsuranceDetails(
    vehicleInsuranceDetailsUpdateModel: VehicleInsuranceDetailsUpdateModel
  ) {
    console.log('from SERVICE');
    console.log(vehicleInsuranceDetailsUpdateModel);
    return this.http.post(
      this.baseUrl + 'vehicle/vehicleInsuranceDetails',
      vehicleInsuranceDetailsUpdateModel
    );
  }
}
