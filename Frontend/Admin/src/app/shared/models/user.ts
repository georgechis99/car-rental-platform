export interface User {
  id: string;
  email: string;
  token: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Address{
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
}
