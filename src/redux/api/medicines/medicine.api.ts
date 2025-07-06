import { baseApi } from "../baseApi";

const medicineApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createMedicine: build.mutation({
      query: (data) => ({
        url: "/medicines/create-medicine",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["medicine-list"],
    }),
    getMedicines: build.query({
      query: (query: Record<string, string>) => ({
        url: "/medicines",
        method: "GET",
        params: query,
      }),
      providesTags: ["medicine-list"],
    }),
    getSingleMedicine: build.query({
      query: (id: string) => ({
        url: `/medicines/${id}`,
        method: "GET",
      }),
      providesTags: ["single-medicine"],
    }),
    updateMedicine: build.mutation({
      query: ({ id, data }) => ({
        url: `/medicines/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["medicine-list", "single-medicine"],
    }),
    deleteMedicine: build.mutation({
      query: (id: string) => ({
        url: `/medicines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["medicine-list"],
    }),
  }),
});

export const {
  useCreateMedicineMutation,
  useGetMedicinesQuery,
  useGetSingleMedicineQuery,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = medicineApi;
