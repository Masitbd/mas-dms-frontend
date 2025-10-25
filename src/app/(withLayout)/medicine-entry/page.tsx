"use client";

import MedicineEntryHeader from "@/components/medicineEntry/MedicineEntryHeader";
import MedicineEntryTable from "@/components/medicineEntry/MedicineEntryTable";
import RPagination from "@/components/RPagination";
import useQueryBuilder from "@/helpers/QueryBUilder";

import { useGetMedicinesQuery } from "@/redux/api/medicines/medicine.api";

const MedicineListPage = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: medicines,
    isLoading,
    isFetching,
  } = useGetMedicinesQuery(query);

  return (
    <div className="p-4">
      <MedicineEntryHeader addField={addField} />
      <div className="my-4">
        <MedicineEntryTable
          data={medicines?.data}
          isLoading={isLoading || isFetching}
        />
      </div>
      <div>
        <RPagination
          addField={addField}
          deleteField={deleteField}
          query={query}
          total={medicines?.data?.meta?.total}
        />
      </div>
    </div>
  );
};

export default MedicineListPage;
