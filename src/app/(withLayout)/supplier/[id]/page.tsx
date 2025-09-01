"use client";
import Loading from "@/components/layout/Loading";
import SupplierProfile from "@/components/suppliers/ViewSupplierInfo";
import { useGetSingleSupplierQuery } from "@/redux/api/suppliers/supplier.api";
import { useParams } from "next/navigation";

export default function SupplierInfo() {
  const { id } = useParams();

  const {
    data: supplierData,
    isLoading: supplierDataloading,
    isFetching: supplierDatafetching,
  } = useGetSingleSupplierQuery(id as string, { skip: !id });

  return (
    <div className="relative">
      <Loading
        loading={supplierDatafetching || supplierDataloading}
        size="md"
      />
      <SupplierProfile data={supplierData?.data} />
    </div>
  );
}
