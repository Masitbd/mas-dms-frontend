"use client";

import RPagination from "@/components/RPagination";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetMedicineStockOverviewQuery } from "@/redux/api/reports.api";

type TMedicineStock = {
  _id: string;
  medicineName: string;
  medicineCategory: string;
  currentQty: number;
  qtyIn: number;
  purchaseRate: number;
  salesRate: number;
};

const MedicineStockOverViewPage = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  const queryParams: Record<string, any> = {};

  const { data: medicineStocks, isLoading } =
    useGetMedicineStockOverviewQuery(queryParams);
  return (
    <div>
      <div className="flex justify-end">
        <button
          //   onClick={generatePDF}
          className="bg-blue-600 w-28 px-3 py-2 rounded-md text-white font-semibold my-4 "
        >
          Print
        </button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-7 bg-gray-400 font-semibold text-center p-2">
          <div>M. Category</div>
          <div>M.Name</div>

          <div>Stock Qty</div>

          <div>Purchase Qty</div>
          <div>Total P. Value</div>

          <div>Unit Price</div>
          <div>Total S. Value</div>
        </div>

        {medicineStocks?.data?.records?.length > 0 ? (
          medicineStocks?.data?.records?.map(
            (paymentGroup: TMedicineStock, paymentIndex: number) => (
              <div
                key={paymentIndex}
                className="grid grid-cols-7 text-center p-2 border-b"
              >
                <div className=" font-semibold">
                  {paymentGroup?.medicineCategory}
                </div>
                <div className="font-semibold">
                  {paymentGroup?.medicineName}
                </div>

                <div>{paymentGroup?.currentQty}</div>

                <div>{paymentGroup?.qtyIn}</div>
                <div>{paymentGroup?.qtyIn * paymentGroup?.purchaseRate}</div>
                <div>{paymentGroup?.salesRate || 0}</div>
                <div>{paymentGroup?.salesRate * paymentGroup?.qtyIn}</div>
              </div>
            )
          )
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}
        <RPagination
          total={medicineStocks?.data?.meta?.totalDocs}
          addField={addField}
          query={queryParams}
          deleteField={deleteField}
        />
      </div>
    </div>
  );
};

export default MedicineStockOverViewPage;
