/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import ReporetHeader from "@/utils/ReporetHeader";

type TDailyCollection = {
  _id: string;
  name: string;
  qty: number;
  salesRate: number;
  discount: number;
  purchaseRate: number;
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
  data: TDailyCollection[];

  startDate: Date | null;
  endDate: Date | null;
};

const MedecineProfitLossTable: React.FC<TDailySalesSummery> = ({
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
          text: `Medicine Profit Loss Statement: ${
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
                { text: "Particulars", bold: true, alignment: "center" },

                { text: "Qty", bold: true, alignment: "center" },

                { text: "S.Rate", bold: true, alignment: "center" },

                { text: "Total Amount", bold: true, alignment: "center" },
                { text: "P.Rate", bold: true, alignment: "center" },
                { text: "Discount", bold: true, alignment: "center" },
                { text: "Net Amount", bold: true, alignment: "center" },
                { text: "T. PRate", bold: true, alignment: "center" },
                { text: "Net Profit", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.map((item) =>
                [
                  item?.name || "N/A",

                  item?.qty,

                  item?.salesRate || 0,

                  item?.salesRate * Number(item?.qty),
                  item?.purchaseRate || 0,
                  item?.discount || 0,
                  item?.salesRate * item?.qty - item?.discount,
                  item?.purchaseRate * item?.qty,
                  item?.purchaseRate * item?.qty - item?.salesRate * item?.qty,
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
        },

        // Total Summary

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
        name="Medicine Profit Loss Statement"
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
        <div className="grid grid-cols-9 bg-gray-400 font-semibold text-center p-2">
          <div>Particulars</div>
          <div>Qty</div>

          <div>S.Rate</div>

          <div>T. Amount</div>
          <div>P.Rate</div>

          <div>Discount</div>
          <div>Net Amount</div>
          <div>T.PRate</div>
          <div>Net Profit</div>
        </div>

        {data?.length > 0 ? (
          data?.map((item, paymentIndex) => (
            <div
              key={paymentIndex}
              className={`grid grid-cols-9 text-center p-2 border-b ${
                paymentIndex % 2 !== 0 && "bg-slate-200"
              } `}
            >
              <div className=" font-semibold">{item?.name}</div>
              <div className=" font-semibold">{item?.qty}</div>

              <div>{item?.salesRate}</div>

              <div>{item?.salesRate * Number(item?.qty)}</div>
              <div>{item?.purchaseRate}</div>
              <div>{item?.discount}</div>
              <div>{item?.salesRate * item?.qty - item?.discount}</div>
              <div>{item?.purchaseRate * item?.qty}</div>
              <div>
                {item?.salesRate * item?.qty - item?.purchaseRate * item?.qty}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}
      </div>
    </div>
  );
};

export default MedecineProfitLossTable;
