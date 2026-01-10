/* ============================================================
 * printInvoice.ts (Client-only)
 * - pdfmake print for POS and A4
 * - Robust dynamic import (avoids SSR issues)
 * ============================================================
 */

import { TDocumentDefinitions } from "pdfmake/interfaces";

export type PrintMode = "pos" | "a4";

export type SaleInvoiceData = {
  saleId?: string;
  invoiceNo: string;
  saleDate?: string | Date;
  status?: string;

  customer?: {
    name?: string;
    contactNo?: string;
    address?: string;
    field?: string;
    patientType?: "outdoor" | "indoor";
    bedNo?: string | null;
    indoorBillNo?: string | null;
  };

  items?: Array<{
    medicineSnapshot?: {
      name?: string;
      unit?: string | null;
      medicineId?: string;
    };
    stockSnapshot?: { batchNo?: string; expiryDate?: string | Date };
    qty?: number;
    rate?: number;
    discountPct?: number;
    vatPct?: number;

    gross?: number;
    discountAmount?: number;
    netBeforeVat?: number;
    vatAmount?: number;
    lineTotal?: number;
  }>;

  finance?: {
    subTotal?: number;
    vatTotal?: number;
    lineDiscountTotal?: number;
    extraDiscount?: number;
    adjustment?: number;
    netPayable?: number;
    paid?: number;
    due?: number;
    paymentMethod?: "cash" | "card" | "bank";
  };

  note?: string | null;
};

/* -----------------------------
 * Internal: lazy-load pdfmake + fonts (no SSR headaches)
 * Client-side usage patterns are documented by pdfmake. :contentReference[oaicite:1]{index=1}
 * ----------------------------- */
let _pdfMake: any | null = null;

async function getPdfMake() {
  if (_pdfMake) return _pdfMake;

  const pdfMakeMod: any = await import("pdfmake/build/pdfmake");
  const pdfMake = pdfMakeMod.default || pdfMakeMod;

  // Attach Roboto VFS
  try {
    // Some bundlers dislike default export; handle both shapes
    const fontsMod: any = await import("pdfmake/build/vfs_fonts");
    const vfs =
      fontsMod?.pdfMake?.vfs ||
      fontsMod?.default?.pdfMake?.vfs ||
      fontsMod?.default?.vfs;

    if (vfs) {
      pdfMake.vfs = vfs;
    } else if (typeof pdfMake.addVirtualFileSystem === "function") {
      // fallback for older patterns
      pdfMake.addVirtualFileSystem(fontsMod.default || fontsMod);
    }
  } catch {
    // If fonts fail to load, pdfmake may still work depending on environment.
    // Better to fail gracefully than crash the POS.
  }

  _pdfMake = pdfMake;
  return pdfMake;
}

/* -----------------------------
 * Formatting helpers
 * ----------------------------- */
function n(v: any, fallback = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fallback;
}

function money(v: any) {
  const x = n(v, 0);
  return x.toFixed(2);
}

function mmToPt(mm: number) {
  return (mm * 72) / 25.4;
}

function fmtDateTime(d?: string | Date) {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
}

function safeText(v: any, fallback = "—") {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
}

/* ============================================================
 * Main: printInvoice(data, mode)
 * ============================================================
 */
export async function printInvoice(data: SaleInvoiceData, mode: PrintMode) {
  // Hard guard: must run in browser
  if (typeof window === "undefined") return;

  const pdfMake = await getPdfMake();

  const dd =
    mode === "pos" ? buildPosDocDefinition(data) : buildA4DocDefinition(data);

  // Print dialog (browser controls actual printer selection)
  function printPdfBlobSameTab(pdfBlob: Blob) {
    const blobUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement("iframe");
    // Keep it invisible but present in the DOM
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = blobUrl;

    const cleanUp = () => {
      URL.revokeObjectURL(blobUrl);
      iframe.remove();
    };

    const triggerPrint = () => {
      const w = iframe.contentWindow as Window | null;
      if (!w) {
        cleanUp();
        return;
      }

      const after = () => setTimeout(cleanUp, 300);

      // Use separate guards (not `else if`) so TS doesn't narrow to `never`
      if ("onafterprint" in w) {
        (w as Window & { onafterprint: (() => void) | null }).onafterprint =
          after;
      }

      if (typeof w.matchMedia === "function") {
        const mql: MediaQueryList = w.matchMedia("print");
        const onChange = (e: MediaQueryListEvent) => {
          if (!e.matches) after();
        };

        if ("addEventListener" in mql) {
          mql.addEventListener("change", onChange);
        } else if ("addListener" in mql) {
          // Older API (cast for TS)
          (
            mql as unknown as {
              addListener: (cb: (e: MediaQueryListEvent) => void) => void;
            }
          ).addListener(onChange);
        }
      }

      // Small delay helps some PDF viewers fully initialize
      setTimeout(() => {
        w.focus();
        w.print();
      }, 100);
    };

    iframe.addEventListener("load", () => setTimeout(triggerPrint, 200));
    document.body.appendChild(iframe);
  }

  pdfMake
    .createPdf(dd as unknown as TDocumentDefinitions)
    .getBlob((result: Blob) => {
      printPdfBlobSameTab(result);
    });
}

