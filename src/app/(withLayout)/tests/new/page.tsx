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
  MedicineSalesSearchItem,
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
  buildSalesPayload,
  calcMaxQtyForLine,
  calcNetAmount,
  clamp,
  discountMaxPct,
  round2,
  safeNum,
  sendSaleToServer,
  sortStocksLIFO,
} from "@/components/sales-v2/SalesHelpe";
import { useLazyGetMedicineForSalesQuery } from "@/redux/api/medicines/medicine.api";
import {
  useCreateSaleMutation,
  useLazyGetSaleInvoiceQuery,
  useLazyGetSaleUiQuery,
  useLazyGetSaleUpdateQuery,
  useUpdateSaleMutation,
} from "@/redux/api/sales-final/sales.api";
import { ENUM_MODE } from "@/enums/EnumMode";
import { printInvoice } from "@/components/sales-v2/SalesInvoicePrinter";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Loading from "@/components/layout/Loading";

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

export default function SalesPage({
  params,
}: {
  params: { id: string; mode: string };
}) {
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

  // hooks
  const router = useRouter();

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
  // DB/API calls searchProduct
  // ----------------------------
  const [
    searchMedicine,
    { isLoading: isLoadingMedicine, isFetching: isFetchingMedicine },
  ] = useLazyGetMedicineForSalesQuery();

  const searchProducts = useCallback(
    async (query: string): Promise<Product[]> => {
      const result = await searchMedicine({ searchTerm: query }).unwrap();
      if (result && result.data && Array.isArray(result.data)) {
        return result.data;
      }
      return [];
    },
    []
  );

  const reservedByStockId = useMemo(() => {
    const m: Record<string, number> = {};
    for (const li of lineItems) {
      m[li.stockId] = (m[li.stockId] ?? 0) + safeNum(li.qty, 0);
    }
    return m;
  }, [lineItems]);
  const availableQtyForItem = useMemo(() => {
    return (item: MedicineSalesSearchItem) => {
      const sum = item.availableStocks.reduce((s, st) => {
        const reserved = reservedByStockId[st._id] ?? 0;
        const remaining = Math.max(
          safeNum(st.currentQuantity, 0) - reserved,
          0
        );
        return s + remaining;
      }, 0);
      return round2(sum);
    };
  }, [reservedByStockId]);
  const searchMedicines = useMemo(() => {
    return async (query: string): Promise<MedicineSalesSearchItem[]> => {
      const q = query.trim();
      if (!q) return [];

      const result = await searchMedicine({ searchTerm: q }).unwrap();
      // assume API returns MedicineSalesSearchItem[]
      return (result ?? []) as MedicineSalesSearchItem[];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMedicine]);

  // ----------------------------------------
  // Adding medicine to the cart by lifo method
  // ------------------------------------------
  // Selected item (full object)
  const [pickedMedicine, setPickedMedicine] =
    useState<MedicineSalesSearchItem | null>(null);

  const addMedicineToCartLIFO = (
    item: MedicineSalesSearchItem,
    requestedQty: number
  ) => {
    const stocks = sortStocksLIFO(item.availableStocks || []);
    const med = item.medicine;

    const defaultDisc = clamp(safeNum(med.discount, 0), 0, 100);
    const vatPct = clamp(safeNum(med.vat, 0), 0, 100);

    // role-based cap
    const maxDisc = discountMaxPct(user, defaultDisc);

    let remaining = requestedQty;
    const newLines: LineItem[] = [];

    for (const st of stocks) {
      if (remaining <= 0) break;

      const reserved = reservedByStockId[st._id] ?? 0;
      const canUse = Math.max(safeNum(st.currentQuantity, 0) - reserved, 0);
      if (canUse <= 0) continue;

      const take = Math.min(remaining, canUse);

      const rateOverride = String(rateDraft ?? "").trim();
      const rate =
        rateOverride === ""
          ? safeNum(st.salesRate, 0)
          : safeNum(rateOverride, safeNum(st.salesRate, 0));
      if (!Number.isFinite(rate) || rate < 0) {
        setProductRowError(
          "Invalid rate. Please enter a valid number (0 or higher)."
        );
        return;
      }

      // discount applied defaults to product default, but capped if staff
      const { net, discountPctApplied } = calcNetAmount({
        user,
        qty: take,
        rate,
        discountPct: defaultDisc,
        discountDefaultLimitPct: defaultDisc,
      });

      const lineId = `line_${st._id}_${Date.now()}_${Math.random()
        .toString(16)
        .slice(2)}`;

      newLines.push({
        lineId,
        medicineObjectId: med._id,
        medicineId: med.medicineId,
        name: med.name,
        unit: med.unit,
        stockId: st._id,
        batchNo: st.batchNo,
        expiryDate: st.expiryDate,
        qty: take,
        rate,
        discountDefaultLimitPct: defaultDisc,
        discountPct: clamp(discountPctApplied, 0, maxDisc),
        vatPct,
        amount: round2(net),
        stockCurrentQty: Math.max(Number(st.currentQuantity ?? 0), 0),
      });

      remaining -= take;
    }

    if (remaining > 0) {
      setProductRowError(`Insufficient stock. Missing qty: ${remaining}`);
      return;
    }

    // merge into existing lines when same stock + same rate + same discount + same vat
    setLineItems((prev) => {
      const next = [...prev];

      for (const nl of newLines) {
        const idx = next.findIndex(
          (x) =>
            x.stockId === nl.stockId &&
            x.rate === nl.rate &&
            x.discountPct === nl.discountPct &&
            x.vatPct === nl.vatPct
        );

        if (idx >= 0) {
          const existing = next[idx];
          const mergedQty = existing.qty + nl.qty;

          const { net } = calcNetAmount({
            user,
            qty: mergedQty,
            rate: existing.rate,
            discountPct: existing.discountPct,
            discountDefaultLimitPct: existing.discountDefaultLimitPct,
          });

          next[idx] = { ...existing, qty: mergedQty, amount: round2(net) };
        } else {
          next.unshift(nl);

          // keep draft inputs in sync (like qty field)
          setQtyEdits((m) => ({ ...m, [nl.lineId]: String(nl.qty) }));
          setDiscountEdits((m) => ({
            ...m,
            [nl.lineId]: String(nl.discountPct),
          }));
        }
      }

      return next;
    });

    // reset entry and focus search for next scan
    setProductRowError(null);
    setPickedMedicine(null);
    setProductSearchQuery("");
    setQtyDraft("");
    setRateDraft("");
    setProductSearchOpen(true);
    setFocusSearchKey((k) => k + 1);
  };

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
    setPickedMedicine(null);
    setQtyDraft("");
    setRateDraft("");
    setProductSearchQuery("");
    setProductRowError(null);
    setProductSearchHighlight(0);
  };

  // const addLineItem = (p: Product, qty: number, rate: number) => {
  //   const defaultLimit = clamp(p.defaultDiscountPct ?? 0, 0, 100);

  //   const { discountPctApplied, net } = calcNetAmount({
  //     user,
  //     qty,
  //     rate,
  //     discountPct: defaultLimit,
  //     discountDefaultLimitPct: defaultLimit,
  //   });

  //   const lineId = uid("line");
  //   const defaultVatPct = clamp(p.defaultVatPct ?? 0, 0, 100);

  //   const li: LineItem = {
  //     lineId,
  //     productId: p.id,
  //     name: p.name,
  //     sku: p.sku,
  //     unit: p.unit,
  //     qty,
  //     rate,
  //     discountDefaultLimitPct: defaultLimit,
  //     discountPct: discountPctApplied,
  //     amount: net,
  //     vatPct: defaultVatPct,
  //   };

  //   setLineItems((prev) => [li, ...prev]);
  //   setDiscountEdits((m) => ({ ...m, [lineId]: String(discountPctApplied) }));
  // };

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

  const handleSelectMedicine = (item: MedicineSalesSearchItem) => {
    setPickedMedicine(item);
    setProductSearchQuery(item.medicine.name);

    // default rate = LIFO top batch salesRate (if exists)
    const stocks = sortStocksLIFO(item.availableStocks || []);
    const topRate = stocks[0]?.salesRate ?? 0;
    setRateDraft(String(topRate));

    setQtyDraft("");
    setProductSearchOpen(false);
    setProductRowError(null);
    setFocusQtyKey((k) => k + 1);
  };

  const handleAddRequested = () => {
    setProductRowError(null);

    if (!pickedMedicine) {
      setProductRowError("Select a medicine first.");
      setFocusSearchKey((k) => k + 1);
      return;
    }

    const qty = safeNum(String(qtyDraft).trim(), NaN);
    if (!Number.isFinite(qty) || qty <= 0) {
      setProductRowError("Quantity must be a positive number.");
      setFocusQtyKey((k) => k + 1);
      return;
    }

    const available = availableQtyForItem(pickedMedicine);
    if (available <= 0) {
      setProductRowError("Out of stock.");
      setFocusSearchKey((k) => k + 1);
      return;
    }

    addMedicineToCartLIFO(pickedMedicine, qty);
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
    setLineItems((prev) => {
      const idx = prev.findIndex((x) => x.lineId === lineId);
      if (idx < 0) return prev;

      const li = prev[idx];
      const maxQty = calcMaxQtyForLine(prev, li);

      if (maxQty <= 0) {
        setProductRowError(
          `No available stock left for batch ${li.batchNo}. Row removed.`
        );
        setQtyEdits((m) => {
          const { [lineId]: _, ...rest } = m;
          return rest;
        });
        return prev.filter((x) => x.lineId !== lineId);
      }

      const raw = String(qtyEdits[lineId] ?? "").trim();
      const parsed = raw === "" ? NaN : Number(raw);

      if (!Number.isFinite(parsed) || parsed <= 0) {
        // revert to current qty
        setProductRowError("Quantity must be a positive number.");
        setQtyEdits((m) => ({ ...m, [lineId]: String(li.qty) }));
        return prev;
      }

      const requested = parsed;
      const nextQty = Math.min(Math.max(1, requested), maxQty);

      if (requested > maxQty) {
        setProductRowError(
          `Cannot exceed available quantity. Max for this batch: ${maxQty}`
        );
      } else {
        setProductRowError(null);
      }

      if (nextQty === li.qty) {
        setQtyEdits((m) => ({ ...m, [lineId]: String(nextQty) }));
        return prev;
      }

      const { net } = calcNetAmount({
        user,
        qty: nextQty,
        rate: li.rate,
        discountPct: li.discountPct,
        discountDefaultLimitPct: li.discountDefaultLimitPct,
      });

      const next = [...prev];
      next[idx] = { ...li, qty: nextQty, amount: round2(net) };

      setQtyEdits((m) => ({ ...m, [lineId]: String(nextQty) }));

      return next;
    });
  };

  const changeLineQty = (lineId: string, delta: number) => {
    setLineItems((prev) => {
      const idx = prev.findIndex((x) => x.lineId === lineId);
      if (idx < 0) return prev;

      const li = prev[idx];
      const maxQty = calcMaxQtyForLine(prev, li);

      // if batch is effectively unavailable, remove row
      if (maxQty <= 0) {
        setProductRowError(
          `No available stock left for batch ${li.batchNo}. Row removed.`
        );
        // cleanup drafts
        setQtyEdits((m) => {
          const { [lineId]: _, ...rest } = m;
          return rest;
        });
        return prev.filter((x) => x.lineId !== lineId);
      }

      const currentQty = Math.max(1, safeNum(li.qty, 1));
      const requested = currentQty + delta;

      // clamp to [1, maxQty]
      const nextQty = Math.min(Math.max(1, requested), maxQty);

      if (requested > maxQty) {
        setProductRowError(
          `Cannot exceed available quantity. Max for this batch: ${maxQty}`
        );
      } else {
        setProductRowError(null);
      }

      if (nextQty === li.qty) return prev;

      const { net } = calcNetAmount({
        user,
        qty: nextQty,
        rate: li.rate,
        discountPct: li.discountPct,
        discountDefaultLimitPct: li.discountDefaultLimitPct,
      });

      const next = [...prev];
      next[idx] = { ...li, qty: nextQty, amount: round2(net) };

      // keep input draft in sync
      setQtyEdits((m) => ({ ...m, [lineId]: String(nextQty) }));

      return next;
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

  // ----------------------------------
  // Fetching Invoice
  // ----------------------------------
  const [getInvoice, {}] = useLazyGetSaleInvoiceQuery();
  const printPdf = async (saleId: string) => {
    try {
      const result = await getInvoice({ id: saleId }).unwrap();
      if (result?.data) {
        printInvoice(result.data, "a4");
      }
    } catch (error) {}
  };

  // -----------------------------------
  // Sending sales data to the server
  // -----------------------------------

  const [createSale, { isLoading: isCreating, isSuccess: salesPosteSuccess }] =
    useCreateSaleMutation();
  const [updateSale, { isLoading: isUpdating }] = useUpdateSaleMutation();
  const handleSubmitSale = async () => {
    try {
      const result = await sendSaleToServer({
        mode: params?.mode == ENUM_MODE.UPDATE ? "edit" : "create", // "create" | "edit"
        // string | undefined
        build: () =>
          buildSalesPayload({
            customerMode: mode,
            customer,
            lineItems,
            paymentMethod,
            extraDiscount, // committed numeric state
            paid, // committed numeric state
            total,
            vat,
            adjustment,
            netPayable,
            due,
            totalDiscount,
          }),
        createFn: createSale,
        updateFn: updateSale,
        saleId: params.id,
      });
      resetAll();
      Swal.fire({
        icon: "success",
        title: `Sale ${
          params.mode == ENUM_MODE.UPDATE ? "Updated" : "Posted"
        } successfully`,
        showConfirmButton: false,
        confirmButtonText: "OK",
        timer: 1500,
        timerProgressBar: true,
      });
      // if (params.mode !== ENUM_MODE.UPDATE) {
      //   printPdf(params.id);
      // }
      router.push("/tests");
    } catch (e: any) {
      console.error(e);
      setProductRowError(e?.message ?? "Failed to save sale.");
    }
  };

  const cancelHandler = () => {
    resetAll();
    router.push("/tests");
  };

  // -------------------------------------
  // Fetching existing sale for edit mode
  // ------------------------------------
  const [
    getSales,
    { isLoading: salesDataLoading, isFetching: salesDataFetching },
  ] = useLazyGetSaleUpdateQuery();

  useEffect(() => {
    if (params?.id) {
      (async function () {
        const saleUi = await getSales(params?.id).unwrap();

        if (!saleUi?.data?.length) return;

        // 1) customer mode + customer snapshot
        setMode(saleUi?.data?.[0]?.current?.customer?.mode);

        safeSetCustomer({
          customerId:
            saleUi?.data?.[0]?.current?.customer.customerId ?? undefined,
          name: saleUi?.data?.[0]?.current?.customer.name ?? "",
          address: saleUi?.data?.[0]?.current?.customer.address ?? "",
          contactNo: saleUi?.data?.[0]?.current?.customer.contactNo ?? "",
          patientType:
            saleUi?.data?.[0]?.current?.customer.patientType ?? "outdoor",
          bedNo: saleUi?.data?.[0]?.current?.customer.bedNo ?? "",
          indoorBillNo: saleUi?.data?.[0]?.current?.customer.indoorBillNo ?? "",
        } as CustomerInfo);

        const linesFromServer = saleUi?.data?.[0]?.current?.items ?? [];

        const mappedLines: LineItem[] = linesFromServer.map((li: any) => ({
          lineId: li?.lineId,
          medicineObjectId: li?.medicineRef,
          medicineId: li.medicineRef,
          name: li?.medicineSnapshot?.name,
          unit: li?.medicineSnapshot?.unit,
          stockId: li?.stockRef,
          batchNo: li?.stockSnapshot?.batchNo,
          expiryDate: li?.stockSnapshot?.expiryDate,
          qty: li.qty,
          rate: li.rate,
          discountDefaultLimitPct: li?.medicineData?.discount,
          discountPct: li.discountPct,
          vatPct: li.vatPct,
          amount: li.lineTotal,
          stockCurrentQty: li?.stockData?.currentQuantity,
        }));
        console.log(mappedLines);
        setLineItems(mappedLines);

        // Setting out the payment method
        setPaymentMethod(saleUi?.data?.[0]?.current?.finance?.paymentMethod);
        paid;

        // Setting up paid

        setPaidDraft(saleUi?.data?.[0]?.current?.finance?.paid);
        setExtraDiscountDraft(
          saleUi?.data?.[0]?.current?.finance?.extraDiscount
        );

        // // 4) force RHF reset(s)
        // setSyncKey((k) => k + 1);
      })();
    }
  }, [getSales]);
  return (
    <div className="h-screen w-full bg-white p-2 relative">
      {/* ======================================================
       *Loading component
       * ====================================================== */}

      <Loading size="full" loading={salesDataFetching || salesDataLoading} />
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
        pickedProduct={pickedMedicine}
        setPickedProduct={setPickedMedicine}
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
        onSelectProduct={handleSelectMedicine}
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
        // Product Quantity
        getAvailableQty={availableQtyForItem}
        // Financial Action
        onCancel={cancelHandler}
        onSubmit={handleSubmitSale}
      />
    </div>
  );
}
