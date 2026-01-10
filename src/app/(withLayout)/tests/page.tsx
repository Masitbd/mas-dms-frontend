"use client";
import RPagination from "@/components/RPagination";
import AllSalesTable from "@/components/sales-v2/SalesTable";
import SalesHeader from "@/components/sales-v2/SalesTableHeader";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetAllSalesQuery } from "@/redux/api/sales-final/sales.api";
import React from "react";

const AllSales = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: salesData,
    isLoading: salesDataLoading,
    isFetching: salesDataFetching,
  } = useGetAllSalesQuery(query as any);
  return (
    <div>
      <div className="p-2">
        <SalesHeader
          addField={addField}
          deleteField={deleteField}
          query={query}
        />
      </div>
      <div className="p-2">
        <AllSalesTable
          data={salesData?.data?.data}
          isLoading={salesDataLoading || salesDataFetching}
          btn1Visibility={true}
          btn2Visibility={true}
          link1="medicine-entry"
          link2="medicine-entry"
        />
      </div>
      <div className="p-2">
        <div>
          <RPagination
            addField={addField}
            deleteField={deleteField}
            query={query}
            total={salesData?.data?.meta?.total}
          />
        </div>
      </div>
    </div>
  );
};

export default AllSales;
