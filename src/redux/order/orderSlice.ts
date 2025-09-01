import { createSlice } from "@reduxjs/toolkit";

export interface IMedicineSale {
  item: {
    _id: string;
  };
  name: string;
  medicineId: string;
  quantity: number;
  unit_price: number;
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
  extra_discount: number;
  method: string;
}

export type IUnregisteredCustomerInfo = {
  name: string;
  address: string;
};

const balanceUpdater = (state: IOrder) => {
  if (state.medicines) {
    // per row total
    state.medicines = state.medicines.map((item) => {
      const rowTotal = item.unit_price * item.quantity;
      const discountAmount = (rowTotal * (item.discount || 0)) / 100;
      const vatAmount = item.isVat
        ? ((rowTotal - discountAmount) * (state.vat || 0)) / 100
        : 0;
      const finalTotal = rowTotal - discountAmount + vatAmount;

      return {
        ...item,
        rowTotal,
        discountAmount,
        vatAmount,
        finalTotal,
        total_price: finalTotal,
      };
    });

    // 1. Total bill
    state.totalBill = state.medicines.reduce((total, item) => {
      return total + item.unit_price * item.quantity;
    }, 0);

    // 2. discount
    state.totalDiscount = parseFloat(
      (
        state.medicines.reduce((total, item) => {
          const discountRate =
            (item.discount ?? state.percentDiscount ?? 0) / 100;
          const itemDiscount = item.unit_price * item.quantity * discountRate;
          return total + itemDiscount;
        }, 0) +
        Number(state.discountAmount || 0) +
        Number(state.extra_discount || 0)
      ).toFixed(2)
    );

    // 3. vat
    state.totalVat = parseFloat(
      state.medicines
        .reduce((total, item) => {
          const itemDiscount =
            item.unit_price *
            item.quantity *
            (item.discount
              ? (Number(item.discount ?? 0) ||
                  Number(state.percentDiscount ?? 0)) / 100
              : 0);

          const itemGrossPrice = item?.unit_price * item?.quantity;
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

    state.due = parseFloat(
      (state.netPayable - (state.paid ?? 0) - (state?.pPayment ?? 0)).toFixed(2)
    );
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
  method: "",
  extra_discount: 0,
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
          (item) => item.item._id !== action.payload
        );

      balanceUpdater(state);
    },
    toggleDiscount: (state, action) => {
      if (state.medicines && state.medicines.length) {
        state.medicines.find((item) => item._id === action.payload);
      }
      balanceUpdater(state);
    },
    toggleVat: (state, action) => {
      if (state.medicines && state.medicines.length) {
        const item = state.medicines.find(
          (item) => item._id === action.payload
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
          (entry) => entry.item?._id === action.payload
        );
        if (index !== -1) {
          state.medicines[index].quantity += 1;
          balanceUpdater(state);
        }
      }
    },

    decrementQty: (state, action) => {
      if (state?.medicines?.length) {
        const index = state.medicines.findIndex(
          (item) => item.item._id === action.payload
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
          (item) => item._id === payload?._id
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
        const foundItem = state.medicines.find(
          (item) => String(item?.medicineId) === String(payload?.item) // Use medicineId instead of _id
        );

        if (foundItem) {
          foundItem.discount = payload?.discount;
        } else {
          console.error("Medicine not found. Looking for:", payload?.item);
        }
      }
      balanceUpdater(state);
    },

    resetBill: () => initialState,
  },
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

// export const CurrentToken = (state: RootState) => state.order.finaltotal
