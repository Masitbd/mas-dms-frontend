/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import ReporetHeader from "@/utils/ReporetHeader";

export type TBranch = {
  _id: string;
  name: string;
  address1: string;
  phone: string;
  vatNo: string;
};

type TDailyCollection = {
  _id: string;
  totalBill: number;

  totalDiscount: number;

  netPayable: number;
  totalDue: number;
  totalPaid: number;
  invoice_no: string;
  createdAt: string;
  paid: number;
};

type TPaymentModeSummary = {
  _id: string; // e.g., "cash", "bank"
  total: number;
}[];

type TTotal = {
  _id: null | string;
  grandTotalGuest: number;
  grandTotalPaid: number;
  grandTotalVat: number;
  grandTotalBill: number;
  grandTotalDiscount: number;
  grandTotalScharge: number;
  grandTotalPayable: number;
  grandTotalDue: number;
};

type TDailySalesSummery = {
  data: {
    grandTotal: number;
    records: TDailyCollection[];
  };
  startDate: Date | null;
  endDate: Date | null;
};

const DueCollectionStatementTable: React.FC<TDailySalesSummery> = ({
  data,
  startDate,
  endDate,
}) => {
  console.log(data, "in table due state");
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

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
          text: `Due Collection Statement: ${
            formattedStartDate === formattedEndDate
              ? formattedStartDate
              : `from ${formattedStartDate} to ${formattedEndDate}`
          }`,
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
                { text: "Invoice No", bold: true, alignment: "center" },

                { text: "Date", bold: true, alignment: "center" },

                { text: "Total Bill", bold: true, alignment: "center" },

                { text: "Net Payable", bold: true, alignment: "center" },
                { text: "Total Paid", bold: true, alignment: "center" },
                { text: "Total Due", bold: true, alignment: "center" },
                { text: "Paid", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.records?.map((paymentGroup) =>
                [
                  paymentGroup?.invoice_no || "N/A",

                  paymentGroup?.createdAt?.slice(0, 10) || "N/A",

                  paymentGroup?.totalBill || 0,

                  paymentGroup?.netPayable?.toFixed(2) || "0.00",
                  paymentGroup?.totalPaid || 0,
                  paymentGroup?.totalDue || 0,
                  paymentGroup?.paid || 0,
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
          // Use predefined border styles
        },

        // Total Summary
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                { text: "Total Sales Amount", bold: true, alignment: "center" },
                { text: "", bold: true, alignment: "center" },
                { text: "", bold: true, alignment: "center" },
                { text: "", bold: true, alignment: "center" },
                { text: "", bold: true, alignment: "center" },
                { text: "", bold: true, alignment: "center" },
                { text: data?.grandTotal, bold: true, alignment: "center" },
              ].map((text) => ({ text, alignment: "center" })),
            ],
          },
          margin: [0, 10, 0, 0],
        },

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
    <div className="p-5">
      <ReporetHeader
        data={data}
        name="Sales Report Summery"
        startDate={startDate}
        endDate={endDate}
      />
      <div className="flex justify-end">
        <button
          onClick={generatePDF}
          className="bg-blue-600 w-28 px-3 py-2 rounded-md text-white font-semibold my-4 "
        >
          Print
        </button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-7 bg-gray-100 font-semibold text-center p-2">
          <div>Invoice</div>
          <div>Bill Date</div>

          <div>Total Bill</div>

          <div>Net Payable</div>
          <div>Total Paid</div>

          <div>Due</div>
          <div>Paid</div>
        </div>

        {data?.records?.length > 0 ? (
          data?.records?.map((paymentGroup, paymentIndex) => (
            <div
              key={paymentIndex}
              className="grid grid-cols-7 text-center p-2 border-b"
            >
              <div className="text-green-600 font-semibold">
                {paymentGroup?.invoice_no}
              </div>
              <div className=" font-semibold">
                {paymentGroup?.createdAt?.slice(0, 10)}
              </div>

              <div>{paymentGroup?.totalBill || 0}</div>

              <div>{paymentGroup?.netPayable?.toFixed(2) || 0}</div>
              <div>{paymentGroup?.totalPaid || 0}</div>
              <div>{paymentGroup?.totalDue || 0}</div>
              <div>{paymentGroup?.paid || 0}</div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}

        <div className="grid grid-cols-7 border-b font-bold ">
          <div className="col-span-6">Total Amount</div>

          <div className="text-center">{data?.grandTotal}</div>
        </div>
      </div>
    </div>
  );
};

export default DueCollectionStatementTable;
