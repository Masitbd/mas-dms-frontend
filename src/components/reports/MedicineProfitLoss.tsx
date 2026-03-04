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

type TProfitLossRecord = {
  particulars?: string;
  name?: string;
  qty?: number;
  salesRate?: number;
  totalAmount?: number;
  purchaseRate?: number;
  discount?: number;
  netAmount?: number;
  totalPRate?: number;
  netProfit?: number;
};

type TProfitLossTotals = {
  qty?: number;
  salesRate?: number;
  totalAmount?: number;
  purchaseRate?: number;
  discount?: number;
  netAmount?: number;
  totalPRate?: number;
  netProfit?: number;
};

type TProfitLossData = {
  branchInfo?: TBranchInfo;
  records?: TProfitLossRecord[];
  totals?: TProfitLossTotals;
};

type TProfitLossProps = {
  data: TProfitLossData | TProfitLossRecord[];
  startDate: Date | null;
  endDate: Date | null;
};

type TNormalizedRecord = {
  particulars: string;
  qty: number;
  salesRate: number;
  totalAmount: number;
  purchaseRate: number;
  discount: number;
  netAmount: number;
  totalPRate: number;
  netProfit: number;
};

const columns = [
  { key: "particulars", label: "Particulars" },
  { key: "qty", label: "Qty" },
  { key: "salesRate", label: "S.Rate" },
  { key: "totalAmount", label: "T Amount" },
  { key: "purchaseRate", label: "P.Rate" },
  { key: "discount", label: "Discount" },
  { key: "netAmount", label: "Net Amount" },
  { key: "totalPRate", label: "T. PRate" },
  { key: "netProfit", label: "Net Profit" },
] as const;

const toNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value: number) => value.toFixed(2);

const normalizeRecord = (record: TProfitLossRecord): TNormalizedRecord => {
  const qty = toNumber(record?.qty);
  const salesRate = toNumber(record?.salesRate);
  const purchaseRate = toNumber(record?.purchaseRate);
  const discount = toNumber(record?.discount);
  const totalAmount =
    record?.totalAmount !== undefined
      ? toNumber(record.totalAmount)
      : qty * salesRate;
  const netAmount =
    record?.netAmount !== undefined
      ? toNumber(record.netAmount)
      : totalAmount - discount;
  const totalPRate =
    record?.totalPRate !== undefined
      ? toNumber(record.totalPRate)
      : qty * purchaseRate;
  const netProfit =
    record?.netProfit !== undefined
      ? toNumber(record.netProfit)
      : netAmount - totalPRate;

  return {
    particulars: record?.particulars || record?.name || "",
    qty,
    salesRate,
    totalAmount,
    purchaseRate,
    discount,
    netAmount,
    totalPRate,
    netProfit,
  };
};

const getRecords = (data: TProfitLossData | TProfitLossRecord[]) => {
  if (Array.isArray(data)) {
    return data.map(normalizeRecord);
  }

  if (Array.isArray(data?.records)) {
    return data.records.map(normalizeRecord);
  }

  return [];
};

