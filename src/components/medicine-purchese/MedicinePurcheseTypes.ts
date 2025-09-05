/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";

export const medicinePurchaseSchema = yup
  .object({
    challanNo: yup.string().required(),
    age: yup.number().positive().integer().required(),
  })
  .required();

import { useEffect, useRef } from "react";

export function useValueChange(newValue: any, callback: any) {
  const prevValue = useRef(newValue);
  useEffect(() => {
    if (
      prevValue.current[1] !== newValue[1] ||
      prevValue.current[2] !== newValue[2]
    ) {
      callback();
      prevValue.current = newValue;
    }
  }, [newValue]);
}

/*************************
 * Type Definitions
 *************************/
export type Supplier = {
  _id: string;
  supplierId: string;
  name: string;
  contactPerson?: string;
  address?: string;
  phone?: string;
  fax?: string;
  city?: string;
  country?: string;
  email?: string;
};

export type Purchase = {
  _id: string;
  id?: string;
  invoiceNo: string;
  supplierId: Supplier;
  purchaseDate: string | Date;
  vatPercentage: number; // e.g. 10 means 10%
  discountPercentage: number; // e.g. 10 means 10%
  totalAmount: number; // base total (pre-VAT/discount) if items missing
  paidAmount: number;
  status: string; // "paid" | "due" | etc
  createdAt?: string | Date;
  updatedAt?: string | Date;
  netPayable?: number;
};

export type MedicineName = {
  _id?: string;
  medicineId?: string;
  name: string;
  unit?: string; // e.g. ml, pcs
};

export type MedicineItem = {
  _id: string;
  id?: string;
  purchaseId: string;
  medicineName: MedicineName;
  quantity: number;
  purchaseRate: number; // unit cost
  salesRate?: number; // optional sales price
  batchNo?: string;
  dateExpire?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

/*************************
 * Utility helpers
 *************************/
export function toDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  try {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  } catch {}
  return undefined;
}

export function formatDate(value?: string | Date): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function money(n: number, currencyCode = "TK"): string {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(n ?? 0);
  } catch {
    return `${n?.toFixed?.(2) ?? n} ${currencyCode}`;
  }
}

export const defaultValues = {
  invoiceNo: "",
  supplierId: "",
  totalAmount: 0,
  paidAmount: 0,
  purchaseDate: new Date(),
  supplierBill: "",
  vatPercentage: 0,
  vatAmount: 0,
  discountPercentage: 0,
  discountAmount: 0,
};

type PurchaseItem = {
  amount?: number; // optional precomputed line total
  purchaseRate?: number; // unit price
  quantity?: number; // qty
  discount?: number; // per-item % discount
  vat?: number; // per-item % VAT
};

export function calculateInvoiceTotals(
  purchaseItems: PurchaseItem[],
  discountPercentage?: number, // overall %
  vatPercentage?: number // overall %
): {
  TotalAmount: number;
  TotalDiscount: number;
  TotalVat: number;
  NetPayable: number;
} {
  const toNum = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  let totalAmount = 0;

  // Discount accumulators
  let itemWiseDiscount = 0;
  let baseWithoutItemDiscount = 0;

  // VAT accumulators
  let itemWiseVAT = 0;
  let baseWithoutItemVAT = 0;

  for (const p of purchaseItems ?? []) {
    const qty = toNum(p?.quantity);
    const rate = toNum(p?.purchaseRate);
    const base = toNum(p?.amount ?? rate * qty);

    totalAmount += base;

    // Per-item vs overall Discount
    const dPct = toNum(p?.discount);
    if (dPct > 0) {
      itemWiseDiscount += (base * dPct) / 100;
    } else {
      baseWithoutItemDiscount += base;
    }

    // Per-item vs overall VAT
    const vPct = toNum(p?.vat);
    if (vPct > 0) {
      itemWiseVAT += (base * vPct) / 100;
    } else {
      baseWithoutItemVAT += base;
    }
  }

  const overallDiscPct = Math.max(0, toNum(discountPercentage));
  const overallVatPct = Math.max(0, toNum(vatPercentage));

  const overallDiscount = (baseWithoutItemDiscount * overallDiscPct) / 100;
  const overallVAT = (baseWithoutItemVAT * overallVatPct) / 100;

  const TotalDiscount = itemWiseDiscount + overallDiscount;
  const TotalVat = itemWiseVAT + overallVAT;

  const TotalAmount = totalAmount;
  const NetPayable = TotalAmount - TotalDiscount + TotalVat;

  // round to 2 decimals
  const round2 = (n: number) => Number(n.toFixed(2));

  return {
    TotalAmount: round2(TotalAmount),
    TotalDiscount: round2(TotalDiscount),
    TotalVat: round2(TotalVat),
    NetPayable: round2(NetPayable),
  };
}

