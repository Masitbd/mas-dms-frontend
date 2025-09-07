"use client";

import MedicineEntryHeader from "@/components/medicineEntry/MedicineEntryHeader";
import MedicineEntryTable from "@/components/medicineEntry/MedicineEntryTable";
import useQueryBuilder from "@/helpers/QueryBUilder";

import {
  useGetMedicinesQuery,
  useGetMedicinesWithStockQuery,
} from "@/redux/api/medicines/medicine.api";

const MedicineListPage = () => {
  const { addField, deleteField, query } = useQueryBuilder();

  const { data: medicines, isLoading } = useGetMedicinesWithStockQuery(query);

  return (
    <div className="p-4">
      <MedicineEntryHeader addField={addField} />
      <div className="my-4">
        <MedicineEntryTable data={medicines?.data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MedicineListPage;
