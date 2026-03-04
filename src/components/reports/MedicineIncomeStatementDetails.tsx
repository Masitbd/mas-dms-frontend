/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import ReporetHeader from "@/utils/ReporetHeader";
import { formatDate } from "@/utils/formateDate";

type TBranchInfo = {
  name?: string;
  address1?: string;
  phone?: string;
  vatNo?: string;
};

type TDetailRow = {
  billNo: string;
  buyerName: string;
  regNo: string;
  bedCabin: string;
  totalBill: number;
  discount: number;
  advance: number;
  totalPaid: number;
  totalDue: number;
};

type TDetailsTotals = {
  totalBill: number;
  discount: number;
  advance: number;
  totalPaid: number;
  totalDue: number;
};

type TDetailsReportData = {
  branchInfo?: TBranchInfo;
  records?: any[];
  total?: Partial<TDetailsTotals>;
  totals?: Partial<TDetailsTotals>;
};

type TDetailsReportProps = {
  data: TDetailsReportData;
  startDate: Date | null;
  endDate: Date | null;
};

const columns = [
  { key: "billNo", label: "Bill No" },
  { key: "buyerName", label: "Buyer Name" },
  { key: "regNo", label: "Reg No" },
  { key: "bedCabin", label: "Bed/Cabin" },
  { key: "totalBill", label: "Total Bill" },
  { key: "discount", label: "Discount" },
  { key: "advance", label: "Advance" },
  { key: "totalPaid", label: "Total Paid" },
  { key: "totalDue", label: "Total Due" },
] as const;

const money = (value?: number) => Number(value ?? 0).toFixed(2);

const readValue = (source: any, keys: string[], fallback: any = "") => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return fallback;
};

const toNumber = (value: any) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const normalizeRow = (row: any): TDetailRow => ({
  billNo: String(
    readValue(row, ["billNo", "invoiceNo", "invoice_no", "invoice"], "")
  ),
  buyerName: String(
    readValue(
      row,
      ["buyerName", "customerName", "patientName", "name", "partyName"],
      ""
    )
  ),
  regNo: String(
    readValue(row, ["regNo", "registrationNo", "reg_no", "registration"], "")
  ),
  bedCabin: String(
    readValue(row, ["bedCabin", "bed", "bedNo", "cabin", "bed_no"], "")
  ),
  totalBill: toNumber(readValue(row, ["totalBill", "billAmount", "amount"], 0)),
  discount: toNumber(readValue(row, ["discount", "totalDiscount"], 0)),
  advance: toNumber(readValue(row, ["advance", "totalAdvance"], 0)),
  totalPaid: toNumber(readValue(row, ["totalPaid", "paid"], 0)),
  totalDue: toNumber(readValue(row, ["totalDue", "due"], 0)),
});

const getRawRows = (data: TDetailsReportData | any[]) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.records)) {
    return data.records;
  }

  return [];
};

const normalizeTotals = (totals?: Partial<TDetailsTotals>) => {
  if (!totals) {
    return undefined;
  }

  return {
    totalBill: toNumber(
      readValue(totals, ["totalBill", "grandTotalBill", "billAmount"], 0)
    ),
    discount: toNumber(
      readValue(totals, ["discount", "totalDiscount", "grandTotalDiscount"], 0)
    ),
    advance: toNumber(
      readValue(totals, ["advance", "totalAdvance", "grandTotalAdvance"], 0)
    ),
    totalPaid: toNumber(
      readValue(totals, ["totalPaid", "paid", "grandTotalPaid"], 0)
    ),
    totalDue: toNumber(
      readValue(totals, ["totalDue", "due", "grandTotalDue"], 0)
    ),
  };
};

