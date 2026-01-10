export type PaymentMethod = "cash" | "card" | "bank";

// --- API search response types ---
export type AvailableStockDoc = {
  _id: string;
  productId: string;
  purchaseItemId: string;
  batchNo: string;
  expiryDate: string; // ISO
  currentQuantity: number;
  salesRate: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type MedicineDoc = {
  _id: string;
  medicineId: string;
  name: string;
  genericName?: string;
  unit?: string;

  discount: number; // % (product-wise)
  vat: number; // % (product-wise)

  // other fields exist but not needed here
};

export type MedicineSalesSearchItem = {
  availableStocks: AvailableStockDoc[];
  medicine: MedicineDoc;
};

// --- Cart line item (batch-specific) ---
export type LineItem = {
  lineId: string;

  medicineObjectId: string; // medicine._id
  medicineId: string; // medicine.medicineId
  name: string;
  unit?: string;

  stockId: string; // availableStocks._id (batch identity)
  batchNo: string;
  expiryDate: string;
  stockCurrentQty: number;

  qty: number;
  rate: number;

  discountDefaultLimitPct: number; // product default discount (cap for staff)
  discountPct: number; // applied discount %
  vatPct: number; // applied vat %

  amount: number; // net amount after discount, before VAT
};
export type Product = {
  availableStocks: AvailableStockDoc[];
  medicine: MedicineDoc;
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
  mode?: string;
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
};

export type SalesUserRole = "admin" | "staff";
export type SalesUser = { id: string; name: string; role: SalesUserRole };

export type SalesPayload = {
  customerMode: CustomerMode;
  customer: CustomerInfo;

  items: Array<{
    medicineObjectId: string; // medicine._id
    stockId: string; // availableStocks._id
    batchNo: string;
    expiryDate: string;

    qty: number;
    rate: number;

    discountPct: number;
    vatPct: number;
  }>;

  finance: {
    extraDiscount: number; // amount
    paymentMethod: PaymentMethod;
    paid: number; // amount (capped to netPayable)
  };

  // optional snapshot (server can ignore and recompute)
  summary?: {
    total: number;
    vat: number;
    adjustment: number;
    netPayable: number;
    due: number;
    totalDiscount: number;
  };
};

export const SALES_PATH = "/tests";
