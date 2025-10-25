"use client";
import Loading from "@/components/layout/Loading";
import MedicineView from "@/components/medicineEntry/MedicineVIew";
import {
  useGetSingleMedicineQuery,
  useLazyGetSingleMedicineQuery,
} from "@/redux/api/medicines/medicine.api";
import { useParams } from "next/navigation";
import React from "react";

const MedicineViewPage = () => {
  const params = useParams();
  const {
    data: medicineData,
    isLoading: singleMedicineLoading,
    isFetching: singleMedicineFetching,
  } = useGetSingleMedicineQuery(params?.id as string, { skip: !params?.id });

  console.log(medicineData);

  return (
    <>
      <div className="relative min-h-[90vh]">
        <Loading
          loading={singleMedicineFetching || singleMedicineLoading}
          size="md"
        />
        <MedicineView medicine={medicineData?.data} />
      </div>
    </>
  );
};

export default MedicineViewPage;
