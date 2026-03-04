import { baseApi } from "./baseApi";

const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMedicinesSalesReports: build.query({
      query: (query: Record<string, string>) => ({
        url: "/reports/medicine-sales-statement",
        method: "GET",
        params: query,
      }),
      providesTags: ["reports"],
    }),
    getDueCollectionReports: build.query({
      query: (args) => ({
        url: "/reports/due-collection",
        method: "GET",
        params: args,
      }),
      providesTags: ["single-medicine"],
    }),
    getDueCollectionSummeryReports: build.query({
      query: (args) => ({
        url: "/reports/due-collection-summery",
        method: "GET",
        params: args,
      }),
      providesTags: ["single-medicine"],
    }),
    getPatientDueReports: build.query({
      query: (args) => ({
        url: "/reports/patient-due-list",
        method: "GET",
        params: args,
      }),
      providesTags: ["single-medicine"],
    }),
    getPatientDueSummeryReports: build.query({
      query: (args) => ({
        url: "/reports/patient-due-summery",
        method: "GET",
        params: args,
      }),
      providesTags: ["single-medicine"],
    }),
    getMedicineStockOverview: build.query({
      query: (args) => ({
        url: "/reports/medicine-stock",
        method: "GET",
        params: args,
      }),
    }),
    getMedicineStockStatementReports: build.query({
      query: (args) => ({
        url: "/reports/medicine-stock-statement",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getMedicineProfitOverview: build.query({
      query: (args) => ({
        url: "/reports/medicine-profit-loss",
        method: "GET",
        params: args,
      }),
    }),
    getMedicineExpiryStatementReports: build.query({
      query: (args) => ({
        url: "/reports/medicine-expiry-statement",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getMedicineIncomeStatementSummaryReports: build.query({
      query: (args) => ({
        url: "/reports/medicine-income-statement-summary",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getMedicineIncomeStatementDetailsReports: build.query({
      query: (args) => ({
        url: "/reports/medicine-income-statement-details",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
  }),
});

export const {
  useGetDueCollectionReportsQuery,
  useGetDueCollectionSummeryReportsQuery,
  useGetMedicinesSalesReportsQuery,
  useGetPatientDueReportsQuery,
  useGetPatientDueSummeryReportsQuery,
  useGetMedicineStockOverviewQuery,
  useGetMedicineStockStatementReportsQuery,
  useGetMedicineProfitOverviewQuery,
  useGetMedicineExpiryStatementReportsQuery,
  useGetMedicineIncomeStatementSummaryReportsQuery,
  useGetMedicineIncomeStatementDetailsReportsQuery,
} = reportsApi;
