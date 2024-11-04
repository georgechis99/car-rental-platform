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
  pickupLocation: string;
  dropoffLocation: string;
  userFullName: string;
}
