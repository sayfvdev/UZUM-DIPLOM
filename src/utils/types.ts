export interface User {
  lastName: string;
  firstName: string;
  middleName?: string;
  birthDate?: string;
  email: string;
  phone: string;
  name: string;
  password: string;
  gender?: string; 
}


export interface Product {
  quantity?: number;
  id: string;
  title: string;
  description: string;
  colors: string[];
  rating: number;
  price: number;
  isBlackFriday: boolean;
  salePercentage: number;
  media: string[];
  type: string;
  dioganal?: string | string[];
}



export interface ProductBase {
  title: string; 
  id: number;
  description: string;
  price: number;
  oldPrice?: number;
  media: string[];
  type: string;
}

export interface Database {
  goods: Product[];
  users: { name?: string; phone: string; password: string }[];
}

