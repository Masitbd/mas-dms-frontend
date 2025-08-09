"use client";

import MedicineSalesTable from "@/components/medicineSales/Sales";
import { useGetMedicinesSalesQuery } from "@/redux/api/medicines/sales.api";
import Link from "next/link";
import { useState } from "react";
import { Button } from "rsuite";

const MedicineSales = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const queryParams: Record<string, any> = {};
  if (searchTerm) queryParams.searchTerm = searchTerm;

  const { data: salesData, isLoading } = useGetMedicinesSalesQuery(queryParams);


  return (
    <div>
      <div className="flex justify-between items-center bg-white h-20 w-full px-5 rounded-xl">
        <h1 className="text-2xl font-bold">Medicine Sales</h1>

        <Link href="/medicine-sale/create">
          <Button appearance="primary" color="blue" size="lg">
            Create Sales
          </Button>
        </Link>
      </div>
      <div className="mt-10">
        <MedicineSalesTable
          data={salesData?.data?.result}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MedicineSales;
