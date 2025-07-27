import { baseApi } from "../baseApi";

const supplierApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSupplier: build.mutation({
      query: (data) => ({
        url: "/suppliers/create-supplier",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["supplier-list"],
    }),
    getSuppliers: build.query({
      query: () => ({
        url: "/suppliers",
        method: "GET",
      }),
      providesTags: ["supplier-list"],
    }),
    getSingleSupplier: build.query({
      query: (id: string) => ({
        url: `/suppliers/${id}`,
        method: "GET",
      }),
      providesTags: ["single-supplier"],
    }),
    updateSupplier: build.mutation({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["supplier-list", "single-supplier"],
    }),
    deleteSupplier: build.mutation({
      query: (id: string) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supplier-list"],
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
  useGetSingleSupplierQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