/* ============================================================
 * POS Receipt Definition (Thermal)
 * - default: 80mm width
 * ============================================================
 */
function buildPosDocDefinition(data: SaleInvoiceData) {
  const POS_WIDTH_MM = 80; // adjust to 58 if needed
  const width = mmToPt(POS_WIDTH_MM);

  const items = Array.isArray(data.items) ? data.items : [];
  const finance = data.finance ?? {};
  const customer = data.customer ?? {};

  const headerLines = [
    { text: "INVOICE", style: "title", alignment: "center" },
    { text: `Invoice: ${safeText(data.invoiceNo)}`, style: "meta" },
    { text: `Date: ${safeText(fmtDateTime(data.saleDate))}`, style: "meta" },
    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: width - 24, y2: 0, lineWidth: 1 },
      ],
    },
  ];

  const customerLines = [
    { text: `Customer: ${safeText(customer.name)}`, style: "meta" },
    { text: `Phone: ${safeText(customer.contactNo)}`, style: "meta" },
    customer.address
      ? { text: `Addr: ${safeText(customer.address)}`, style: "meta" }
      : null,
    customer.patientType === "indoor"
      ? {
          text: `Indoor • Bed: ${safeText(customer.bedNo)} • Bill: ${safeText(
            customer.indoorBillNo
          )}`,
          style: "meta",
        }
      : { text: "Outdoor", style: "meta" },
    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: width - 24, y2: 0, lineWidth: 1 },
      ],
    },
  ].filter(Boolean);

  const itemRows = items.map((it) => {
    const name = safeText(it.medicineSnapshot?.name);
    const qty = n(it.qty);
    const rate = n(it.rate);
    const disc = n(it.discountPct);
    const vat = n(it.vatPct);
    const total = it.lineTotal != null ? n(it.lineTotal) : qty * rate;

    return [
      {
        stack: [
          { text: name, style: "itemName" },
          {
            text: `Q:${money(qty)}  R:${money(rate)}  D:${money(
              disc
            )}%  V:${money(vat)}%`,
            style: "itemSub",
          },
          it.stockSnapshot?.batchNo
            ? {
                text: `Batch: ${safeText(it.stockSnapshot?.batchNo)}`,
                style: "itemSub",
              }
            : null,
        ].filter(Boolean),
      },
      { text: money(total), style: "itemAmt", alignment: "right" },
    ];
  });

  const totalsBlock = [
    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: width - 24, y2: 0, lineWidth: 1 },
      ],
    },

    row2("Sub Total", money(finance.subTotal)),
    row2("Line Discount", money(finance.lineDiscountTotal)),
    row2("Extra Discount", money(finance.extraDiscount)),
    row2("VAT", money(finance.vatTotal)),
    row2("Adjustment", money(finance.adjustment)),

    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: width - 24, y2: 0, lineWidth: 1 },
      ],
    },

    row2("NET PAYABLE", money(finance.netPayable), true),
    row2(
      `Paid (${safeText(finance.paymentMethod, "cash")})`,
      money(finance.paid)
    ),
    row2("Due", money(finance.due), true),

    data.note
      ? {
          text: `Note: ${safeText(data.note, "")}`,
          style: "meta",
          margin: [0, 6, 0, 0],
        }
      : null,
    {
      text: "Thank you.",
      alignment: "center",
      style: "meta",
      margin: [0, 8, 0, 0],
    },
  ].filter(Boolean);

  return {
    pageSize: { width, height: "auto" },
    pageMargins: [12, 10, 12, 10],
    content: [
      ...headerLines,
      ...customerLines,

      {
        table: {
          widths: ["*", 60],
          body: [
            [
              { text: "Item", style: "th" },
              { text: "Amount", style: "th", alignment: "right" },
            ],
            ...itemRows,
          ],
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0,
          hLineColor: () => "#cccccc",
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
      },

      ...totalsBlock,
    ],
    styles: {
      title: { fontSize: 12, bold: true },
      meta: { fontSize: 8 },
      th: { fontSize: 8, bold: true, margin: [0, 2, 0, 2] },
      itemName: { fontSize: 8, bold: true },
      itemSub: { fontSize: 7, color: "#555555" },
      itemAmt: { fontSize: 8, bold: true },
      totalRow: { fontSize: 9, bold: true },
    },
    defaultStyle: { fontSize: 8 },
  };

  function row2(label: string, value: string, strong = false) {
    return {
      columns: [
        { text: label, style: strong ? "totalRow" : "meta" },
        {
          text: value,
          style: strong ? "totalRow" : "meta",
          alignment: "right",
        },
      ],
      margin: [0, 2, 0, 0],
    };
  }
}

/* ============================================================
 * A4 Invoice Definition
 * ============================================================
 */
