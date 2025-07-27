"use client";

import MedicineEntryHeader from "@/components/medicineEntry/MedicineEntryHeader";
import MedicineEntryTable from "@/components/medicineEntry/MedicineEntryTable";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetMedicinesQuery } from "@/redux/api/medicines/medicine.api";

const MedicineListPage = () => {
  const { addField, deleteField, query } = useQueryBuilder();

  const { data: medicines, isLoading } = useGetMedicinesQuery(query);

  return (
    <div className="p-4">
      <MedicineEntryHeader addField={addField} />
      <div className="my-4">
        <MedicineEntryTable
          data={medicines?.data?.result}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MedicineListPage;
