import { baseApi } from "./api/baseApi";
import order from "@/redux/order/orderSlice";
import salesDraftReducer from "@/redux/features/sales/salesDraftSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  order: order,
  salesDraft: salesDraftReducer,
};