function buildA4DocDefinition(data: SaleInvoiceData) {
  const items = Array.isArray(data.items) ? data.items : [];
  const finance = data.finance ?? {};
  const customer = data.customer ?? {};

  const body = [
    [
      { text: "SL", style: "th" },
      { text: "Medicine", style: "th" },
      { text: "Batch", style: "th" },
      { text: "Exp", style: "th" },
      { text: "Qty", style: "th", alignment: "right" },
      { text: "Rate", style: "th", alignment: "right" },
      { text: "Disc%", style: "th", alignment: "right" },
      { text: "VAT%", style: "th", alignment: "right" },
      { text: "Total", style: "th", alignment: "right" },
    ],
  ];

  items.forEach((it, idx) => {
    const exp = it.stockSnapshot?.expiryDate
      ? fmtDateTime(it.stockSnapshot.expiryDate).split(",")[0]
      : "—";
    const total =
      it.lineTotal != null ? n(it.lineTotal) : n(it.qty) * n(it.rate);
    body.push([
      { text: String(idx + 1), style: "td" },
      {
        text: safeText(it.medicineSnapshot?.name),
        style: "td",
      },
      { text: safeText(it.stockSnapshot?.batchNo), style: "td" },
      { text: exp, style: "td" },
      { text: money(it.qty), style: "td", alignment: "right" },
      { text: money(it.rate), style: "td", alignment: "right" },
      { text: money(it.discountPct), style: "td", alignment: "right" },
      { text: money(it.vatPct), style: "td", alignment: "right" },
      { text: money(total), style: "td", alignment: "right" },
    ]);
  });

  return {
    pageSize: "A4",
    pageMargins: [28, 22, 28, 22],
    content: [
      {
        columns: [
          { text: "INVOICE", style: "h1" },
          {
            stack: [
              {
                text: `Invoice: ${safeText(data.invoiceNo)}`,
                alignment: "right",
              },
              {
                text: `Date: ${safeText(fmtDateTime(data.saleDate))}`,
                alignment: "right",
              },
              data.status
                ? {
                    text: `Status: ${safeText(data.status)}`,
                    alignment: "right",
                  }
                : null,
            ].filter(Boolean),
            style: "meta",
          },
        ],
      },

      { text: " ", margin: [0, 6, 0, 0] },

      {
        columns: [
          {
            width: "*",
            stack: [
              { text: "Bill To", style: "sec" },
              { text: `Name: ${safeText(customer.name)}`, style: "meta" },
              { text: `Phone: ${safeText(customer.contactNo)}`, style: "meta" },
              customer.address
                ? {
                    text: `Address: ${safeText(customer.address)}`,
                    style: "meta",
                  }
                : null,
              customer.field
                ? { text: `Field: ${safeText(customer.field)}`, style: "meta" }
                : null,
            ].filter(Boolean),
          },
          {
            width: "*",
            stack: [
              { text: "Patient Info", style: "sec" },
              {
                text: `Type: ${safeText(customer.patientType, "outdoor")}`,
                style: "meta",
              },
              customer.patientType === "indoor"
                ? { text: `Bed No: ${safeText(customer.bedNo)}`, style: "meta" }
                : null,
              customer.patientType === "indoor"
                ? {
                    text: `Indoor Bill No: ${safeText(customer.indoorBillNo)}`,
                    style: "meta",
                  }
                : null,
            ].filter(Boolean),
          },
        ],
        columnGap: 18,
      },

      { text: " ", margin: [0, 8, 0, 0] },

      {
        table: {
          headerRows: 1,
          widths: [22, "*", 48, 44, 32, 42, 36, 36, 55],
          body,
        },
        layout: "lightHorizontalLines",
      },

      { text: " ", margin: [0, 10, 0, 0] },

      {
        columns: [
          {
            width: "*",
            text: data.note ? `Note: ${safeText(data.note, "")}` : "",
            style: "meta",
          },
          {
            width: 220,
            table: {
              widths: ["*", 80],
              body: [
                ["Sub Total", money(finance.subTotal)],
                ["Line Discount", money(finance.lineDiscountTotal)],
                ["Extra Discount", money(finance.extraDiscount)],
                ["VAT", money(finance.vatTotal)],
                ["Adjustment", money(finance.adjustment)],
                [
                  { text: "NET PAYABLE", bold: true },
                  {
                    text: money(finance.netPayable),
                    bold: true,
                    alignment: "right",
                  },
                ],
                [
                  `Paid (${safeText(finance.paymentMethod, "cash")})`,
                  money(finance.paid),
                ],
                [
                  { text: "Due", bold: true },
                  { text: money(finance.due), bold: true, alignment: "right" },
                ],
              ],
            },
            layout: "lightHorizontalLines",
          },
        ],
        columnGap: 12,
      },
    ],
    styles: {
      h1: { fontSize: 16, bold: true },
      sec: { fontSize: 11, bold: true, margin: [0, 0, 0, 4] },
      meta: { fontSize: 9 },
      th: { fontSize: 9, bold: true },
      td: { fontSize: 9 },
    },
    defaultStyle: { fontSize: 9 },
  };
}
