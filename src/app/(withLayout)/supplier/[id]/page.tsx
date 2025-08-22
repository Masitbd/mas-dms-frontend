"use client";
import Loading from "@/components/layout/Loading";
import SupplierProfile from "@/components/suppliers/ViewSupplierInfo";
import { useGetSingleSupplierQuery } from "@/redux/api/suppliers/supplier.api";
import { useParams } from "next/navigation";

export default function SupplierInfo() {
  const { id } = useParams();
  const supplier = {
    _id: { $oid: "688678434d88e1f4f322b5ba" },
    supplierId: "00001",
    name: "Test  ",
    contactPerson: "12",
    address: "11",
    phone: "4422",
    fax: "4665",
    city: "22",
    country: "222",
    email: "test@gmail.com",
    createdAt: { $date: "2025-07-27T19:04:35.629Z" },
    updatedAt: { $date: "2025-07-27T19:04:35.629Z" },
  };

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
