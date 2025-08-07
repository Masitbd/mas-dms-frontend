import { baseApi } from "./api/baseApi";
import order from "@/redux/order/orderSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  order: order,
};
