import { InsuranceType } from "./insuranceType"

export class VehicleInsuranceDetail {
  id: number
  vehicleId: number
  insuranceType: InsuranceType
  insuranceTypeId: number
  insurancePrice: number
  depositAmount: number
  isActive: boolean
}
