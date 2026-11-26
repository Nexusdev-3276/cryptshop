export type Category = "manettes" | "pc" | "scooters";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  platform: string;
  price: number;
  stock: number;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  highlights?: { label: string; value: string }[];
  image: string;
  featured?: boolean;
  note?: string;
};

export type CountryCode = "FR" | "BE" | "CH" | "CA";
export type FiatCurrency = "EUR" | "CHF" | "CAD";
export type CryptoCode = "BTC" | "ETH" | "SOL";

export type Country = {
  code: CountryCode;
  label: string;
  currency: FiatCurrency;
  locale: string;
  shipping: number;
  freeFrom: number;
  delay: string;
};

export type Rates = {
  fiat: Record<FiatCurrency, number>;
  crypto: Record<CryptoCode, number>;
  updatedAt: string;
  live: boolean;
};

export type OrderItem = {
  slug: string;
  name: string;
  qty: number;
  unit: number;
  line: number;
};

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  note?: string;
};

export type PlacedOrder = {
  id: string;
  createdAt: string;
  country: CountryCode;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: {
    currency: CryptoCode;
    amount: number;
    address: string | null;
    uri: string | null;
    rate: number;
  };
};
