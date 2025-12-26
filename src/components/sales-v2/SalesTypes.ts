export type PaymentMethod = "cash" | "card" | "bank";

export type Product = {
  id: string;
  name: string;
  sku?: string;
  unit?: string;
  defaultRate: number;

  defaultDiscountPct?: number; // already used
  defaultVatPct?: number; // ✅ NEW (per product default VAT%)
};

export type LineItem = {
  lineId: string;
  productId: string;
  name: string;
  sku?: string;
  unit?: string;
  qty: number;
  rate: number;

  discountDefaultLimitPct: number;
  discountPct: number;

  vatPct: number; // ✅ NEW (stored per line)

  amount: number; // net amount after discount (before VAT)
};
// --------------------------------
export type PatientType = "outdoor" | "indoor";

export type CustomerMode = "unregistered" | "registered";

export type CustomerInfo = {
  customerId?: string;
  name: string;
  field: string;
  address: string;
  contactNo: string;
  patientType: PatientType;
  bedNo?: string;
  indoorBillNo?: string;
};

export type CustomerSearchOption = {
  label: string;
  value: string;
};

export type CustomerDetailsModuleProps = {
  mode: CustomerMode;
  onModeChange: (mode: CustomerMode) => void;

  customer: CustomerInfo;
  onCustomerChange: (next: CustomerInfo) => void;

  blankCustomer: CustomerInfo;
  updateDefaults?: CustomerInfo;

  searchRegisteredCustomers: (query: string) => Promise<CustomerSearchOption[]>;
  fetchRegisteredCustomer: (customerId: string) => Promise<CustomerInfo | null>;
};

export type SalesUserRole = "admin" | "staff";
export type SalesUser = { id: string; name: string; role: SalesUserRole };
