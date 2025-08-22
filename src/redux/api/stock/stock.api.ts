import { baseApi } from "../baseApi";

const stockApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStocks: build.query({
      query: (query) => ({
        url: "/stock",
        method: "GET",
        params: query,
      }),
      providesTags: ["stock"],
    }),
    getSingleStock: build.query({
      query: (id: string) => ({
        url: `/stock/${id}`,
        method: "GET",
      }),
      providesTags: ["single-stock"],
    }),
  }),
});

export const { useGetStocksQuery, useGetSingleStockQuery } = stockApi;
