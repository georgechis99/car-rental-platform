import { IInsuranceType } from "./insurance-type";

export interface IVehicleInsuranceDetail{
  vehicleId: number;
  insuranceType: IInsuranceType;
  insurancePrice: number;
  depositAmount: number;
  isActive: boolean;
}
