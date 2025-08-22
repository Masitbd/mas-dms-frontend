"use client";
import MedicineCategoryTable from "@/components/medicine-purchese/MedicinePurcheseTable";
import MedicineHeader from "@/components/medicine-purchese/MedicinePurcheseHeader";
import useQueryBuilder from "@/helpers/QueryBUilder";
import React from "react";

const MedicineCategory = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  return (
    <div>
      <div className="my-2">
        <MedicineHeader
          addField={addField}
          query={query}
          deleteField={deleteField}
        />
      </div>
      <div>
        <MedicineCategoryTable
          query={query}
          addField={addField}
          deleteField={deleteField}
        />
      </div>
    </div>
  );
};

export default MedicineCategory;
