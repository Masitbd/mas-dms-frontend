"use client";
import SupplierHeader from "@/components/suppliers/SupplierHeader";
import useQueryBuilder from "@/helpers/QueryBUilder";
import React from "react";

const Suppliers = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  return (
    <div>
      <SupplierHeader addField={addField} />
    </div>
  );
};

export default Suppliers;
