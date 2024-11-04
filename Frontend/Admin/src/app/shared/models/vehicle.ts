export class Vehicle {
  id: number;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingDate: string;
  price: number;
  hasAirConditioning: boolean;
  pictureUrl: string;
  transmissionType: string;
  numberOfDoors: number;
  maxNumberOfPassengers: number;
  luggageCapacity: number;
  fuelType: string;
  baseDepositAmount: number;
  baseMaxDistance: number;
  reviewsScore: number;
  vehicleRegistrationNumber: string;
  isAvailable: boolean;
  extra100KmPrice: number;
  canLeaveCountry: boolean;

  constructor(vehicle: Vehicle) {
    this.id = vehicle.id;
    this.vehicleBrand = vehicle.vehicleBrand;
    this.vehicleModel = vehicle.vehicleModel;
    this.manufacturingDate = vehicle.manufacturingDate;
    this.price = vehicle.price;
    this.hasAirConditioning = vehicle.hasAirConditioning;
    this.pictureUrl = vehicle.pictureUrl;
    this.transmissionType = vehicle.transmissionType;
    this.numberOfDoors = vehicle.numberOfDoors;
    this.maxNumberOfPassengers = vehicle.maxNumberOfPassengers;
    this.luggageCapacity = vehicle.luggageCapacity;
    this.fuelType = vehicle.fuelType;
    this.baseDepositAmount = vehicle.baseDepositAmount;
    this.baseMaxDistance = vehicle.baseMaxDistance;
    this.reviewsScore = vehicle.reviewsScore;
    this.vehicleRegistrationNumber = vehicle.vehicleRegistrationNumber;
    this.isAvailable = vehicle.isAvailable;
    this.extra100KmPrice = vehicle.extra100KmPrice;
    this.canLeaveCountry = vehicle.canLeaveCountry;
  }
}
