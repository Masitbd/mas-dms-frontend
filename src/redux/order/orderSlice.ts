import { createSlice, createAsyncThunk, Action } from "@reduxjs/toolkit";

export interface IMedicineSale {
  medicineId: string;
  quantity: number;
  salesRate: number;
  total_price: number;
  discount: number;
  discount_type: string;
  isVat: boolean;
  _id: string;
}

export interface IOrder {
  name: string;
  address?: string;
  contact_no?: string;
  transaction_date?: Date;
  paymentId: string;
  invoice_no: string;
  patient_type: "outdoor" | "indoor";
  bed_no?: string;
  indoor_bill_no?: string;
  medicines: IMedicineSale[];
  totalBill: number;
  totalDiscount: number;
  percentDiscount: number;
  discountAmount: number;
  totalVat: number;
  vat: number;
  netPayable: number;
  due: number;
  pPayment?: number;
  paid: number;
}

export type IUnregisteredCustomerInfo = {
  name: string;
  address: string;
};

const balanceUpdater = (state: IOrder) => {
  if (state.medicines) {
    // 1. Total bill
    state.totalBill = state.medicines.reduce((total, item) => {
      return total + item.salesRate * item.quantity;
    }, 0);

    // 2. discount
    state.totalDiscount = parseFloat(
      (
        state.medicines.reduce((total, item) => {
          const itemDiscount =
            item.salesRate *
            item.quantity *
            (item.discount
              ? (Number(item.discount) || Number(state.percentDiscount)) / 100
              : 0);

          return total + itemDiscount;
        }, 0) + Number(state.discountAmount)
      ).toPrecision(2)
    );

    // 3. vat
    state.totalVat = parseFloat(
      state.medicines
        .reduce((total, item) => {
          const itemDiscount =
            item.salesRate *
            item.quantity *
            (item.discount
              ? (Number(item.discount ?? 0) ||
                  Number(state.percentDiscount ?? 0)) / 100
              : 0);

          const itemGrossPrice = item?.salesRate * item?.quantity;
          const itemCashDiscount =
            (state.discountAmount / state.totalBill) * itemGrossPrice;

          const vat = item?.isVat
            ? ((itemGrossPrice - itemDiscount - itemCashDiscount) *
                Number(state.vat ?? 0)) /
              100
            : 0;

          return total + vat;
        }, 0)
        .toPrecision(2)
    );

    state.netPayable = state.totalBill + state.totalVat - state.totalDiscount;

    state.due = state.netPayable - (state.paid ?? 0) - (state?.pPayment ?? 0);
  }
};

// Define the initial state for the slice
const initialState: IOrder = {
  name: "",
  paymentId: "",
  invoice_no: "",
  patient_type: "outdoor",
  medicines: [] as IMedicineSale[],
  totalBill: 0,
  totalDiscount: 0,
  percentDiscount: 0,
  discountAmount: 0,
  totalVat: 0,
  vat: 0,
  netPayable: 0,
  due: 0,
  paid: 0,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    updateBillDetails: (state, { payload }) => {
      Object.assign(state, payload);
      balanceUpdater(state);
    },
    addItem: (state, { payload }) => {
      if (state.medicines) {
        state.medicines.push(payload);
      } else {
        Object.assign(state, { items: [payload] });
      }

      balanceUpdater(state);
    },
    removeItem: (state, action) => {
      if (state.medicines?.length)
        state.medicines = state.medicines.filter(
          (item) => item.medicineId !== action.payload
        );

      balanceUpdater(state);
    },
    toggleDiscount: (state, action) => {
      if (state.medicines && state.medicines.length) {
        const item = state.medicines.find(
          (item) => item.medicineId === action.payload
        );
        // if (item) {
        //   item.isDiscount = !item.isDiscount;
        // }
      }
      balanceUpdater(state);
    },
    toggleVat: (state, action) => {
      if (state.medicines && state.medicines.length) {
        const item = state.medicines.find(
          (item) => item.medicineId === action.payload
        );
        if (item) {
          item.isVat = !item.isVat;
        }
      }
      balanceUpdater(state);
    },
    incrementQty: (state, action) => {
      if (state?.medicines?.length) {
        const index = state.medicines.findIndex(
          (item) => item.medicineId === action.payload
        );
        if (index !== -1) {
          state.medicines[index] = {
            ...state.medicines[index],
            quantity: state.medicines[index].quantity + 1,
          };
          balanceUpdater(state);
        }
      }
    },
    decrementQty: (state, action) => {
      if (state?.medicines?.length) {
        const index = state.medicines.findIndex(
          (item) => item.medicineId === action.payload
        );
        if (index !== -1) {
          if (state.medicines[index].quantity > 1) {
            state.medicines[index] = {
              ...state.medicines[index],
              quantity: state.medicines[index].quantity - 1,
            };
          } else {
            state.medicines.splice(index, 1);
          }
          balanceUpdater(state);
        }
      }
    },

    changeQty: (state, { payload }) => {
      if (state?.medicines?.length) {
        const index = state.medicines.findIndex(
          (item) => item.medicineId === payload?.itemCode
        );
        if (index !== -1) {
          state.medicines[index] = {
            ...state.medicines[index],
            quantity: payload?.quantity,
          };

          balanceUpdater(state);
        }
      }
    },
    setItemDiscount: (state, { payload }) => {
      if (state?.medicines?.length) {
        const index = state.medicines.findIndex(
          (item) => item?.medicineId == payload?.item?.itemCode
        );
        if (index !== -1) {
          state.medicines[index].discount = payload?.discount;
        }
      }
      balanceUpdater(state);
    },
    resetBill: () => initialState,
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(saveBill.pending, (state) => {
  //       state.loading = true;
  //     })
  //     .addCase(saveBill.fulfilled, (state) => {
  //       state.loading = false;
  //       state.error = null;
  //     })
  //     .addCase(saveBill.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload;
  //     });
  // },
});

export const {
  updateBillDetails,
  addItem,
  removeItem,
  toggleDiscount,
  toggleVat,
  resetBill,
  incrementQty,
  decrementQty,
  changeQty,
  setItemDiscount,
  //   updateCustomerInfo,
} = billSlice.actions;
export default billSlice.reducer;