const getTotals = (
  records: TNormalizedRecord[],
  totals?: TProfitLossTotals
): TNormalizedRecord => ({
  particulars: "Total",
  qty:
    totals?.qty !== undefined
      ? toNumber(totals.qty)
      : records.reduce((sum, item) => sum + item.qty, 0),
  salesRate: toNumber(totals?.salesRate),
  totalAmount:
    totals?.totalAmount !== undefined
      ? toNumber(totals.totalAmount)
      : records.reduce((sum, item) => sum + item.totalAmount, 0),
  purchaseRate: toNumber(totals?.purchaseRate),
  discount:
    totals?.discount !== undefined
      ? toNumber(totals.discount)
      : records.reduce((sum, item) => sum + item.discount, 0),
  netAmount:
    totals?.netAmount !== undefined
      ? toNumber(totals.netAmount)
      : records.reduce((sum, item) => sum + item.netAmount, 0),
  totalPRate:
    totals?.totalPRate !== undefined
      ? toNumber(totals.totalPRate)
      : records.reduce((sum, item) => sum + item.totalPRate, 0),
  netProfit:
    totals?.netProfit !== undefined
      ? toNumber(totals.netProfit)
      : records.reduce((sum, item) => sum + item.netProfit, 0),
});

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
  data: TProfitLossData | TProfitLossRecord[],
  records: TNormalizedRecord[],
  totals: TNormalizedRecord,
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
      Array.isArray(data) ? undefined : data?.branchInfo,
      title,
      formattedStartDate,
      formattedEndDate
    ),
    {
      table: {
        headerRows: 1,
        widths: ["*", 40, 55, 65, 55, 55, 65, 65, 60],
        body: [
          columns.map((column) => ({
            text: column.label,
            bold: true,
            alignment: "center",
            fillColor: "#eeeeee",
          })),
          ...records.map((item) => [
            { text: item.particulars, alignment: "left" },
            { text: money(item.qty), alignment: "right" },
            { text: money(item.salesRate), alignment: "right" },
            { text: money(item.totalAmount), alignment: "right" },
            { text: money(item.purchaseRate), alignment: "right" },
            { text: money(item.discount), alignment: "right" },
            { text: money(item.netAmount), alignment: "right" },
            { text: money(item.totalPRate), alignment: "right" },
            { text: money(item.netProfit), alignment: "right" },
          ]),
          [
            { text: totals.particulars, alignment: "center", bold: true },
            { text: money(totals.qty), alignment: "right", bold: true },
            { text: money(totals.salesRate), alignment: "right", bold: true },
            { text: money(totals.totalAmount), alignment: "right", bold: true },
            {
              text: money(totals.purchaseRate),
              alignment: "right",
              bold: true,
            },
            { text: money(totals.discount), alignment: "right", bold: true },
            { text: money(totals.netAmount), alignment: "right", bold: true },
            { text: money(totals.totalPRate), alignment: "right", bold: true },
            { text: money(totals.netProfit), alignment: "right", bold: true },
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

const MedecineProfitLossTable: React.FC<TProfitLossProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const title = "Medicine Profit Loss Statement";
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const records = getRecords(data);
  const totals = getTotals(records, Array.isArray(data) ? undefined : data?.totals);
  const documentDefinition = buildDocumentDefinition(
    data,
    records,
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
      .download(`medicine-profit-loss-${formattedStartDate || "report"}.pdf`);
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

          {records.length > 0 ? (
            records.map((item, index) => (
              <div
                key={`${item.particulars}-${index}`}
                className={`grid grid-cols-9 p-3 border-b ${
                  index % 2 !== 0 ? "bg-slate-50" : ""
                }`}
              >
                <div className="font-semibold">{item.particulars}</div>
                <div className="text-right">{money(item.qty)}</div>
                <div className="text-right">{money(item.salesRate)}</div>
                <div className="text-right">{money(item.totalAmount)}</div>
                <div className="text-right">{money(item.purchaseRate)}</div>
                <div className="text-right">{money(item.discount)}</div>
                <div className="text-right">{money(item.netAmount)}</div>
                <div className="text-right">{money(item.totalPRate)}</div>
                <div className="text-right">{money(item.netProfit)}</div>
              </div>
            ))
          ) : (
            <p className="text-center mt-10 text-xl text-red-500">
              No Data Found
            </p>
          )}

          {records.length > 0 && (
            <div className="grid grid-cols-9 bg-slate-100 font-bold p-3 border-b">
              <div>{totals.particulars}</div>
              <div className="text-right">{money(totals.qty)}</div>
              <div className="text-right">{money(totals.salesRate)}</div>
              <div className="text-right">{money(totals.totalAmount)}</div>
              <div className="text-right">{money(totals.purchaseRate)}</div>
              <div className="text-right">{money(totals.discount)}</div>
              <div className="text-right">{money(totals.netAmount)}</div>
              <div className="text-right">{money(totals.totalPRate)}</div>
              <div className="text-right">{money(totals.netProfit)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedecineProfitLossTable;
