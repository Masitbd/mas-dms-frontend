"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Panel,
  Divider,
  Button,
  ButtonGroup,
  Message,
  InputPicker,
  Input,
  InputGroup,
} from "rsuite";
import {
  User,
  UserCheck,
  UserX,
  RotateCcw,
  Wand2,
  Search,
  X,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";
import {
  useForm,
  Controller,
  useWatch,
  type Control,
  type RegisterOptions,
} from "react-hook-form";
import {
  CustomerInfo,
  CustomerMode,
  CustomerSearchOption,
  LineItem,
  PaymentMethod,
  Product,
  SalesUser,
} from "@/components/sales-v2/SalesTypes";
import { money } from "@/components/medicine-purchese/MedicinePurcheseTypes";
import { ProductLineItemsTable } from "@/components/sales-v2/ProductLineItemsTable";
import { ProductSearchCombobox } from "@/components/sales-v2/ProductSearchCombobox";
import { ProductQuickEntryRow } from "@/components/sales-v2/ProductQuickEntryRow";
import { SalesSection } from "@/components/sales-v2/SalesSection";
import { CustomerInfoForm } from "@/components/sales-v2/CustomerInfoForm";
import { CustomerDetailsModule } from "@/components/sales-v2/CustomerDetailsModule";
import {
  calcNetAmount,
  clamp,
  discountMaxPct,
  round2,
  safeNum,
} from "@/components/sales-v2/SalesHelpe";

/* ============================================================
 * 1) TYPES
 * ============================================================
 */

type DbCustomer = {
  id: string;
  name: string;
  field: string;
  address: string;
  contactNo: string;
};

/* ============================================================
 * 2) HELPERS
 * ============================================================
 */

function sameCustomer(a: CustomerInfo, b: CustomerInfo) {
  return (
    (a.customerId ?? "") === (b.customerId ?? "") &&
    a.name === b.name &&
    a.field === b.field &&
    a.address === b.address &&
    a.contactNo === b.contactNo &&
    a.patientType === b.patientType &&
    (a.bedNo ?? "") === (b.bedNo ?? "") &&
    (a.indoorBillNo ?? "") === (b.indoorBillNo ?? "")
  );
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function toNumberSafe(v: unknown): number {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : NaN;
}

/* ============================================================
 * 3) SHARED HOOKS (Debounce + Click Outside)
 * ============================================================
 */

/* ============================================================
 * 4) MOCK DB
 * ============================================================
 */

const MOCK_CUSTOMERS: DbCustomer[] = [
  {
    id: "c1",
    name: "Abdul Karim",
    field: "Regular",
    address: "Mirpur, Dhaka",
    contactNo: "01711111111",
  },
  {
    id: "c2",
    name: "Sadia Islam",
    field: "VIP",
    address: "Uttara, Dhaka",
    contactNo: "01822222222",
  },
  {
    id: "c3",
    name: "Rahim Uddin",
    field: "Corporate",
    address: "Dhanmondi, Dhaka",
    contactNo: "01933333333",
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Paracetamol 500mg",
    sku: "MED-001",
    unit: "Box",
    defaultRate: 30,
    defaultDiscountPct: 0,
    defaultVatPct: 0,
  },
  {
    id: "p2",
    name: "Napa Extra",
    sku: "MED-002",
    unit: "Box",
    defaultRate: 45,
    defaultDiscountPct: 5,
    defaultVatPct: 5,
  },
  {
    id: "p3",
    name: "Syringe 5ml",
    sku: "CON-011",
    unit: "Pc",
    defaultRate: 8,
    defaultDiscountPct: 0,
    defaultVatPct: 0,
  },
  {
    id: "p4",
    name: "Glucose Saline 500ml",
    sku: "IV-020",
    unit: "Bag",
    defaultRate: 95,
    defaultDiscountPct: 2,
    defaultVatPct: 5,
  },
  {
    id: "p5",
    name: "Bandage Roll",
    sku: "CON-002",
    unit: "Roll",
    defaultRate: 25,
    defaultDiscountPct: 0,
    defaultVatPct: 0,
  },
  {
    id: "p6",
    name: "Antiseptic Solution 100ml",
    sku: "CON-005",
    unit: "Bottle",
    defaultRate: 60,
    defaultDiscountPct: 3,
    defaultVatPct: 5,
  },
];
/* ============================================================
 * 5) MAIN PAGE (ALL STATE LIVES HERE)
 * ============================================================
 */

export default function SalesPage() {
  const blankCustomer: CustomerInfo = useMemo(
    () => ({
      customerId: undefined,
      name: "",
      field: "",
      address: "",
      contactNo: "",
      patientType: "outdoor",
      bedNo: "",
      indoorBillNo: "",
    }),
    []
  );

  const updateDefaults: CustomerInfo = useMemo(
    () => ({
      customerId: undefined,
      name: "Default Name (Edit Mode)",
      field: "Default Field",
      address: "Default Address",
      contactNo: "01000000000",
      patientType: "outdoor",
      bedNo: "",
      indoorBillNo: "",
    }),
    []
  );

  // Customer states
  const [mode, setMode] = useState<CustomerMode>("unregistered");
  const [customer, setCustomer] = useState<CustomerInfo>(blankCustomer);

  const safeSetCustomer = (next: CustomerInfo) => {
    setCustomer((prev) => (sameCustomer(prev, next) ? prev : next));
  };

  // Product UI + business states (kept here by requirement)
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productSearchResults, setProductSearchResults] = useState<Product[]>(
    []
  );
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [productSearchHighlight, setProductSearchHighlight] = useState(0);

  const [pickedProduct, setPickedProduct] = useState<Product | null>(null);
  const [qtyDraft, setQtyDraft] = useState("");
  const [rateDraft, setRateDraft] = useState("");

  const [productRowError, setProductRowError] = useState<string | null>(null);

  // Focus control (nonce pattern)
  const [focusQtyKey, setFocusQtyKey] = useState(0);
  const [focusSearchKey, setFocusSearchKey] = useState(0);

  // Financial demo states (kept here; calculations are real)
  const [discountDraft, setDiscountDraft] = useState<string>("0");
  const [vatPctDraft, setVatPctDraft] = useState<string>("0");
  const [paidDraft, setPaidDraft] = useState<string>("0");

  // ----------------------------
  // DB/API calls (customer)
  // ----------------------------
  const searchRegisteredCustomers = async (
    query: string
  ): Promise<CustomerSearchOption[]> => {
    await wait(150);
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.contactNo.includes(q)
    )
      .slice(0, 10)
      .map((c) => ({
        label: `${c.name} (${c.contactNo})`,
        value: c.id,
      }));
  };

  const fetchRegisteredCustomer = async (
    customerId: string
  ): Promise<CustomerInfo | null> => {
    await wait(150);
    const found = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (!found) return null;
    return {
      customerId: found.id,
      name: found.name,
      field: found.field,
      address: found.address,
      contactNo: found.contactNo,
      patientType: "outdoor",
      bedNo: "",
      indoorBillNo: "",
    };
  };

  // ----------------------------
  // DB/API calls (products - demo)
  // ----------------------------
  const searchProducts = useCallback(
    async (query: string): Promise<Product[]> => {
      await wait(140);
      const q = query.trim().toLowerCase();

      if (!q) return MOCK_PRODUCTS.slice(0, 12);

      return MOCK_PRODUCTS.filter((p) => {
        const name = p.name.toLowerCase();
        const sku = (p.sku ?? "").toLowerCase();
        return name.includes(q) || sku.includes(q);
      }).slice(0, 15);
    },
    []
  );

  // ---------------------------------------
  // Discount Calculations
  // --------------------------------------
  const user: SalesUser = useMemo(
    () => ({ id: "u1", name: "Cashier", role: "staff" }), // demo
    []
  );

  const [discountEdits, setDiscountEdits] = useState<Record<string, string>>(
    {}
  );

  const changeLineDiscount = (lineId: string, deltaPct: number) => {
    setLineItems((prev) =>
      prev.map((li) => {
        if (li.lineId !== lineId) return li;

        const maxPct = discountMaxPct(user, li.discountDefaultLimitPct);
        const nextPct = clamp(
          (Number.isFinite(li.discountPct) ? li.discountPct : 0) + deltaPct,
          0,
          maxPct
        );

        if (nextPct === li.discountPct) return li;

        const { net, discountPctApplied } = calcNetAmount({
          user,
          qty: li.qty,
          rate: li.rate,
          discountPct: nextPct,
          discountDefaultLimitPct: li.discountDefaultLimitPct,
        });

        // keep input text synced
        setDiscountEdits((m) => ({
          ...m,
          [lineId]: String(discountPctApplied),
        }));

        return { ...li, discountPct: discountPctApplied, amount: net };
      })
    );
  };

  const incLineDiscount = (lineId: string) => changeLineDiscount(lineId, +1);
  const decLineDiscount = (lineId: string) => changeLineDiscount(lineId, -1);

  const commitDiscountEdit = (lineId: string) => {
    const li = lineItems.find((x) => x.lineId === lineId);
    if (!li) return;

    const raw = String(discountEdits[lineId] ?? "").trim();

    // empty => 0
    const parsed = raw === "" ? 0 : Number(raw);

    if (!Number.isFinite(parsed) || parsed < 0) {
      // revert to current, do not poison state
      setDiscountEdits((m) => ({ ...m, [lineId]: String(li.discountPct) }));
      setProductRowError("Discount must be a valid number (0–cap).");
      return;
    }

    const maxPct = discountMaxPct(user, li.discountDefaultLimitPct);
    const nextPct = clamp(parsed, 0, maxPct);

    if (parsed > maxPct) {
      setProductRowError(`Discount capped at ${maxPct}% for this product.`);
    } else {
      setProductRowError(null);
    }

    const { net, discountPctApplied } = calcNetAmount({
      user,
      qty: li.qty,
      rate: li.rate,
      discountPct: nextPct,
      discountDefaultLimitPct: li.discountDefaultLimitPct,
    });

    setLineItems((prev) =>
      prev.map((x) =>
        x.lineId === lineId
          ? { ...x, discountPct: discountPctApplied, amount: net }
          : x
      )
    );

    setDiscountEdits((m) => ({ ...m, [lineId]: String(discountPctApplied) }));
  };

  // ----------------------------
  // Product actions (add/remove/clear)
  // ----------------------------

  const clearProductEntry = () => {
    setPickedProduct(null);
    setQtyDraft("");
    setRateDraft("");
    setProductSearchQuery("");
    setProductRowError(null);
    setProductSearchHighlight(0);
  };

  const addLineItem = (p: Product, qty: number, rate: number) => {
    const defaultLimit = clamp(p.defaultDiscountPct ?? 0, 0, 100);

    const { discountPctApplied, net } = calcNetAmount({
      user,
      qty,
      rate,
      discountPct: defaultLimit,
      discountDefaultLimitPct: defaultLimit,
    });

    const lineId = uid("line");
    const defaultVatPct = clamp(p.defaultVatPct ?? 0, 0, 100);

    const li: LineItem = {
      lineId,
      productId: p.id,
      name: p.name,
      sku: p.sku,
      unit: p.unit,
      qty,
      rate,
      discountDefaultLimitPct: defaultLimit,
      discountPct: discountPctApplied,
      amount: net,
      vatPct: defaultVatPct,
    };

    setLineItems((prev) => [li, ...prev]);
    setDiscountEdits((m) => ({ ...m, [lineId]: String(discountPctApplied) }));
  };

  const removeLineItem = (lineId: string) => {
    setLineItems((prev) => prev.filter((x) => x.lineId !== lineId));
    setQtyEdits((m) => {
      const { [lineId]: _, ...rest } = m;
      return rest;
    });
    setDiscountEdits((m) => {
      const { [lineId]: _, ...rest } = m;
      return rest;
    });
  };

  const handleSelectProduct = (p: Product) => {
    setPickedProduct(p);

    // ✅ show selected product in search bar
    setProductSearchQuery(p.name);

    // ✅ default rate
    setRateDraft(String(p.defaultRate));

    // reset qty for new entry
    setQtyDraft("");

    // close dropdown + focus qty
    setProductSearchOpen(false);
    setProductRowError(null);
    setFocusQtyKey((k) => k + 1);
  };

  const handleAddRequested = () => {
    setProductRowError(null);

    const p = pickedProduct;
    if (!p) {
      setProductRowError("Select a product first.");
      setFocusSearchKey((k) => k + 1);
      return;
    }

    const qty = toNumberSafe(qtyDraft);
    const rate = toNumberSafe(rateDraft);

    if (!Number.isFinite(qty) || qty <= 0) {
      setProductRowError("Quantity must be a positive number.");
      setFocusQtyKey((k) => k + 1);
      return;
    }

    if (!Number.isFinite(rate) || rate < 0) {
      setProductRowError("Rate must be a valid number (0 or higher).");
      return;
    }

    addLineItem(p, qty, rate);

    // After add: clear entry + focus back to search for fast entry
    clearProductEntry();
    setProductSearchOpen(true);
    setFocusSearchKey((k) => k + 1);
  };

  const resetAll = () => {
    setMode("unregistered");
    safeSetCustomer(blankCustomer);

    setLineItems([]);
    clearProductEntry();

    setProductSearchOpen(false);
    setProductSearchResults([]);
    setProductSearchLoading(false);

    setDiscountDraft("0");
    setVatPctDraft("0");
    setPaidDraft("0");
  };

  // ---------------------------
  // For Increasing and decreasing quantity in the sales page
  // ----------------------------
  const [qtyEdits, setQtyEdits] = useState<Record<string, string>>({});
  const setLineQty = (lineId: string, nextQty: number) => {
    setLineItems((prev) =>
      prev.map((li) => {
        if (li.lineId !== lineId) return li;

        const safeQty = Number.isFinite(nextQty) ? nextQty : li.qty;
        const finalQty = Math.max(1, safeQty); // never below 1

        if (finalQty === li.qty) return li;

        return {
          ...li,
          qty: finalQty,
          amount: finalQty * li.rate,
        };
      })
    );

    // keep input text in sync
    setQtyEdits((m) => ({ ...m, [lineId]: String(nextQty) }));
  };

  const commitQtyEdit = (lineId: string) => {
    setQtyEdits((m) => {
      const raw = m[lineId];

      // if draft missing, nothing to commit
      if (raw === undefined) return m;

      const n = Number(String(raw).trim());

      // invalid => revert draft to current qty and show error
      if (!Number.isFinite(n) || n <= 0) {
        const current = lineItems.find((x) => x.lineId === lineId)?.qty ?? 1;
        // reuse your existing message state (top warning)
        setProductRowError("Quantity must be a positive number.");
        return { ...m, [lineId]: String(current) };
      }

      setProductRowError(null);
      setLineQty(lineId, n);
      return m;
    });
  };

  const changeLineQty = (lineId: string, delta: number) => {
    setLineItems((prev) => {
      const next = prev.map((li) => {
        if (li.lineId !== lineId) return li;

        const currentQty = Number.isFinite(li.qty) ? li.qty : 1;
        const nextQty = Math.max(1, currentQty + delta);

        if (nextQty === li.qty) return li;

        return { ...li, qty: nextQty, amount: nextQty * li.rate };
      });

      return next;
    });

    // keep qty input updated immediately
    setQtyEdits((m) => {
      const current = lineItems.find((x) => x.lineId === lineId)?.qty ?? 1;
      const nextQty = Math.max(1, current + delta);
      return { ...m, [lineId]: String(nextQty) };
    });
  };

  const incLineQty = (lineId: string) => changeLineQty(lineId, +1);
  const decLineQty = (lineId: string) => changeLineQty(lineId, -1);
  // ----------------------------
  // Financial calculations (real)
  // ----------------------------
  const subtotal = useMemo(
    () =>
      lineItems.reduce(
        (s, x) => s + (Number.isFinite(x.amount) ? x.amount : 0),
        0
      ),
    [lineItems]
  );

  const discount = useMemo(() => {
    const d = toNumberSafe(discountDraft);
    if (!Number.isFinite(d) || d < 0) return 0;
    return Math.min(d, subtotal);
  }, [discountDraft, subtotal]);

  const vatPct = useMemo(() => {
    const v = toNumberSafe(vatPctDraft);
    if (!Number.isFinite(v) || v < 0) return 0;
    return Math.min(v, 100);
  }, [vatPctDraft]);

  const vatAmount = useMemo(() => {
    const base = Math.max(subtotal - discount, 0);
    return (base * vatPct) / 100;
  }, [subtotal, discount, vatPct]);

  const grandTotal = useMemo(
    () => Math.max(subtotal - discount + vatAmount, 0),
    [subtotal, discount, vatAmount]
  );
  // ------------------------
  // For Financial SECTION
  // ------------------------
  const [extraDiscountDraft, setExtraDiscountDraft] = useState<string>("0"); // cash discount amount
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const total = useMemo(() => {
    return round2(lineItems.reduce((s, li) => s + safeNum(li.amount, 0), 0));
  }, [lineItems]);

  const lineDiscountTotal = useMemo(() => {
    // gross - net for each line
    const sum = lineItems.reduce((s, li) => {
      const gross = safeNum(li.qty, 0) * safeNum(li.rate, 0);
      const net = safeNum(li.amount, 0);
      const disc = Math.max(gross - net, 0);
      return s + disc;
    }, 0);
    return round2(sum);
  }, [lineItems]);

  const extraDiscount = useMemo(() => {
    const raw = safeNum(String(extraDiscountDraft).trim(), 0);
    return round2(clamp(raw, 0, total)); // cannot exceed total
  }, [extraDiscountDraft, total]);

  // Allocate extra discount proportionally to line net, to get correct VAT base even if VAT% differs per line.
  const vat = useMemo(() => {
    if (lineItems.length === 0) return 0;

    const subtotalNet = total;
    if (subtotalNet <= 0) return 0;

    const extra = extraDiscount;

    const sumVat = lineItems.reduce((s, li) => {
      const net = safeNum(li.amount, 0);
      const share = net / subtotalNet; // safe since subtotalNet > 0
      const netAfterExtra = Math.max(net - extra * share, 0);

      const vatPct = clamp(safeNum(li.vatPct, 0), 0, 100);
      const vatAmt = (netAfterExtra * vatPct) / 100;

      return s + vatAmt;
    }, 0);

    return round2(sumVat);
  }, [lineItems, total, extraDiscount]);

  const totalDiscount = useMemo(() => {
    // line discount + extra cash discount
    return round2(lineDiscountTotal + extraDiscount);
  }, [lineDiscountTotal, extraDiscount]);

  const netPayableRaw = useMemo(() => {
    // Total is net after line discounts (before VAT). Subtract extra discount, add VAT.
    const base = Math.max(total - extraDiscount, 0);
    return base + vat;
  }, [total, extraDiscount, vat]);

  const adjustment = useMemo(() => {
    // auto: fix floating point / rounding to 2 decimals
    return round2(round2(netPayableRaw) - netPayableRaw);
  }, [netPayableRaw]);

  const netPayable = useMemo(() => {
    return round2(netPayableRaw + adjustment);
  }, [netPayableRaw, adjustment]);

  const paid = useMemo(() => {
    const raw = safeNum(String(paidDraft).trim(), 0);
    return round2(clamp(raw, 0, netPayable)); // cannot exceed net payable
  }, [paidDraft, netPayable]);

  const due = useMemo(() => {
    return round2(Math.max(netPayable - paid, 0));
  }, [netPayable, paid]);

  // ------------------------------
  // For extra discount
  // ------------------------------
  const commitExtraDiscount = () => {
    setExtraDiscountDraft((v) => {
      const raw = safeNum(String(v).trim(), 0);
      return String(round2(clamp(raw, 0, total)));
    });
  };

  const commitPaid = () => {
    setPaidDraft((v) => {
      const raw = safeNum(String(v).trim(), 0);
      return String(round2(clamp(raw, 0, netPayable)));
    });
  };
  return (
    <div className="h-screen w-full bg-white p-2">
      {/* ======================================================
       * CUSTOMER INFORMATION (EXISTING)
       * ====================================================== */}
      <CustomerDetailsModule
        mode={mode}
        onModeChange={setMode}
        customer={customer}
        onCustomerChange={safeSetCustomer}
        blankCustomer={blankCustomer}
        updateDefaults={updateDefaults}
        searchRegisteredCustomers={searchRegisteredCustomers}
        fetchRegisteredCustomer={fetchRegisteredCustomer}
      />

      <div className="mt-3" />

      {/* ======================================================
       * SALES SECTION (LEFT: FINANCIAL DEMO / RIGHT: PRODUCT TABLE)
       * ====================================================== */}
      <SalesSection
        // product ui state
        productSearchOpen={productSearchOpen}
        setProductSearchOpen={setProductSearchOpen}
        productSearchQuery={productSearchQuery}
        setProductSearchQuery={setProductSearchQuery}
        productSearchResults={productSearchResults}
        setProductSearchResults={setProductSearchResults}
        productSearchLoading={productSearchLoading}
        setProductSearchLoading={setProductSearchLoading}
        productSearchHighlight={productSearchHighlight}
        setProductSearchHighlight={setProductSearchHighlight}
        // picked + drafts
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
        qtyDraft={qtyDraft}
        setQtyDraft={setQtyDraft}
        rateDraft={rateDraft}
        setRateDraft={setRateDraft}
        // errors
        productRowError={productRowError}
        setProductRowError={setProductRowError}
        // focus control
        focusQtyKey={focusQtyKey}
        focusSearchKey={focusSearchKey}
        // business state
        lineItems={lineItems}
        onRemoveLine={removeLineItem}
        // actions
        searchProducts={searchProducts}
        onSelectProduct={handleSelectProduct}
        onAddRequested={handleAddRequested}
        onResetAll={resetAll}
        onClearEntry={clearProductEntry}
        // financial demo
        total={total}
        vat={vat}
        totalDiscount={totalDiscount}
        adjustment={adjustment}
        netPayable={netPayable}
        extraDiscountDraft={extraDiscountDraft}
        setExtraDiscountDraft={setExtraDiscountDraft}
        onCommitExtraDiscount={commitExtraDiscount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paidDraft={paidDraft}
        setPaidDraft={setPaidDraft}
        onCommitPaid={commitPaid}
        due={due}
        // quantity updated

        onDecQty={decLineQty}
        onIncQty={incLineQty}
        qtyEdits={qtyEdits}
        onQtyDraftChange={(lineId, v) =>
          setQtyEdits((m) => ({ ...m, [lineId]: v }))
        }
        onQtyCommit={commitQtyEdit}
        // For product Line discount
        discountEdits={discountEdits}
        onIncDiscount={incLineDiscount}
        onDecDiscount={decLineDiscount}
        onDiscountDraftChange={(id, v) =>
          setDiscountEdits((m) => ({ ...m, [id]: v }))
        }
        onDiscountCommit={commitDiscountEdit}
      />
    </div>
  );
}
