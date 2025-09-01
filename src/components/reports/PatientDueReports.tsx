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

type TDailyStatementSummary = {
  _id: string;
  invoice_no: string;
  bed: string;
  netPayable: number;
  totalDiscount: number;
  totalBill: number;
  paid: number;
  due: number;
  posted_by: string;
};

type TDailySalesSummery = {
  data: {
    records: TDailyStatementSummary[];
    totalBill: number;
    totalDiscount: number;
    totalNetPayable: number;
    totalPaid: number;
    totalDue: number;
  };
  startDate: Date | null;
  endDate: Date | null;
};

const PatientDueReportsTable: React.FC<TDailySalesSummery> = ({
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
        // {
        //   text: `VAT Registration No: ${data?.branchInfo?.vatNo}`,
        //   style: "subheader",
        //   alignment: "center",
        //   margin: [0, 0, 0, 8],
        // },

        {
          text: `Patient Due Statement: ${
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
                { text: "Bil No", bold: true, alignment: "center" },
                { text: "Bed No", bold: true, alignment: "center" },
                { text: "Total Bill", bold: true, alignment: "center" },
                { text: "Total dis", bold: true, alignment: "center" },
                { text: "Net Payable", bold: true, alignment: "center" },
                { text: "Paid", bold: true, alignment: "center" },
                { text: "Total Due", bold: true, alignment: "center" },
                { text: "Posted By", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.records?.map((paymentGroup) =>
                [
                  paymentGroup?.invoice_no || "N/A",

                  paymentGroup?.bed || "N/A",
                  paymentGroup?.totalBill?.toFixed(2) || 0,
                  paymentGroup?.totalDiscount?.toFixed(2) || 0,
                  paymentGroup?.netPayable?.toFixed(2) || 0,
                  paymentGroup?.paid?.toFixed(2) || "0.00",
                  paymentGroup?.due?.toFixed(2) || 0,
                  paymentGroup?.posted_by || "",
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
          // Use predefined border styles
        },

        // Total Summary
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*", "*", "*"], // 8 columns
            body: [
              [
                { text: "Total Amount", bold: true, alignment: "center" }, // col 1
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
                { text: " ", alignment: "center", bold: true }, // col 8
              ],
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
        <div className="grid grid-cols-9 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Bed No</div>

          <div>Bill Amount </div>

          <div>Discount</div>
          <div>Net Payable</div>
          <div>Paid</div>

          <div>Due</div>
          <div>Billing By</div>
        </div>

        {/* Payment Types */}
        {data?.records?.length > 0 ? (
          data?.records?.map((paymentGroup, paymentIndex) => (
            <div
              key={paymentIndex}
              className="grid grid-cols-9 text-center p-2 border-b"
            >
              <div>{paymentGroup.invoice_no || ""}</div>

              <div>{paymentGroup.bed || ""}</div>
              <div>{paymentGroup.totalBill?.toFixed(2)}</div>
              <div>{paymentGroup.totalDiscount?.toFixed(2)}</div>

              <div>{paymentGroup.netPayable?.toFixed(2)}</div>
              <div>{paymentGroup.paid?.toFixed(2) || 0}</div>
              <div>{paymentGroup?.due || 0}</div>
              <div>{paymentGroup?.posted_by || ""}</div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}

        <div className="grid grid-cols-8 border-b font-bold  ">
          <div>Total Amount</div>
          <div></div>
          <div>{data?.totalBill?.toFixed(2)}</div>
          <div>{data?.totalDiscount?.toFixed(2)}</div>
          <div>{data?.totalNetPayable?.toFixed(2)}</div>
          <div>{data?.totalPaid?.toFixed(2)}</div>
          <div>{data?.totalDue?.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientDueReportsTable;
