"use client";

import MedicineEntryHeader from "@/components/medicineEntry/MedicineEntryHeader";
import MedicineEntryTable from "@/components/medicineEntry/MedicineEntryTable";

import { useGetMedicinesQuery } from "@/redux/api/medicines/medicine.api";

const MedicineListPage = () => {
  const { data: medicines, isLoading } = useGetMedicinesQuery(undefined);

  return (
    <div className="p-4">
      <MedicineEntryHeader />
      <div className="my-4">
        <MedicineEntryTable data={medicines?.data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MedicineListPage;