const buildTotals = (
  rows: TDetailRow[],
  providedTotals?: Partial<TDetailsTotals>
): TDetailsTotals => {
  const normalizedTotals = normalizeTotals(providedTotals);

  return {
    totalBill:
      normalizedTotals?.totalBill ??
      rows.reduce((sum, row) => sum + row.totalBill, 0),
    discount:
      normalizedTotals?.discount ??
      rows.reduce((sum, row) => sum + row.discount, 0),
    advance:
      normalizedTotals?.advance ??
      rows.reduce((sum, row) => sum + row.advance, 0),
    totalPaid:
      normalizedTotals?.totalPaid ??
      rows.reduce((sum, row) => sum + row.totalPaid, 0),
    totalDue:
      normalizedTotals?.totalDue ??
      rows.reduce((sum, row) => sum + row.totalDue, 0),
  };
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
  data: TDetailsReportData,
  rows: TDetailRow[],
  totals: TDetailsTotals,
  title: string,
  formattedStartDate: string,
  formattedEndDate: string
) => ({
  pageOrientation: "landscape",
  defaultStyle: {
    fontSize: 10,
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
        widths: [60, "*", 70, 80, 70, 60, 60, 70, 60],
        body: [
          columns.map((column) => ({
            text: column.label,
            bold: true,
            alignment: "center",
            fillColor: "#eeeeee",
          })),
          ...rows.map((row) => [
            { text: row.billNo, alignment: "center" },
            { text: row.buyerName, alignment: "left" },
            { text: row.regNo, alignment: "center" },
            { text: row.bedCabin, alignment: "center" },
            { text: money(row.totalBill), alignment: "right" },
            { text: money(row.discount), alignment: "right" },
            { text: money(row.advance), alignment: "right" },
            { text: money(row.totalPaid), alignment: "right" },
            { text: money(row.totalDue), alignment: "right" },
          ]),
          [
            { text: "Total", colSpan: 4, alignment: "center", bold: true },
            {},
            {},
            {},
            { text: money(totals.totalBill), alignment: "right", bold: true },
            { text: money(totals.discount), alignment: "right", bold: true },
            { text: money(totals.advance), alignment: "right", bold: true },
            { text: money(totals.totalPaid), alignment: "right", bold: true },
            { text: money(totals.totalDue), alignment: "right", bold: true },
          ],
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

const MedicineIncomeStatementDetails: React.FC<TDetailsReportProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const title = "Medicine Income Statement Details";
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const rows = getRawRows(data).map(normalizeRow);
  const totals = buildTotals(rows, data?.totals ?? data?.total);
  const documentDefinition = buildDocumentDefinition(
    data,
    rows,
    totals,
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
        `medicine-income-statement-details-${
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
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-9 bg-gray-100 font-semibold text-center p-3">
            {columns.map((column) => (
              <div key={column.key}>{column.label}</div>
            ))}
          </div>

          {rows.length > 0 ? (
            rows.map((row, index) => (
              <div
                key={`${row.billNo}-${index}`}
                className={`grid grid-cols-9 p-3 border-b ${
                  index % 2 !== 0 ? "bg-slate-50" : ""
                }`}
              >
                <div className="text-center">{row.billNo}</div>
                <div>{row.buyerName}</div>
                <div className="text-center">{row.regNo}</div>
                <div className="text-center">{row.bedCabin}</div>
                <div className="text-right">{money(row.totalBill)}</div>
                <div className="text-right">{money(row.discount)}</div>
                <div className="text-right">{money(row.advance)}</div>
                <div className="text-right">{money(row.totalPaid)}</div>
                <div className="text-right">{money(row.totalDue)}</div>
              </div>
            ))
          ) : (
            <p className="text-center mt-10 text-xl text-red-500">
              No Data Found
            </p>
          )}

          {rows.length > 0 && (
            <div className="grid grid-cols-9 bg-slate-100 font-bold p-3 border-b">
              <div className="col-span-4 text-center">Total</div>
              <div className="text-right">{money(totals.totalBill)}</div>
              <div className="text-right">{money(totals.discount)}</div>
              <div className="text-right">{money(totals.advance)}</div>
              <div className="text-right">{money(totals.totalPaid)}</div>
              <div className="text-right">{money(totals.totalDue)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineIncomeStatementDetails;
