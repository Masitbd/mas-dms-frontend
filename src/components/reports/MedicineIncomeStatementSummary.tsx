/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import ReporetHeader from "@/utils/ReporetHeader";

type TBranchInfo = {
  name?: string;
  address1?: string;
  phone?: string;
  vatNo?: string;
};

type TIncomeStatementRow = {
  indoor?: number;
  outdoor?: number;
  totalDiscount?: number;
  indoorReturn?: number;
  outdoorReturn?: number;
  dueCollection?: number;
  totalAdvance?: number;
  netCollection?: number;
  totalDue?: number;
};

type TIncomeStatementSummaryData = {
  branchInfo?: TBranchInfo;
  records?: TIncomeStatementRow[];
  total?: TIncomeStatementRow;
};

type TIncomeStatementSummaryProps = {
  data: TIncomeStatementSummaryData;
  startDate: Date | null;
  endDate: Date | null;
};

const columns: { key: keyof TIncomeStatementRow; label: string }[] = [
  { key: "indoor", label: "Indoor" },
  { key: "outdoor", label: "Outdoor" },
  { key: "totalDiscount", label: "T Discount" },
  { key: "indoorReturn", label: "Indoor Return" },
  { key: "outdoorReturn", label: "Outdoor Return" },
  { key: "dueCollection", label: "Due Collection" },
  { key: "totalAdvance", label: "Total Advance" },
  { key: "netCollection", label: "Net Collection" },
  { key: "totalDue", label: "Total Due" },
];

const formatAmount = (value?: number) => Number(value ?? 0).toFixed(2);

const getRows = (data: TIncomeStatementSummaryData) => {
  if (data?.records?.length) {
    return data.records;
  }

  if (data?.total) {
    return [data.total];
  }

  return [];
};

const buildPdfHeader = (
  branchInfo: TBranchInfo | undefined,
  title: string,
  formattedStartDate: string,
  formattedEndDate: string
) => {
  const headerContent: any[] = [];

  if (branchInfo?.name) {
    headerContent.push({
      text: branchInfo.name,
      style: "header",
      alignment: "center",
      margin: [0, 0, 0, 8],
    });
  }

  if (branchInfo?.address1) {
    headerContent.push({
      text: branchInfo.address1,
      alignment: "center",
      margin: [0, 0, 0, 4],
    });
  }

  if (branchInfo?.phone) {
    headerContent.push({
      text: `Phone: ${branchInfo.phone}`,
      alignment: "center",
      margin: [0, 0, 0, 4],
    });
  }

  if (branchInfo?.vatNo) {
    headerContent.push({
      text: `VAT Registration No: ${branchInfo.vatNo}`,
      alignment: "center",
      margin: [0, 0, 0, 8],
    });
  }

  headerContent.push({
    text:
      formattedStartDate && formattedEndDate
        ? `${title}: ${formattedStartDate} to ${formattedEndDate}`
        : title,
    style: "subheader",
    alignment: "center",
    color: "red",
    margin: [0, 0, 0, 16],
  });

  return headerContent;
};

const buildDocumentDefinition = (
  data: TIncomeStatementSummaryData,
  rows: TIncomeStatementRow[],
  total: TIncomeStatementRow | undefined,
  title: string,
  formattedStartDate: string,
  formattedEndDate: string
) => ({
  pageOrientation: "landscape",
  defaultStyle: {
    fontSize: 11,
  },
  pageMargins: [20, 20, 20, 20],
  content: [
    ...buildPdfHeader(
      data?.branchInfo,
      title,
      formattedStartDate,
      formattedEndDate
    ),
    {
      table: {
        headerRows: 1,
        widths: Array(columns.length).fill("*"),
        body: [
          columns.map((column) => ({
            text: column.label,
            bold: true,
            alignment: "center",
            fillColor: "#eeeeee",
          })),
          ...rows.map((row) =>
            columns.map((column) => ({
              text: formatAmount(row?.[column.key]),
              alignment: "center",
            }))
          ),
          columns.map((column, index) => ({
            text:
              index === 0
                ? `Total: ${formatAmount(total?.[column.key])}`
                : formatAmount(total?.[column.key]),
            alignment: "center",
            bold: true,
            fillColor: "#f5f5f5",
          })),
        ],
      },
      layout: "lightHorizontalLines",
    },
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
    },
    subheader: {
      fontSize: 14,
      bold: true,
    },
  },
});

const MedicineIncomeStatementSummary: React.FC<
  TIncomeStatementSummaryProps
> = ({ data, startDate, endDate }) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const rows = getRows(data);
  const total = data?.total ?? rows[rows.length - 1];
  const title = "Medicine Income Statement Summary";
  const documentDefinition = buildDocumentDefinition(
    data,
    rows,
    total,
    title,
    formattedStartDate,
    formattedEndDate
  );

  const handlePrint = () => {
    pdfMake.createPdf(documentDefinition as any).print();
  };

  const handleDownload = () => {
    pdfMake
      .createPdf(documentDefinition as any)
      .download(
        `medicine-income-statement-summary-${
          formattedStartDate || "report"
        }.pdf`
      );
  };

  return (
    <div className="p-5">
      <ReporetHeader
        data={data}
        name={title}
        startDate={startDate}
        endDate={endDate}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={handleDownload}
          className="bg-emerald-600 w-36 px-3 py-2 rounded-md text-white font-semibold my-4"
        >
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 w-28 px-3 py-2 rounded-md text-white font-semibold my-4"
        >
          Print
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid grid-cols-9 bg-gray-100 font-semibold text-center p-3">
            {columns.map((column) => (
              <div key={column.key}>{column.label}</div>
            ))}
          </div>

          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-9 text-center p-3 border-b ${
                  rowIndex % 2 !== 0 ? "bg-slate-50" : ""
                }`}
              >
                {columns.map((column) => (
                  <div key={column.key}>{formatAmount(row?.[column.key])}</div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center mt-10 text-xl text-red-500">
              No Data Found
            </p>
          )}

          {total && (
            <div className="grid grid-cols-9 border-b font-bold text-center bg-slate-100 p-3">
              {columns.map((column, index) => (
                <div key={column.key}>
                  {index === 0 ? "Total" : ""}
                  {index === 0 ? ": " : ""}
                  {formatAmount(total?.[column.key])}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineIncomeStatementSummary;
