/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import ReporetHeader from "@/utils/ReporetHeader";

type TBranchInfo = {
  name?: string;
  address1?: string;
  phone?: string;
  vatNo?: string;
};

type TStockStatementRecord = {
  mCategory?: string;
  medicineName?: string;
  stockQty?: number;
  purchaseQty?: number;
  totalPValue?: number;
  unitPrice?: number;
  totalSValue?: number;
};

type TStockStatementTotals = {
  totalStockQty?: number;
  totalPurchaseQty?: number;
  totalPurchaseValue?: number;
  totalStockValue?: number;
};

type TStockStatementData = {
  branchInfo?: TBranchInfo;
  records?: TStockStatementRecord[];
  totals?: TStockStatementTotals;
};

type TStockStatementProps = {
  data: TStockStatementData;
};

const money = (value?: number) => Number(value ?? 0).toFixed(2);
const numberValue = (value?: number) => Number(value ?? 0);

const buildPdfHeader = (branchInfo: TBranchInfo | undefined, title: string) => {
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
    text: title,
    style: "subheader",
    alignment: "center",
    color: "red",
    margin: [0, 0, 0, 16],
  });

  return headerContent;
};

const buildDocumentDefinition = (
  data: TStockStatementData,
  title: string
) => ({
  pageOrientation: "landscape",
  defaultStyle: {
    fontSize: 9,
  },
  pageMargins: [20, 20, 20, 20],
  content: [
    ...buildPdfHeader(data?.branchInfo, title),
    {
      table: {
        headerRows: 1,
        widths: [70, "*", 60, 70, 80, 60, 80],
        body: [
          [
            { text: "M Category", bold: true, alignment: "center" },
            { text: "Medicine Name", bold: true, alignment: "center" },
            { text: "Stock Qty", bold: true, alignment: "center" },
            { text: "Purchase Qty", bold: true, alignment: "center" },
            { text: "Total P. Value", bold: true, alignment: "center" },
            { text: "Unit Price", bold: true, alignment: "center" },
            { text: "Total S. Value", bold: true, alignment: "center" },
          ],
          ...(data?.records || []).map((item) => [
            { text: item?.mCategory || "", alignment: "center" },
            { text: item?.medicineName || "", alignment: "left" },
            { text: money(item?.stockQty), alignment: "right" },
            { text: money(item?.purchaseQty), alignment: "right" },
            { text: money(item?.totalPValue), alignment: "right" },
            { text: money(item?.unitPrice), alignment: "right" },
            { text: money(item?.totalSValue), alignment: "right" },
          ]),
          [
            { text: "Total", colSpan: 2, alignment: "center", bold: true },
            {},
            {
              text: money(data?.totals?.totalStockQty),
              alignment: "right",
              bold: true,
            },
            {
              text: money(data?.totals?.totalPurchaseQty),
              alignment: "right",
              bold: true,
            },
            {
              text: money(data?.totals?.totalPurchaseValue),
              alignment: "right",
              bold: true,
            },
            { text: "", alignment: "right", bold: true },
            {
              text: money(data?.totals?.totalStockValue),
              alignment: "right",
              bold: true,
            },
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

const MedicineStockStatement: React.FC<TStockStatementProps> = ({ data }) => {
  const title = "Medicine Stock Statement";
  const documentDefinition = buildDocumentDefinition(data, title);

  const handlePrint = () => {
    pdfMake.createPdf(documentDefinition as any).print();
  };

  const handleDownload = () => {
    pdfMake
      .createPdf(documentDefinition as any)
      .download("medicine-stock-statement.pdf");
  };

  return (
    <div className="p-5">
      <ReporetHeader data={data} name={title} />

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
          <div className="grid grid-cols-7 bg-gray-100 font-semibold text-center p-3">
            <div>M Category</div>
            <div>Medicine Name</div>
            <div>Stock Qty</div>
            <div>Purchase Qty</div>
            <div>Total P. Value</div>
            <div>Unit Price</div>
            <div>Total S. Value</div>
          </div>

          {data?.records?.length ? (
            data.records.map((item, index) => (
              <div
                key={`${item?.medicineName || "row"}-${index}`}
                className={`grid grid-cols-7 p-3 border-b ${
                  index % 2 !== 0 ? "bg-slate-50" : ""
                }`}
              >
                <div className="text-center">{item?.mCategory || ""}</div>
                <div>{item?.medicineName || ""}</div>
                <div className="text-right">{numberValue(item?.stockQty)}</div>
                <div className="text-right">
                  {numberValue(item?.purchaseQty)}
                </div>
                <div className="text-right">{money(item?.totalPValue)}</div>
                <div className="text-right">{money(item?.unitPrice)}</div>
                <div className="text-right">{money(item?.totalSValue)}</div>
              </div>
            ))
          ) : (
            <p className="text-center mt-10 text-xl text-red-500">
              No Data Found
            </p>
          )}

          {!!data?.records?.length && (
            <div className="grid grid-cols-7 bg-slate-100 font-bold p-3 border-b">
              <div className="col-span-2 text-center">Total</div>
              <div className="text-right">
                {numberValue(data?.totals?.totalStockQty)}
              </div>
              <div className="text-right">
                {numberValue(data?.totals?.totalPurchaseQty)}
              </div>
              <div className="text-right">
                {money(data?.totals?.totalPurchaseValue)}
              </div>
              <div />
              <div className="text-right">
                {money(data?.totals?.totalStockValue)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineStockStatement;
