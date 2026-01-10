import {
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import type {
  CustomerInfo,
  CustomerMode,
  LineItem,
  PaymentMethod,
  Product,
  SalesSubmitPayload,
  SalesUser,
} from "@/components/sales-final/SalesTypes";
import {
  calcNetAmount,
  clamp,
  computeFinancial,
  maxQtyForLine,
  reservedByStockId,
  safeNum,
  sortStocksLIFO,
  round2,
  discountMaxPct,
} from "@/components/sales-final/SalesHelper";

type SalesDraftState = {
  meta: {
    mode: "create" | "edit";
    saleId: string | null;
    status: "idle" | "loading" | "ready" | "error";
    error: string | null;
  };

  user: SalesUser;

  customerMode: CustomerMode;
  customer: CustomerInfo;

  lines: LineItem[];

  finance: {
    extraDiscount: number; // amount
    paymentMethod: PaymentMethod;
    paid: number; // committed paid
  };
};

const blankCustomer: CustomerInfo = {
  customerId: undefined,
  name: "",
  field: "",
  address: "",
  contactNo: "",
  patientType: "outdoor",
  bedNo: "",
  indoorBillNo: "",
};

const initialState: SalesDraftState = {
  meta: { mode: "create", saleId: null, status: "idle", error: null },

  // demo default user (replace from auth later)
  user: { id: "u1", name: "Cashier", role: "staff" },

  customerMode: "unregistered",
  customer: blankCustomer,

  lines: [],

  finance: {
    extraDiscount: 0,
    paymentMethod: "cash",
    paid: 0,
  },
};

export const salesDraftSlice = createSlice({
  name: "salesDraft",
  initialState,
  reducers: {
    setMeta(state, action: PayloadAction<Partial<SalesDraftState["meta"]>>) {
      state.meta = { ...state.meta, ...action.payload };
    },

    setUser(state, action: PayloadAction<SalesUser>) {
      state.user = action.payload;
    },

    resetDraft(state) {
      state.customerMode = "unregistered";
      state.customer = blankCustomer;
      state.lines = [];
      state.finance = { extraDiscount: 0, paymentMethod: "cash", paid: 0 };
      state.meta = { ...state.meta, status: "idle", error: null };
    },

    hydrateDraft(
      state,
      action: PayloadAction<{
        customerMode: CustomerMode;
        customer: CustomerInfo;
        lines: LineItem[];
        finance: SalesDraftState["finance"];
        saleId: string;
      }>
    ) {
      state.customerMode = action.payload.customerMode;
      state.customer = action.payload.customer;
      state.lines = action.payload.lines;
      state.finance = action.payload.finance;
      state.meta = {
        ...state.meta,
        mode: "edit",
        saleId: action.payload.saleId,
        status: "ready",
        error: null,
      };
    },

    setCustomerMode(state, action: PayloadAction<CustomerMode>) {
      state.customerMode = action.payload;
    },

    setCustomer(state, action: PayloadAction<CustomerInfo>) {
      state.customer = action.payload;
    },

    setExtraDiscount(state, action: PayloadAction<number>) {
      const { total } = computeFinancial(state.lines, 0);
      state.finance.extraDiscount = clamp(safeNum(action.payload, 0), 0, total);
    },

    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.finance.paymentMethod = action.payload;
    },

    setPaid(state, action: PayloadAction<number>) {
      // cap paid to netPayable (due before payment)
      const fin = computeFinancial(state.lines, state.finance.extraDiscount);
      state.finance.paid = clamp(
        round2(safeNum(action.payload, 0)),
        0,
        fin.netPayable
      );
    },

    removeLine(state, action: PayloadAction<string>) {
      state.lines = state.lines.filter((x) => x.lineId !== action.payload);
    },

    /** Add requested qty from a selected Product using LIFO, split across batches automatically */
    addFromSelection(
      state,
      action: PayloadAction<{
        selected: Product;
        requestedQty: number;
        rateOverride?: number | null;
      }>
    ) {
      const selected = action.payload.selected;
      const requestedQty = safeNum(action.payload.requestedQty, 0);
      if (!(requestedQty > 0)) return;

      const stocks = sortStocksLIFO(selected.availableStocks || []);
      const med = selected.medicine;

      const defaultDisc = clamp(safeNum(med.discount, 0), 0, 100);
      const vatPct = clamp(safeNum(med.vat, 0), 0, 100);

      const reservedMap = reservedByStockId(state.lines);

      let remaining = requestedQty;

      for (const st of stocks) {
        if (remaining <= 0) break;

        const reserved = reservedMap[st._id] ?? 0;
        const canUse = Math.max(safeNum(st.currentQuantity, 0) - reserved, 0);
        if (canUse <= 0) continue;

        const take = Math.min(remaining, canUse);

        const rate =
          action.payload.rateOverride == null
            ? safeNum(st.salesRate, 0)
            : safeNum(action.payload.rateOverride, safeNum(st.salesRate, 0));

        if (!(rate >= 0)) return;

        const { net, discountPctApplied } = calcNetAmount({
          user: state.user,
          qty: take,
          rate,
          discountPct: defaultDisc,
          discountDefaultLimitPct: defaultDisc,
        });

        const maxDisc = discountMaxPct(state.user, defaultDisc);
        const discApplied = clamp(discountPctApplied, 0, maxDisc);

        // merge if same batch+rate+disc+vat
        const idx = state.lines.findIndex(
          (x) =>
            x.stockId === st._id &&
            x.rate === rate &&
            x.discountPct === discApplied &&
            x.vatPct === vatPct
        );

        if (idx >= 0) {
          const existing = state.lines[idx];
          const mergedQty = existing.qty + take;

          // guard: cannot exceed max available for this row
          const fakeLine = { ...existing, qty: mergedQty };
          const maxQty = maxQtyForLine(state.lines, fakeLine);
          const finalQty = Math.min(Math.max(1, mergedQty), maxQty);

          const { net: mergedNet } = calcNetAmount({
            user: state.user,
            qty: finalQty,
            rate: existing.rate,
            discountPct: existing.discountPct,
            discountDefaultLimitPct: existing.discountDefaultLimitPct,
          });

          state.lines[idx] = {
            ...existing,
            qty: finalQty,
            amount: round2(mergedNet),
          };
        } else {
          state.lines.unshift({
            lineId: nanoid(),
            medicineObjectId: med._id,
            medicineId: med.medicineId,
            name: med.name,
            unit: med.unit,

            stockId: st._id,
            batchNo: st.batchNo,
            expiryDate: st.expiryDate,
            stockCurrentQty: Math.max(safeNum(st.currentQuantity, 0), 0),

            qty: take,
            rate,

            discountDefaultLimitPct: defaultDisc,
            discountPct: discApplied,
            vatPct,

            amount: round2(net),
          });
        }

        // update reserved for subsequent batches
        reservedMap[st._id] = (reservedMap[st._id] ?? 0) + take;
        remaining -= take;
      }

      // if remaining > 0: server-side will also validate; you can surface error in UI if needed
    },

    /** Commit qty for a row with batch guard */
    setLineQty(state, action: PayloadAction<{ lineId: string; qty: number }>) {
      const idx = state.lines.findIndex(
        (x) => x.lineId === action.payload.lineId
      );
      if (idx < 0) return;

      const li = state.lines[idx];
      const maxQty = maxQtyForLine(state.lines, li);
      const requested = safeNum(action.payload.qty, 1);

      const nextQty = Math.min(Math.max(1, requested), maxQty);
      const { net } = calcNetAmount({
        user: state.user,
        qty: nextQty,
        rate: li.rate,
        discountPct: li.discountPct,
        discountDefaultLimitPct: li.discountDefaultLimitPct,
      });

      state.lines[idx] = { ...li, qty: nextQty, amount: round2(net) };
    },

    incLineQty(state, action: PayloadAction<string>) {
      const li = state.lines.find((x) => x.lineId === action.payload);
      if (!li) return;
      salesDraftSlice.caseReducers.setLineQty(state, {
        type: "x",
        payload: { lineId: li.lineId, qty: li.qty + 1 },
      });
    },

    decLineQty(state, action: PayloadAction<string>) {
      const li = state.lines.find((x) => x.lineId === action.payload);
      if (!li) return;
      salesDraftSlice.caseReducers.setLineQty(state, {
        type: "x",
        payload: { lineId: li.lineId, qty: li.qty - 1 },
      });
    },

    /** Commit discount percent for a row (role-based cap) */
    setLineDiscountPct(
      state,
      action: PayloadAction<{ lineId: string; discountPct: number }>
    ) {
      const idx = state.lines.findIndex(
        (x) => x.lineId === action.payload.lineId
      );
      if (idx < 0) return;

      const li = state.lines[idx];
      const maxPct = discountMaxPct(state.user, li.discountDefaultLimitPct);
      const nextPct = clamp(safeNum(action.payload.discountPct, 0), 0, maxPct);

      const { net, discountPctApplied } = calcNetAmount({
        user: state.user,
        qty: li.qty,
        rate: li.rate,
        discountPct: nextPct,
        discountDefaultLimitPct: li.discountDefaultLimitPct,
      });

      state.lines[idx] = {
        ...li,
        discountPct: discountPctApplied,
        amount: round2(net),
      };
    },
  },
});

