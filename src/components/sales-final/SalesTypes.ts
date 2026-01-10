export type CustomerMode = "unregistered" | "registered";
export type PatientType = "outdoor" | "indoor";

export type PaymentMethod = "cash" | "card" | "bank";

export type SalesUserRole = "admin" | "staff";
export type SalesUser = { id: string; name: string; role: SalesUserRole };

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

/** ===== API search result shape ===== */
export type AvailableStockDoc = {
  _id: string;
  productId: string;
  purchaseItemId: string;
  batchNo: string;
  expiryDate: string;
  currentQuantity: number;
  salesRate: number;
  createdAt: string;
  updatedAt: string;
};

export type MedicineDoc = {
  _id: string;
  medicineId: string;
  name: string;
  genericName?: string;
  unit?: string;
  discount: number; // %
  vat: number; // %
};

export type Product = {
  availableStocks: AvailableStockDoc[];
  medicine: MedicineDoc;
};

/** ===== Cart line: batch-specific ===== */
export type LineItem = {
  lineId: string;

  medicineObjectId: string;
  medicineId: string;
  name: string;
  unit?: string;

  stockId: string;
  batchNo: string;
  expiryDate: string;

  stockCurrentQty: number; // for guarding qty per batch

  qty: number;
  rate: number;

  discountDefaultLimitPct: number;
  discountPct: number;
  vatPct: number;

  amount: number; // net after line discount, before VAT
};

/** ===== Canonical payload to send server ===== */
export type SalesSubmitPayload = {
  customerMode: CustomerMode;
  customer: CustomerInfo;

  items: Array<{
    medicineObjectId: string;
    stockId: string;
    batchNo: string;
    qty: number;
    rate: number;
    discountPct: number;
    vatPct: number;
  }>;

  finance: {
    extraDiscount: number; // amount
    paymentMethod: PaymentMethod;
    paid: number;
  };
};
