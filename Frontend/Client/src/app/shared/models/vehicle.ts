import { IVehicleInsuranceDetail } from "./vehicle-insurance-details"

export class Vehicle {
  id: number
  vehicleBrand: string
  vehicleModel: string
  manufacturingDate: string
  price: number
  discountedPrice: number
  discountPercentage: number
  totalPrice: number
  totalPriceWithoutDiscounts: number
  hasAirConditioning: boolean
  pictureUrl: string
  transmissionType: string
  numberOfDoors: number
  maxNumberOfPassengers: number
  luggageCapacity: number
  fuelType: string
  baseDepositAmount: number
  reviewsScore: number
  baseMaxDistance: number
  vehicleInsuranceDetails: IVehicleInsuranceDetail[]
  pickupLocationDeliveryFee: number
  dropoffLocationDeliveryFee: number
}
