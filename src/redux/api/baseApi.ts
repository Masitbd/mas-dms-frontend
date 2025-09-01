// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import config from "@/config";
import { axiosBaseQuery } from "@/shared/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl: config.server_url as string }),
  endpoints: () => ({}),
  tagTypes: [
    "user-list",
    "supplier-list",
    "single-supplier",
    "category-list",
    "single-category",
    "generic-list",
    "single-generic",
    "medicine-list",
    "medicine-sales",
    "single-medicine",
    "purchase-list",
    "stock",
    "single-stock",
    "reports",
  ],
});
