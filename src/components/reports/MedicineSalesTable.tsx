/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import ReporetHeader from "@/utils/ReporetHeader";

type TMedicineSaleData = {
  totalBill: number;

  totalDiscount: number;
  name: string;
  invoice_no: string;
  metPayable: number;
  due: number;
  paid: number;
  netPayable: number;
  bed: string;
};

type TDailySalesSummery = {
  data: {
    totalBill: number;
    totalDiscount: number;
    totalNetPayable: number;
    totalPaid: number;
    totalDue: number;
    records: TMedicineSaleData[];
  };
  startDate: Date | null;
  endDate: Date | null;
};

const MedicineSalesTable: React.FC<TDailySalesSummery> = ({
  data,
  startDate,
  endDate,
}) => {
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

        {
          text: `Medicine Sales Reports Summery: ${
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

            widths: ["*", "*", "*", "*", "*", "*", "*", "*"], // Adjust column widths as needed
            body: [
              // Define the header row
              [
                { text: "Bill No", bold: true, alignment: "center" },

                { text: "Bayer Name", bold: true, alignment: "center" },
                { text: "Bed/Cabin", bold: true, alignment: "center" },
                { text: "Total Bill", bold: true, alignment: "center" },
                { text: "Discount", bold: true, alignment: "center" },

                { text: "Net Payable", bold: true, alignment: "center" },
                { text: "Total Paid", bold: true, alignment: "center" },
                { text: "Total Due", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.records?.map((paymentGroup) =>
                [
                  paymentGroup?.invoice_no || "N/A",

                  paymentGroup?.name || "N/A",
                  paymentGroup?.bed || 0,
                  paymentGroup?.totalBill || 0,

                  paymentGroup?.totalDiscount?.toFixed(2) || "0.00",
                  paymentGroup?.metPayable?.toFixed(2) || "0.00",
                  paymentGroup?.paid || 0,
                  paymentGroup?.due || 0,
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
          // Use predefined border styles
        },

        // Total Summary
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                { text: "Total Amount", bold: true, alignment: "center" }, // col 1
                { text: " ", alignment: "center" }, // col 2
                { text: " ", alignment: "center" }, // col 2
                {
                  text: data?.totalBill?.toFixed(2) || "0.00",
                  alignment: "center",
                  bold: true,
                }, // col 3
                {
                  text: data?.totalDiscount?.toFixed(2) || "0.00",
                  alignment: "center",
                  bold: true,
                }, // col 4
                {
                  text: data?.totalNetPayable?.toFixed(2) || "0.00",
                  alignment: "center",
                  bold: true,
                }, // col 5
                {
                  text: data?.totalPaid?.toFixed(2) || "0.00",
                  alignment: "center",
                  bold: true,
                }, // col 6
                {
                  text: data?.totalDue?.toFixed(2) || "0.00",
                  alignment: "center",
                  bold: true,
                }, // col 7
              ],
            ],
          },
          margin: [0, 10, 0, 0],
        },
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
        <div className="grid grid-cols-8 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Bayer Name</div>
          <div>Bed/Cabin</div>
          <div>Total Bill</div>
          <div>Discount</div>

          <div>Net Payable</div>
          <div>Paid</div>
          <div>Due</div>
        </div>

        {/* Payment Types */}
        {data?.records?.length > 0 ? (
          data?.records?.map((paymentGroup, paymentIndex) => (
            <div
              key={paymentIndex}
              className="grid grid-cols-8 text-center p-2 border-b"
            >
              <div className="text-green-600 font-semibold">
                {paymentGroup?.invoice_no}
              </div>

              <div className="text-green-600 font-semibold">
                {paymentGroup?.name}
              </div>

              <div>{paymentGroup.bed || ""}</div>

              <div>{paymentGroup.totalBill || 0}</div>

              <div>{paymentGroup.totalDiscount?.toFixed(2) || 0}</div>
              <div>{paymentGroup.netPayable?.toFixed(2) || 0}</div>
              <div>{paymentGroup.paid || 0}</div>
              <div>{paymentGroup.due || 0}</div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}

        <div className="grid grid-cols-8 border-b font-bold text-center">
          <div className="col-span-3">Total Sales Amount</div>

          <div>{data?.totalBill ?? 0}</div>
          <div>{data?.totalDiscount}</div>
          <div>{data?.totalNetPayable}</div>
          <div>{data?.totalPaid}</div>
          <div>{data?.totalDue}</div>
        </div>
      </div>
    </div>
  );
};

export default MedicineSalesTable;
