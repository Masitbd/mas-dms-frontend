"use client";

import MedicineSalesTable from "@/components/medicineSales/Sales";
import { useGetMedicinesSalesQuery } from "@/redux/api/medicines/sales.api";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, Input, InputGroup } from "rsuite";
import { useDebouncedCallback } from "use-debounce";
const MedicineSales = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey: number) => {
    setPage(1);
    setLimit(dataKey);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleDebounce = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 500);

  const queryParams: Record<string, any> = {};
  if (searchTerm) queryParams.searchTerm = searchTerm;

  const { data: salesData, isLoading } = useGetMedicinesSalesQuery(queryParams);

  return (
    <div>
      <div className="flex justify-between items-center bg-white shadow-xl h-20 w-full px-5 rounded-xl">
        <h1 className="text-2xl font-bold">Medicine Sales</h1>

        <InputGroup style={{ width: 500, marginBottom: 10 }}>
          <Input
            onChange={(value: string) => {
              handleDebounce(value);
            }}
            placeholder="Search by name, contact no, invoice no"
          />
          <InputGroup.Button>
            <SearchIcon />
          </InputGroup.Button>
        </InputGroup>

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
          total={salesData?.data?.meta?.total}
          limit={limit}
          page={page}
          setPage={setPage}
          handleChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
};

export default MedicineSales;
