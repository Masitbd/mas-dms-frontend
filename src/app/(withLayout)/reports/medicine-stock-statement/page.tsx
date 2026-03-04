"use client";

import MedicineStockStatement from "@/components/reports/MedicineStockStatement";
import { useGetMedicineStockStatementReportsQuery } from "@/redux/api/reports.api";
import { Loader } from "rsuite";

const MedicineStockStatementPage = () => {
  const { data, isLoading, isFetching } =
    useGetMedicineStockStatementReportsQuery({});

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-[360px] mx-auto rounded-xl">
        Medicine Stock Statement
      </h2>

      <div className="px-2 my-5">
        {(isLoading || isFetching) && (
          <div className="flex justify-center mt-8">
            <Loader size="md" content="Loading report..." />
          </div>
        )}

        {!isLoading && !isFetching && data?.data && (
          <MedicineStockStatement data={data.data as any} />
        )}
      </div>
    </div>
  );
};

export default MedicineStockStatementPage;
