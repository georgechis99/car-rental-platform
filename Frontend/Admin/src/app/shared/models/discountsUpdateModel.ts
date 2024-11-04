import { Discount } from "./discount";
import { Vehicle } from "./vehicle";

export class DiscountsUpdateModel {
  vehicleId: number;
  vehicle: Vehicle;
  canLeaveCountry: boolean;
  baseDepositAmount: number;
  price: number;
  extra100KmPrice: number;
  discounts: Discount[];
}