// pdfMake setup (browser):

type PurchaseData = { purchaseInfo?: any; purchaseItemInfo?: any[] };

type GenerateOpts = {
  title?: string;
  subTitleLines?: string[];
  headerImageDataUrl?: string | null; // optional logo (dataURL/base64)
  developerCredit?: string; // shown ONLY in footer
  open?: boolean; // open in new tab instead of download
  fileName?: string; // download name
};

export function generatePurchasePdf(
  rawData: PurchaseData,
  opts: GenerateOpts = {}
) {
  // ---- constants (keep margins here so header/footer can compute widths) ----
  const PAGE_MARGINS: [number, number, number, number] = [40, 110, 40, 80];

  try {
    const data = rawData || {};
    const items: any[] = Array.isArray(data.purchaseItemInfo)
      ? data.purchaseItemInfo
      : [];
    const PI = data.purchaseInfo || {};
    const supplier = PI?.supplierId || {};

    const title = opts.title ?? "Doctors Unit - 1";
    const subTitleLines = opts.subTitleLines ?? [
      "Mofiz Paglar More, Sherpur Road, Sutarpara, Bogra.",
      "Phone : 051-61074, 78389, 01711890501",
    ];
    const developerCredit =
      opts.developerCredit ??
      "Software Developed by MAS IT SOLUTIONS, Contact: +88-02-8056691, 01915682291, 017145898268";

    // ---------- helpers ----------
    const isNum = (v: any) => typeof v === "number" && Number.isFinite(v);
    const N = (v: any) => (isNum(v) ? Number(v) : 0);
    const F = (v: any, d = 2) => N(v).toFixed(d);
    const pad2 = (n: number) => (n < 10 ? "0" + n : "" + n);
    const MMM = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const fmtDate = (iso?: string) => {
      if (!iso) return "—";
      const d = new Date(iso);
      if (isNaN(+d)) return "—";
      return `${pad2(d.getDate())}-${MMM[d.getMonth()]}-${d.getFullYear()}`;
    };
    const fmtTime = (iso?: string) => {
      if (!iso) return "—";
      const d = new Date(iso);
      if (isNaN(+d)) return "—";
      let hh = d.getHours();
      const mm = pad2(d.getMinutes());
      const ss = pad2(d.getSeconds());
      const ampm = hh >= 12 ? "PM" : "AM";
      hh = hh % 12 || 12;
      return `${pad2(hh)}:${mm}:${ss} ${ampm}`;
    };

    // ---------- amounts ----------
    const lineAmount = (it: any) => {
      const qty = N(it?.quantity);
      const rate = N(it?.purchaseRate);
      const base = qty * rate;

      const discVal =
        isNum(it?.discount) && it.discount > 0
          ? it.discount <= 100
            ? (base * N(it.discount)) / 100
            : N(it.discount)
          : 0;

      const afterDisc = Math.max(0, base - discVal);

      const vatVal =
        isNum(it?.vat) && it.vat > 0
          ? it.vat <= 100
            ? (afterDisc * N(it.vat)) / 100
            : N(it.vat)
          : 0;

      return Math.max(0, afterDisc + vatVal);
    };

    const totalItemsAmount = items.reduce((s, it) => s + lineAmount(it), 0);
    const discountPct = N(PI?.discountPercentage);
    const vatPct = N(PI?.vatPercentage);

    const discountAmount = isNum(PI?.discountAmount)
      ? N(PI.discountAmount)
      : (totalItemsAmount * (discountPct > 0 ? discountPct : 0)) / 100;

    const subAfterDisc = Math.max(0, totalItemsAmount - discountAmount);

    const vatAmount = isNum(PI?.vatAmount)
      ? N(PI.vatAmount)
      : (subAfterDisc * (vatPct > 0 ? vatPct : 0)) / 100;

    const netPayable = isNum(PI?.netPayable)
      ? N(PI.netPayable)
      : Math.max(0, subAfterDisc + vatAmount);

    const paidAmount = isNum(PI?.paidAmount) ? N(PI.paidAmount) : 0;
    const totalDue = Math.max(0, netPayable - paidAmount);

    // ---------- table ----------
    const headerRow = [
      { text: "S/N", style: "th", alignment: "center" },
      { text: "Category", style: "th" },
      { text: "Medicine Name", style: "th" },
      { text: "Date Exp", style: "th", alignment: "center" },
      { text: "Date Mfg", style: "th", alignment: "center" },
      { text: "Qty", style: "th", alignment: "right" },
      { text: "Rate", style: "th", alignment: "right" },
      { text: "Amount", style: "th", alignment: "right" },
    ];

    const bodyRows =
      items.length > 0
        ? items.map((it, i) => {
            const med = it?.medicineName || {};
            const catName =
              med?.category?.name || it?.category?.name || it?.category || "—";
            return [
              { text: String(i + 1), alignment: "center" },
              { text: String(catName) },
              {
                text: String(
                  med?.name ?? it?.medicineName?.name ?? it?.medicineName ?? "—"
                ),
              },
              { text: fmtDate(it?.dateExpire), alignment: "center" },
              { text: fmtDate(it?.dateMfg), alignment: "center" },
              { text: F(it?.quantity), alignment: "right" },
              { text: F(it?.purchaseRate), alignment: "right" },
              { text: F(lineAmount(it)), alignment: "right" },
            ];
          })
        : [
            [
              {
                text: "No items found",
                colSpan: 8,
                alignment: "center",
                italics: true,
              },
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          ];

    // ---------- header (repeat every page) ----------
    const header = (currentPage: number, pageCount: number, pageSize: any) => {
      const innerWidth = pageSize.width - PAGE_MARGINS[0] - PAGE_MARGINS[2];
      const purchaseDate = PI?.purchaseDate;
      const cols: any[] = [];

      if (opts.headerImageDataUrl) {
        cols.push({
          image: opts.headerImageDataUrl,
          fit: [60, 60],
          margin: [0, 0, 10, 0],
        });
      }
      cols.push({
        stack: [
          { text: title, style: "headerTitle" },
          ...subTitleLines.map((l) => ({ text: l, style: "subHeader" })),
        ],
        alignment: "center",
        width: "*",
      });

      return {
        margin: [PAGE_MARGINS[0], 20, PAGE_MARGINS[2], 10],
        stack: [
          { columns: cols },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: innerWidth,
                y2: 5,
                lineWidth: 1,
              },
            ],
          },
          {
            columns: [
              {
                width: "*",
                stack: [
                  {
                    text: `Invoice No : ${PI?.invoiceNo ?? "—"}`,
                    style: "meta",
                  },
                  {
                    text: `Supplier Name : ${supplier?.name ?? "—"}`,
                    style: "meta",
                  },
                ],
              },
              {
                width: "*",
                stack: [
                  {
                    text: `Purchase Time : ${fmtTime(purchaseDate)}`,
                    alignment: "right",
                    style: "meta",
                  },
                  {
                    text: `Purchase Date : ${fmtDate(purchaseDate)}`,
                    alignment: "right",
                    style: "meta",
                  },
                ],
              },
            ],
            margin: [0, 6, 0, 0],
          },
        ],
      };
    };

    // ---------- footer (repeat every page; dev credit 80%, page number 20%) ----------
    const footer = (currentPage: number, pageCount: number, pageSize: any) => {
      const innerWidth = pageSize.width - PAGE_MARGINS[0] - PAGE_MARGINS[2];
      const w80 = Math.floor(innerWidth * 0.8);
      const w20 = innerWidth - w80;

      return {
        margin: [PAGE_MARGINS[0], 8, PAGE_MARGINS[2], 16],
        stack: [
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: innerWidth,
                y2: 0,
                lineWidth: 0.5,
                lineColor: "#aaa",
              },
            ],
          },
          {
            table: {
              widths: [w80, w20],
              body: [
                [
                  {
                    text: developerCredit,
                    alignment: "left",
                    fontSize: 8,
                    color: "#666",
                  },
                  {
                    text: `Page ${currentPage} of ${pageCount}`,
                    alignment: "right",
                    fontSize: 8,
                    color: "#666",
                  },
                ],
              ],
            },
            layout: "noBorders",
            margin: [0, 6, 0, 0],
          },
        ],
      };
    };

    // ---------- document ----------
    const docDefinition: any = {
      pageSize: "A4",
      pageMargins: PAGE_MARGINS,
      header,
      footer,
      content: [
        {
          table: {
            headerRows: 1,
            widths: [30, 70, "*", 65, 65, 35, 50, 60],
            body: [headerRow, ...bodyRows],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => "#aaa",
            vLineColor: () => "#aaa",
          },
          fontSize: 9,
        },

        // Totals box pinned to the RIGHT side of the page
        {
          margin: [0, 8, 0, 0],
          columns: [
            { width: "*", text: "" },
            {
              width: 240, // right column containing the totals table
              table: {
                widths: [120, 100],
                body: [
                  [
                    { text: "Total Amount :", bold: true },
                    { text: F(totalItemsAmount) },
                  ],
                  [
                    { text: `Discount (${F(discountPct, 0)}%) :`, bold: true },
                    { text: `- ${F(discountAmount)}` },
                  ],
                  [
                    { text: `VAT (${F(vatPct, 0)}%) :`, bold: true },
                    { text: `+ ${F(vatAmount)}` },
                  ],
                  [
                    { text: "Net Payable :", bold: true },
                    { text: F(netPayable) },
                  ],
                  [
                    { text: "Total Paid :", bold: true },
                    { text: F(paidAmount) },
                  ],
                  [{ text: "Total Due :", bold: true }, { text: F(totalDue) }],
                ],
              },
              layout: "noBorders",
              fontSize: 10,
              alignment: "right",
            },
          ],
        },
      ],
      styles: {
        headerTitle: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 2],
        },
        subHeader: { fontSize: 9, color: "#444", alignment: "center" },
        meta: { fontSize: 9 },
        th: { bold: true, fillColor: "#f5f5f5" },
      },
      defaultStyle: { fontSize: 9 },
    };

    const fileName =
      opts.fileName ?? (PI?.invoiceNo ? `${PI.invoiceNo}.pdf` : "purchase.pdf");
    // @ts-ignore
    const pdf = pdfMake.createPdf(docDefinition);
    opts.open ? pdf.open() : pdf.download(fileName);
  } catch (err) {
    console.error("PDF generation failed:", err);
    if (typeof window !== "undefined" && "alert" in window) {
      alert(
        "Sorry, failed to generate the PDF. Please check the console for details."
      );
    }
  }
}
