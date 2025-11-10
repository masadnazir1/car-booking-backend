export interface BookingDetail {
  bookingId: string;
  bookingDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  car: {
    name: string;
    make: string;
    vehicleType: string;
    bodyType: string;
    fuel: string;
    transmission: string;
    ac: boolean;
    seats: number;
    doors: number;
    year: number;
    mileage: number;
    images: string[];
    dailyRate: number;
  };
  rentalPeriod: {
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
  };
  dealer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
}
