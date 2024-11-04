import { IVehicleInsuranceDetail } from "./vehicle-insurance-details";

export class Booking {
  id: string;
  vehicleId: number;
  userEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pickupDate: Date;
  dropoffDate: Date;
  pickupLocationId: number;
  dropoffLocationId: number;
  isGuest: boolean;
  isApproved: boolean;
  companyName: string;
  CUI: string;
  vehicleInsuranceDetails: IVehicleInsuranceDetail;
  childSeatOption: boolean;
  paymentMethod: number;
  marketingCheckbox: boolean;
  promoCode: string;
}
