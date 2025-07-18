"use client";
import SupplierHeader from "@/components/suppliers/SupplierHeader";
import SupplierTable from "@/components/suppliers/SupplierTable";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetSuppliersQuery } from "@/redux/api/suppliers/supplier.api";
import React from "react";

const Suppliers = () => {
  const { addField, deleteField, query } = useQueryBuilder();

  const { data: suppliers, isLoading } = useGetSuppliersQuery(undefined);

  console.log(suppliers, " suppliers data");

  return (
    <div className="p-4">
      <SupplierHeader addField={addField} />
      <div className="my-4">
        <SupplierTable data={suppliers?.data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Suppliers;
