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

type TExpiryRecord = {
  invoiceNo?: string;
  supplierName?: string;
  category?: string;
  medicineName?: string;
  batchNo?: string;
  qty?: number;
  rate?: number;
  amount?: number;
  dateMfg?: string;
  dateExp?: string;
};

type TExpiryData = {
  branchInfo?: TBranchInfo;
  records?: TExpiryRecord[];
  totalQty?: number;
  grandTotalAmount?: number;
};

type TExpiryProps = {
  data: TExpiryData | TExpiryRecord[];
  startDate: Date | null;
  endDate: Date | null;
};

type TNormalizedRecord = {
  invoiceNo: string;
  supplierName: string;
  category: string;
  medicineName: string;
  batchNo: string;
  qty: number;
  rate: number;
  amount: number;
  dateMfg: string;
  dateExp: string;
};

const toNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value: number) => value.toFixed(2);

const normalizeDate = (value?: string) => {
  if (!value) {
    return "";
  }

  if (value.includes("T")) {
    return value.slice(0, 10);
  }

  return value;
};

const normalizeRecord = (record: TExpiryRecord): TNormalizedRecord => ({
  invoiceNo: record?.invoiceNo || "",
  supplierName: record?.supplierName || "",
  category: record?.category || "",
  medicineName: record?.medicineName || "",
  batchNo: record?.batchNo || "",
  qty: toNumber(record?.qty),
  rate: toNumber(record?.rate),
  amount:
    record?.amount !== undefined
      ? toNumber(record.amount)
      : toNumber(record?.qty) * toNumber(record?.rate),
  dateMfg: normalizeDate(record?.dateMfg),
  dateExp: normalizeDate(record?.dateExp),
});

const getRecords = (data: TExpiryData | TExpiryRecord[]) => {
  if (Array.isArray(data)) {
    return data.map(normalizeRecord);
  }

  if (Array.isArray(data?.records)) {
    return data.records.map(normalizeRecord);
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
  data: TExpiryData | TExpiryRecord[],
  records: TNormalizedRecord[],
  totalQty: number,
  grandTotalAmount: number,
  title: string,
  formattedStartDate: string,
  formattedEndDate: string
) => ({
  pageOrientation: "landscape",
  defaultStyle: {
    fontSize: 9,
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
        widths: [50, "*", 60, "*", 55, 45, 50, 60, 60, 60],
        body: [
          [
            { text: "Invoice", bold: true, alignment: "center" },
            { text: "Supplier Name", bold: true, alignment: "center" },
            { text: "Category", bold: true, alignment: "center" },
            { text: "Medicine Name", bold: true, alignment: "center" },
            { text: "Batch No", bold: true, alignment: "center" },
            { text: "Qty", bold: true, alignment: "center" },
            { text: "Rate", bold: true, alignment: "center" },
            { text: "Amount", bold: true, alignment: "center" },
            { text: "Date Mfg", bold: true, alignment: "center" },
            { text: "Date Exp", bold: true, alignment: "center" },
          ],
          ...records.map((item) => [
            { text: item.invoiceNo, alignment: "center" },
            { text: item.supplierName, alignment: "left" },
            { text: item.category, alignment: "center" },
            { text: item.medicineName, alignment: "left" },
            { text: item.batchNo, alignment: "center" },
            { text: money(item.qty), alignment: "right" },
            { text: money(item.rate), alignment: "right" },
            { text: money(item.amount), alignment: "right" },
            { text: item.dateMfg, alignment: "center" },
            { text: item.dateExp, alignment: "center" },
          ]),
          [
            {
              text: "Total",
              colSpan: 5,
              alignment: "center",
              bold: true,
            },
            {},
            {},
            {},
            {},
            { text: money(totalQty), alignment: "right", bold: true },
            { text: "", alignment: "right", bold: true },
            { text: money(grandTotalAmount), alignment: "right", bold: true },
            { text: "", alignment: "center", bold: true },
            { text: "", alignment: "center", bold: true },
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

const MedicineExpiryStatement: React.FC<TExpiryProps> = ({
  data,
  startDate,
  endDate,
}) => {
  const title = "Medicine Expiry Statement";
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const records = getRecords(data);
  const totalQty = Array.isArray(data)
    ? records.reduce((sum, item) => sum + item.qty, 0)
    : data?.totalQty !== undefined
    ? toNumber(data.totalQty)
    : records.reduce((sum, item) => sum + item.qty, 0);
  const grandTotalAmount = Array.isArray(data)
    ? records.reduce((sum, item) => sum + item.amount, 0)
    : data?.grandTotalAmount !== undefined
    ? toNumber(data.grandTotalAmount)
    : records.reduce((sum, item) => sum + item.amount, 0);
  const documentDefinition = buildDocumentDefinition(
    data,
    records,
    totalQty,
    grandTotalAmount,
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
        `medicine-expiry-statement-${formattedStartDate || "report"}.pdf`
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
        <div className="min-w-[1400px]">
          <div className="grid grid-cols-10 bg-gray-100 font-semibold text-center p-3">
            <div>Invoice</div>
            <div>Supplier Name</div>
            <div>Category</div>
            <div>Medicine Name</div>
            <div>Batch No</div>
            <div>Qty</div>
            <div>Rate</div>
            <div>Amount</div>
            <div>Date Mfg</div>
            <div>Date Exp</div>
          </div>

          {records.length > 0 ? (
            records.map((item, index) => (
              <div
                key={`${item.invoiceNo}-${item.batchNo}-${index}`}
                className={`grid grid-cols-10 p-3 border-b ${
                  index % 2 !== 0 ? "bg-slate-50" : ""
                }`}
              >
                <div className="text-center">{item.invoiceNo}</div>
                <div>{item.supplierName}</div>
                <div className="text-center">{item.category}</div>
                <div>{item.medicineName}</div>
                <div className="text-center">{item.batchNo}</div>
                <div className="text-right">{money(item.qty)}</div>
                <div className="text-right">{money(item.rate)}</div>
                <div className="text-right">{money(item.amount)}</div>
                <div className="text-center">{item.dateMfg}</div>
                <div className="text-center">{item.dateExp}</div>
              </div>
            ))
          ) : (
            <p className="text-center mt-10 text-xl text-red-500">
              No Data Found
            </p>
          )}

          {records.length > 0 && (
            <div className="grid grid-cols-10 bg-slate-100 font-bold p-3 border-b">
              <div className="col-span-5 text-center">Total</div>
              <div className="text-right">{money(totalQty)}</div>
              <div />
              <div className="text-right">{money(grandTotalAmount)}</div>
              <div />
              <div />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineExpiryStatement;
