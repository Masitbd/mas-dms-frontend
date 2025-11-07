"use client";

import MedicineEntryHeader from "@/components/medicineEntry/MedicineEntryHeader";
import MedicineEntryTable from "@/components/medicineEntry/MedicineEntryTable";
import RPagination from "@/components/RPagination";
import useQueryBuilder from "@/helpers/QueryBUilder";

import { useGetMedicinesQuery } from "@/redux/api/medicines/medicine.api";

const MedicineListPage = ({
  btn1Visibility,
  btn2Visibility,
  link1,
  link2,
  link4,
  btn3Text,
}: {
  link1?: string;
  link2?: string;
  link3?: string;
  link4?: string;
  btn1Visibility?: boolean;
  btn2Visibility?: boolean;
  btn3Text?: string;
}) => {
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: medicines,
    isLoading,
    isFetching,
  } = useGetMedicinesQuery(query);

  return (
    <div className="p-4">
      <MedicineEntryHeader
        addField={addField}
        link4={link4}
        btn3Text={btn3Text as string}
      />
      <div className="my-4">
        <MedicineEntryTable
          data={medicines?.data}
          isLoading={isLoading || isFetching}
          link1={link1}
          link2={link2}
          btn1Visibility={btn1Visibility}
          btn2Visibility={btn2Visibility}
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
