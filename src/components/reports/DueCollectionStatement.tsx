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
  _id: {
    date: string; // ISO date format
  };
  totalBill: number;
  totalVat: number;
  totalGuest: number;
  totalDiscount: number;
  tSChargse: number;
  metPayable: number;
  totalDue: number;
  totalPaid: number;
  branchName: string;
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

type TGroup = {
  dateWiseSummary: TDailyStatementSummary[];
  total: TTotal;
  paymentModeSummary: TPaymentModeSummary;
};

type TDailySalesSummery = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  startDate: Date | null;
  endDate: Date | null;
};

const DueCollectionStatementTable: React.FC<TDailySalesSummery> = ({
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
        {
          text: `${data?.branchInfo?.name}`,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },

        {
          text: `${data?.branchInfo?.address1}`,

          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: `Phone: ${data?.branchInfo?.phone}`,

          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: `VAT Registration No: ${data?.branchInfo?.vatNo}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 8],
        },

        {
          text: `Sales Reports Summery: ${
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

            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*"], // Adjust column widths as needed
            body: [
              // Define the header row
              [
                { text: "Branch", bold: true, alignment: "center" },

                { text: "Date", bold: true, alignment: "center" },
                { text: "Total Guests", bold: true, alignment: "center" },
                { text: "Total Bill", bold: true, alignment: "center" },
                { text: "Total VAT", bold: true, alignment: "center" },
                { text: "Service Charges", bold: true, alignment: "center" },
                { text: "Net Payable", bold: true, alignment: "center" },
                { text: "Total Due", bold: true, alignment: "center" },
                { text: "Total Paid", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.result?.[0]?.dateWiseSummary?.map((paymentGroup) =>
                [
                  paymentGroup?.branchName || "N/A",

                  paymentGroup?._id?.date || "N/A",
                  paymentGroup?.totalGuest || 0,
                  paymentGroup?.totalBill || 0,
                  paymentGroup?.totalVat?.toFixed(2) || "0.00",
                  paymentGroup?.tSChargse || 0,
                  paymentGroup?.metPayable?.toFixed(2) || "0.00",
                  paymentGroup?.totalDue || 0,
                  paymentGroup?.totalPaid || 0,
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
          // Use predefined border styles
        },

        // Total Summary
        {
          table: {
            widths: [80, "*", 60, 60, 60, 60, 60, 60],
            body: [
              [
                { text: "Total Sales Amount", bold: true, alignment: "center" },
                data?.result?.[0]?.total?.grandTotalGuest,
                data?.result?.[0]?.total?.grandTotalBill,
                data?.result?.[0]?.total?.grandTotalVat?.toFixed(2),
                data?.result?.[0]?.total?.grandTotalScharge?.toFixed(2),
                data?.result?.[0]?.total?.grandTotalPayable,
                data?.result?.[0]?.total?.grandTotalDue,
                data?.result?.[0]?.total?.grandTotalPaid,
              ].map((text) => ({ text, alignment: "center" })),
            ],
          },
          margin: [0, 10, 0, 0],
        },

        // Payment Mode Summary
        {
          text: "Payment Mode Summary",
          style: "subheader",
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            widths: ["*", 60],
            body: data?.result?.[0]?.paymentModeSummary?.map((item) => [
              { text: item._id, alignment: "center" },
              { text: item.total, alignment: "center" },
            ]),
          },
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
        <div className="grid grid-cols-9 bg-gray-100 font-semibold text-center p-2">
          <div>Branch</div>
          <div>Bill Date</div>

          <div>Guest </div>

          <div>Total Bill</div>
          <div>Total Vat</div>
          <div>T S Charge</div>

          <div>Net Payable</div>
          <div>Due</div>
          <div>Paid</div>
        </div>

        {/* Payment Types */}
        {data?.result?.[0]?.dateWiseSummary?.length > 0 ? (
          data?.result?.[0]?.dateWiseSummary?.map(
            (paymentGroup, paymentIndex) => (
              <div
                key={paymentIndex}
                className="grid grid-cols-9 text-center p-2 border-b"
              >
                <div className="text-green-600 font-semibold">
                  {paymentGroup?.branchName}
                </div>
                <div className=" font-semibold">{paymentGroup._id.date}</div>

                <div className="text-green-600 font-semibold">
                  {paymentGroup._id.date}
                </div>

                <div>{paymentGroup.totalGuest || 0}</div>

                <div>{paymentGroup.totalBill || 0}</div>
                <div>{paymentGroup.totalVat?.toFixed(2)}</div>

                <div>{paymentGroup.tSChargse || 0}</div>

                <div>{paymentGroup.metPayable?.toFixed(2) || 0}</div>
                <div>{paymentGroup.totalDue || 0}</div>
                <div>{paymentGroup.totalPaid || 0}</div>
              </div>
            )
          )
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}

        <div className="grid grid-cols-8 border-b font-bold text-center">
          <div>Total Sales Amount</div>
          <div>{data?.result?.[0]?.total?.grandTotalGuest}</div>
          <div>{data?.result?.[0]?.total?.grandTotalBill}</div>
          <div>{data?.result?.[0]?.total?.grandTotalVat?.toFixed(2)}</div>
          <div>{data?.result?.[0]?.total?.grandTotalScharge?.toFixed(2)}</div>
          <div>{data?.result?.[0]?.total?.grandTotalPayable}</div>
          <div>{data?.result?.[0]?.total?.grandTotalDue}</div>
          <div>{data?.result?.[0]?.total?.grandTotalPaid}</div>
        </div>
      </div>

      <div className="mt-10 w-full max-w-3xl mx-auto border">
        <h1 className="text-lg font-bold p-2  border bg-gray-200 text-red-700">
          Payment Mode
        </h1>
        {data?.result?.[0]?.paymentModeSummary?.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 text-center p-2 border-b"
          >
            <div>{item._id}</div>
            <div>{item.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DueCollectionStatementTable;
