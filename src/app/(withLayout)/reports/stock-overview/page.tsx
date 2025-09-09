"use client";

import RPagination from "@/components/RPagination";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetMedicineStockOverviewQuery } from "@/redux/api/reports.api";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";

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

  //

  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
        // Title
        // {
        //   text: `${data?.branchInfo?.name}`,
        //   style: "header",
        //   alignment: "center",
        //   margin: [0, 0, 0, 10],
        // },

        // {
        //   text: `${data?.branchInfo?.address1}`,

        //   alignment: "center",
        //   margin: [0, 0, 0, 4],
        // },
        // {
        //   text: `Phone: ${data?.branchInfo?.phone}`,

        //   alignment: "center",
        //   margin: [0, 0, 0, 4],
        // },
        // {
        //   text: `VAT Registration No: ${data?.branchInfo?.vatNo}`,
        //   style: "subheader",
        //   alignment: "center",
        //   margin: [0, 0, 0, 8],
        // },

        {
          text: "Medicine Stock Overview",
          style: "subheader",
          alignment: "center",
          color: "red",
          italic: true,
          margin: [10, 0, 0, 20],
        },

        // Table Header
        {
          table: {
            headerRows: 1, // Specify the number of header rows

            widths: ["*", "*", "*", "*", "*", "*", "*"], // Adjust column widths as needed
            body: [
              // Define the header row
              [
                { text: "M.Category", bold: true, alignment: "center" },
                { text: "M.Name", bold: true, alignment: "center" },
                { text: "Stock Qty", bold: true, alignment: "center" },
                { text: "P.qty", bold: true, alignment: "center" },
                { text: "Total P.Value", bold: true, alignment: "center" },
                { text: "Uni price", bold: true, alignment: "center" },
                { text: "Total S.Value", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...medicineStocks?.data?.records?.map(
                (paymentGroup: TMedicineStock) =>
                  [
                    paymentGroup?.medicineCategory || "N/A",

                    paymentGroup?.medicineName || "N/A",
                    paymentGroup?.currentQty || 0,
                    paymentGroup?.qtyIn || 0,
                    paymentGroup?.qtyIn * paymentGroup?.purchaseRate,
                    paymentGroup?.salesRate ?? 0,
                    paymentGroup?.salesRate * paymentGroup?.qtyIn,
                  ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
          // Use predefined border styles
        },

        // Total Summary
        // {
        //   table: {
        //     widths: ["*", "*", "*", "*", "*", "*", "*", "*"], // 8 columns
        //     body: [
        //       [
        //         { text: "Total Amount", bold: true, alignment: "center" }, // col 1
        //         { text: " ", alignment: "center" }, // col 2
        //         {
        //           text: data?.totalBill?.toFixed(2) || "0.00",
        //           alignment: "center",
        //           bold: true,
        //         }, // col 3
        //         {
        //           text: data?.totalDiscount?.toFixed(2) || "0.00",
        //           alignment: "center",
        //           bold: true,
        //         }, // col 4
        //         {
        //           text: data?.totalNetPayable?.toFixed(2) || "0.00",
        //           alignment: "center",
        //           bold: true,
        //         }, // col 5
        //         {
        //           text: data?.totalPaid?.toFixed(2) || "0.00",
        //           alignment: "center",
        //           bold: true,
        //         }, // col 6
        //         {
        //           text: data?.totalDue?.toFixed(2) || "0.00",
        //           alignment: "center",
        //           bold: true,
        //         }, // col 7
        //         { text: " ", alignment: "center", bold: true }, // col 8
        //       ],
        //     ],
        //   },
        //   margin: [0, 10, 0, 0],
        // },

        // Payment Mode Summary
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          italics: true,
        },
        tableHeader: {
          bold: true,
          fillColor: "#eeeeee",
          alignment: "center",
        },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={generatePDF}
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
