"use client";
import MedicineCategoryTable from "@/components/medicine-purchese/MedicinePurcheseTable";
import MedicineHeader from "@/components/medicine-purchese/MedicinePurcheseHeader";
import RPagination from "@/components/RPagination";
import useQueryBuilder from "@/helpers/QueryBUilder";
import React from "react";

const MedicineCategory = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  return (
    <div>
      <div className="my-2">
        <MedicineHeader />
      </div>
      <div>
        <MedicineCategoryTable />
      </div>
      <div>
        <RPagination
          addField={addField}
          deleteField={deleteField}
          query={query}
          total={100}
        />
      </div>
    </div>
  );
};

export default MedicineCategory;
