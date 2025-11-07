"use client";
import RPagination from "@/components/RPagination";
import SupplierHeader from "@/components/suppliers/SupplierHeader";
import SupplierTable from "@/components/suppliers/SupplierTable";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetSuppliersQuery } from "@/redux/api/suppliers/supplier.api";
import React from "react";

const Suppliers = () => {
  const { addField, deleteField, query } = useQueryBuilder();

  const { data: suppliers, isLoading } = useGetSuppliersQuery(query);

  return (
    <div className="p-4">
      <SupplierHeader addField={addField} />
      <div className="my-4">
        <SupplierTable data={suppliers?.data} isLoading={isLoading} />
      </div>
      <div>
        <RPagination
          addField={addField}
          deleteField={deleteField}
          query={query}
          total={suppliers?.meta?.total}
        />
      </div>
    </div>
  );
};

export default Suppliers;