export const {
  setMeta,
  setUser,
  resetDraft,
  hydrateDraft,
  setCustomerMode,
  setCustomer,
  setExtraDiscount,
  setPaymentMethod,
  setPaid,
  removeLine,
  addFromSelection,
  setLineQty,
  incLineQty,
  decLineQty,
  setLineDiscountPct,
} = salesDraftSlice.actions;

export default salesDraftSlice.reducer;

/** ===== Selectors ===== */
export const selectSalesDraft = (s: RootState) => s.salesDraft;

export const selectLines = (s: RootState) => s.salesDraft.lines;
export const selectCustomer = (s: RootState) => s.salesDraft.customer;
export const selectCustomerMode = (s: RootState) => s.salesDraft.customerMode;
export const selectFinanceInput = (s: RootState) => s.salesDraft.finance;

export const selectFinancialSummary = createSelector(
  [selectLines, (s: RootState) => s.salesDraft.finance.extraDiscount],
  (lines, extraDiscount) => computeFinancial(lines, extraDiscount)
);

export const selectNetPayable = createSelector(
  [selectFinancialSummary],
  (f) => f.netPayable
);

export const selectDue = createSelector(
  [selectNetPayable, (s: RootState) => s.salesDraft.finance.paid],
  (netPayable, paid) => round2(Math.max(netPayable - safeNum(paid, 0), 0))
);

export const selectSubmitPayload = createSelector(
  [selectSalesDraft],
  (st): SalesSubmitPayload => ({
    customerMode: st.customerMode,
    customer: st.customer,
    items: st.lines.map((li) => ({
      medicineObjectId: li.medicineObjectId,
      stockId: li.stockId,
      batchNo: li.batchNo,
      qty: li.qty,
      rate: li.rate,
      discountPct: li.discountPct,
      vatPct: li.vatPct,
    })),
    finance: {
      extraDiscount: st.finance.extraDiscount,
      paymentMethod: st.finance.paymentMethod,
      paid: st.finance.paid,
    },
  })
);
