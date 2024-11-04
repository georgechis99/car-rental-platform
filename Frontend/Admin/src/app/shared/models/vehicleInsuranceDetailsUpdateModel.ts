import { Discount } from "./discount";
import { Vehicle } from "./vehicle";
import { VehicleInsuranceDetail } from "./vehicleInsuranceDetail";

export class VehicleInsuranceDetailsUpdateModel {
  vehicleId: number;
  vehicle: Vehicle;
  vehicleInsuranceDetails: VehicleInsuranceDetail[];
}
