import React from "react";
import {
  Panel,
  Stack,
  Tag,
  Divider,
  Loader,
  Placeholder,
  Table,
  Tooltip,
  Whisper,
  Button,
  ButtonToolbar,
} from "rsuite";
import {
  ReceiptText,
  User,
  Phone,
  Calendar,
  BadgeCheck,
  BadgeX,
  Package,
  CreditCard,
  ArrowLeft,
  Pencil,
  HandCoins,
  Printer,
  TrendingDown,
  TrendingUp,
  CircleDollarSign,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetSaleUpdateQuery,
  useLazyGetSaleUpdateQuery,
} from "@/redux/api/sales-final/sales.api";
import { SALES_PATH } from "./SalesTypes";
import { printInvoice } from "./SalesInvoicePrinter";

const { Column, HeaderCell, Cell } = Table;

/** =========================
 * Types (lightweight, aligned to your payload)
 * ========================= */
type SaleStatus = "posted" | "draft" | "void" | string;

export type SaleDocument = {
  _id: string;
  invoiceNo: string;
  saleDate: string;
  status: SaleStatus;
  currentVersion: number;
  current: {
    version: number;
    customer?: {
      mode: "registered" | "walkin" | string;
      customerRef?: {
        _id: string;
        fullName?: string | null;
        phone?: string | null;
        customerType?: string | null;
        uuid?: string | null;
      } | null;
      name?: string | null;
      address?: string | null;
      contactNo?: string | null;
      patientType?: string | null;
      bedNo?: string | null;
      indoorBillNo?: string | null;
    } | null;
    items: Array<{
      lineId: string;
      medicineSnapshot?: {
        medicineId?: string | null;
        name?: string | null;
        unit?: string | null;
      } | null;
      stockSnapshot?: {
        batchNo?: string | null;
        expiryDate?: string | null;
      } | null;
      qty: number;
      rate: number;
      discountPct?: number | null;
      vatPct?: number | null;
      lineTotal: number;
    }>;
    finance?: {
      paymentMethod?: string;
      extraDiscount?: number;
      paid?: number;
      subTotal?: number;
      vatTotal?: number;
      lineDiscountTotal?: number;
      adjustment?: number;
      netPayable?: number;
      due?: number;
    } | null;
    note?: string | null;
  };
};

/** =========================
 * Public Component
 * =========================
 * - White page background
 * - Beautiful header ("Sales View")
 * - Action buttons: Back, Update, Collect Due, Print
 * - Finance: discount red, vat green
 * ========================= */
export function SaleViewPage({
  currency = "৳",
  className = "",
  onBack,
  onUpdate,
  onCollectDue,
  onPrint,
}: {
  currency?: string;
  className?: string;

  onBack?: () => void;
  onUpdate?: (saleId: string) => void;
  onCollectDue?: (saleId: string) => void;
  onPrint?: (saleId: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    data: salesData,
    isLoading: salesDataLoading,
    isFetching: salesDataFetching,
  } = useGetSaleUpdateQuery(id as string, { skip: !id });

  const handlePdfPrinting = () => {
    try {
      if (salesData?.data?.length) {
        printInvoice(
          { ...salesData?.data[0], ...salesData?.data[0]?.current },
          "pos"
        );
      }
    } catch (error) {}
  };

  const isLoading = salesDataLoading || salesDataFetching;
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="mx-auto w-full  px-4 py-5">
        <SalesViewHeader
          invoiceNo={salesData?.data[0]?.invoiceNo}
          status={salesData?.data[0]?.status}
          isLoading={isLoading}
          onBack={() => router.push(SALES_PATH)}
          onUpdate={() => console.log("Updata")}
          onCollectDue={() => console.log("dueColleciotn")}
          onPrint={() => handlePdfPrinting()}
          disableActions={!salesData || isLoading}
        />

        <div className="mt-4">
          <SaleCompactViewCard
            sale={salesData?.data[0]}
            isLoading={isLoading}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
}

/** =========================
 * Header (top of the page)
 * ========================= */
function SalesViewHeader({
  invoiceNo,
  status,
  isLoading,
  disableActions,
  onBack,
  onUpdate,
  onCollectDue,
  onPrint,
}: {
  invoiceNo?: string;
  status?: string;
  isLoading: boolean;
  disableActions: boolean;
  onBack?: () => void;
  onUpdate?: () => void;
  onCollectDue?: () => void;
  onPrint?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ReceiptText size={18} className="text-slate-800" />
            <h1 className="text-lg font-semibold text-slate-900">Sales View</h1>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-800">
              {isLoading ? "Loading..." : invoiceNo || "—"}
            </span>
            {status ? <StatusTag status={status} /> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            appearance="subtle"
            onClick={onBack}
            disabled={!onBack}
            className="!rounded-full"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Back
            </span>
          </Button>

          <ButtonToolbar className="!m-0">
            <Button
              appearance="ghost"
              onClick={onUpdate}
              disabled={disableActions || !onUpdate}
              className="!rounded-full"
            >
              <span className="inline-flex items-center gap-2">
                <Pencil size={16} />
                Update
              </span>
            </Button>

            <Button
              appearance="primary"
              onClick={onCollectDue}
              disabled={disableActions || !onCollectDue}
              className="!rounded-full"
            >
              <span className="inline-flex items-center gap-2">
                <HandCoins size={16} />
                Collect Due
              </span>
            </Button>

            <Button
              appearance="default"
              onClick={onPrint}
              disabled={disableActions || !onPrint}
              className="!rounded-full"
            >
              <span className="inline-flex items-center gap-2">
                <Printer size={16} />
                Print
              </span>
            </Button>
          </ButtonToolbar>
        </div>
      </div>
    </div>
  );
}

/** =========================
 * Card (sale content)
 * ========================= */
function SaleCompactViewCard({
  sale,
  isLoading,
  currency = "৳",
}: {
  sale?: SaleDocument | null;
  isLoading: boolean;
  currency?: string;
}) {
  if (isLoading) return <SaleCompactViewLoading />;

  if (!sale) {
    return (
      <Panel bordered className="rounded-2xl bg-white">
        <div className="text-sm text-slate-600">No sale data available.</div>
      </Panel>
    );
  }

  const customer = sale.current.customer;
  const finance = sale.current.finance;

  const customerName =
    customer?.mode === "registered"
      ? customer?.customerRef?.fullName ||
        customer?.name ||
        "Registered Customer"
      : customer?.name || "Walk-in Customer";

  const customerPhone =
    customer?.mode === "registered"
      ? customer?.customerRef?.phone || customer?.contactNo || ""
      : customer?.contactNo || "";

  return (
    <Panel bordered className="rounded-2xl bg-white">
      <div className="flex flex-col gap-3">
        <SaleMetaRow
          invoiceNo={sale.invoiceNo}
          status={sale.status}
          saleDate={sale.saleDate}
          version={sale.currentVersion}
        />

        <Divider className="!my-0" />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <CustomerBlock
              mode={customer?.mode}
              name={customerName}
              phone={customerPhone}
              address={customer?.address}
              patientType={customer?.patientType}
              bedNo={customer?.bedNo}
              indoorBillNo={customer?.indoorBillNo}
            />
          </div>

          <div className="lg:col-span-7">
            <FinanceBlock finance={finance} currency={currency} />
          </div>
        </div>

        <Divider className="!my-0" />

        <ItemsBlock items={sale.current.items} currency={currency} />

        {sale.current.note ? (
          <>
            <Divider className="!my-0" />
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-xs font-semibold text-slate-500">NOTE</div>
              <div className="mt-1 text-sm text-slate-700">
                {sale.current.note}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Panel>
  );
}

/** =========================
 * Sale meta row
 * ========================= */
function SaleMetaRow({
  invoiceNo,
  status,
  saleDate,
  version,
}: {
  invoiceNo: string;
  status: string;
  saleDate: string;
  version: number;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <Stack spacing={10} alignItems="flex-start">
        <div className="mt-0.5">
          <ReceiptText size={18} className="text-slate-700" />
        </div>

        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-900">
            {invoiceNo}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} />
              {formatDateTime(saleDate)}
            </span>
            <span>•</span>
            <span>v{version}</span>
          </div>
        </div>
      </Stack>

      <StatusTag status={status} />
    </div>
  );
}

function StatusTag({ status }: { status: string }) {
  const s = String(status || "").toLowerCase();
  const ok = s === "posted";
  const bad = s === "void";

  return (
    <Tag
      className="!rounded-full !px-3 !py-1"
      color={ok ? "green" : bad ? "red" : "orange"}
    >
      <span className="inline-flex items-center gap-1 capitalize">
        {ok ? <BadgeCheck size={14} /> : bad ? <BadgeX size={14} /> : null}
        {s || "unknown"}
      </span>
    </Tag>
  );
}

/** =========================
 * Customer
 * ========================= */
function CustomerBlock({
  mode,
  name,
  phone,
  address,
  patientType,
  bedNo,
  indoorBillNo,
}: {
  mode?: string;
  name: string;
  phone?: string;
  address?: string | null;
  patientType?: string | null;
  bedNo?: string | null;
  indoorBillNo?: string | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500">CUSTOMER</div>
        <Tag className="!rounded-full" color="blue">
          {mode || "—"}
        </Tag>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex items-start gap-2">
          <User size={16} className="mt-0.5 text-slate-600" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">
              {name}
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-500">
              {address || "—"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MiniField
            icon={<Phone size={14} className="text-slate-600" />}
            label="Phone"
            value={phone || "—"}
          />
          <MiniField label="Patient Type" value={patientType || "—"} />
          <MiniField label="Bed No" value={bedNo || "—"} />
          <MiniField label="Indoor Bill" value={indoorBillNo || "—"} />
        </div>
      </div>
    </div>
  );
}

/** =========================
 * Finance (more visual)
 * - Discounts: red
 * - VAT: green
 * ========================= */
function FinanceBlock({
  finance,
  currency,
}: {
  finance?: SaleDocument["current"]["finance"] | null;
  currency: string;
}) {
  const pm = finance?.paymentMethod || "—";

  const subTotal = finance?.subTotal ?? 0;
  const lineDiscount = finance?.lineDiscountTotal ?? 0;
  const vatTotal = finance?.vatTotal ?? 0;
  const adjustment = finance?.adjustment ?? 0;
  const netPayable = finance?.netPayable ?? 0;
  const paid = finance?.paid ?? 0;
  const due = finance?.due ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500">FINANCE</div>

        <Tag className="!rounded-full" color="violet">
          <span className="inline-flex items-center gap-1 capitalize">
            <CreditCard size={14} />
            {pm}
          </span>
        </Tag>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MoneyField
          label="Sub Total"
          value={subTotal}
          currency={currency}
          icon={<CircleDollarSign size={14} className="text-slate-600" />}
        />

        <MoneyField
          label="Discount"
          value={lineDiscount}
          currency={currency}
          tone="down" // red
          icon={<TrendingDown size={14} className="text-red-600" />}
        />

        <MoneyField
          label="VAT (Add)"
          value={vatTotal}
          currency={currency}
          tone="up" // green
          icon={<TrendingUp size={14} className="text-green-600" />}
        />

        <MoneyField
          label="Adjustment"
          value={adjustment}
          currency={currency}
          icon={<CircleDollarSign size={14} className="text-slate-600" />}
        />
      </div>

      <Divider className="!my-3" />

      <div className="grid grid-cols-3 gap-2">
        <MoneyField
          label="Net Payable"
          value={netPayable}
          currency={currency}
          strong
        />
        <MoneyField label="Paid" value={paid} currency={currency} />
        <MoneyField label="Due" value={due} currency={currency} strong />
      </div>

      <div className="mt-2 text-[11px] text-slate-500">
        <span className="text-red-600 font-semibold">Red</span> = money reduced
        (discount) • <span className="text-green-600 font-semibold">Green</span>{" "}
        = money added (VAT)
      </div>
    </div>
  );
}

/** =========================
 * Items
 * ========================= */
function ItemsBlock({
  items,
  currency,
}: {
  items: SaleDocument["current"]["items"];
  currency: string;
}) {
  const tableData = (items || []).map((it) => ({
    ...it,
    medicineName: it.medicineSnapshot?.name ?? "—",
    medicineId: it.medicineSnapshot?.medicineId ?? "—",
    unit: it.medicineSnapshot?.unit ?? "—",
    batchNo: it.stockSnapshot?.batchNo ?? "—",
    expiryDate: it.stockSnapshot?.expiryDate ?? null,
  }));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500">
          ITEMS ({items?.length || 0})
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <Table
          data={tableData}
          height={Math.min(360, 56 + tableData.length * 52)}
          rowHeight={52}
          headerHeight={42}
          bordered={false}
          cellBordered={false}
          className="!text-sm"
        >
          <Column flexGrow={2} minWidth={240} verticalAlign="middle">
            <HeaderCell>Medicine</HeaderCell>
            <Cell>
              {(rowData: any) => (
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-900">
                    {rowData.medicineName}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-slate-500">
                    ID: {rowData.medicineId} • Unit: {rowData.unit}
                  </div>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={120} verticalAlign="middle">
            <HeaderCell>Batch</HeaderCell>
            <Cell>
              {(rowData: any) => (
                <div className="text-slate-700">
                  <div className="font-medium">{rowData.batchNo}</div>
                  <div className="text-xs text-slate-500">
                    {rowData.expiryDate ? (
                      <Whisper
                        placement="top"
                        speaker={
                          <Tooltip>
                            Expiry: {formatDate(rowData.expiryDate)}
                          </Tooltip>
                        }
                      >
                        <span className="cursor-help">Expiry</span>
                      </Whisper>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={70} align="right" verticalAlign="middle">
            <HeaderCell>Qty</HeaderCell>
            <Cell dataKey="qty" />
          </Column>

          <Column width={90} align="right" verticalAlign="middle">
            <HeaderCell>Rate</HeaderCell>
            <Cell>
              {(rowData: any) => <span>{money(rowData.rate, currency)}</span>}
            </Cell>
          </Column>

          <Column width={80} align="right" verticalAlign="middle">
            <HeaderCell>Disc%</HeaderCell>
            <Cell>
              {(rowData: any) => <span>{safeNum(rowData.discountPct)}</span>}
            </Cell>
          </Column>

          <Column width={100} align="right" verticalAlign="middle">
            <HeaderCell>Total</HeaderCell>
            <Cell>
              {(rowData: any) => (
                <span className="font-semibold text-slate-900">
                  {money(rowData.lineTotal, currency)}
                </span>
              )}
            </Cell>
          </Column>
        </Table>

        {tableData.length === 0 ? (
          <div className="p-3 text-sm text-slate-600">No items.</div>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <Package size={14} />
        <span>
          Line items are rendered from the server snapshot (medicine/stock).
        </span>
      </div>
    </div>
  );
}

/** =========================
 * Loading
 * ========================= */
function SaleCompactViewLoading() {
  return (
    <Panel bordered className="rounded-2xl bg-white">
      <div className="flex flex-col gap-3">
        <Stack justifyContent="space-between" alignItems="center">
          <Stack spacing={10} alignItems="center">
            <ReceiptText size={18} className="text-slate-300" />
            <div>
              <Placeholder.Paragraph
                rows={1}
                style={{ marginBottom: 6, width: 220 }}
              />
              <Placeholder.Paragraph
                rows={1}
                style={{ marginBottom: 0, width: 160 }}
              />
            </div>
          </Stack>
          <Loader size="sm" />
        </Stack>

        <Divider className="!my-0" />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-3">
            <Placeholder.Paragraph rows={3} />
          </div>
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-3">
            <Placeholder.Paragraph rows={3} />
          </div>
        </div>

        <Divider className="!my-0" />

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-semibold text-slate-500 mb-2">ITEMS</div>
          <Placeholder.Paragraph rows={4} />
        </div>
      </div>
    </Panel>
  );
}

/** =========================
 * Small blocks
 * ========================= */
function MiniField({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 truncate text-xs font-medium text-slate-900">
        {value}
      </div>
    </div>
  );
}

function MoneyField({
  label,
  value,
  currency,
  strong,
  tone,
  icon,
}: {
  label: string;
  value?: number | null;
  currency: string;
  strong?: boolean;
  tone?: "down" | "up";
  icon?: React.ReactNode;
}) {
  const toneCls =
    tone === "down"
      ? "border-red-200 bg-red-50"
      : tone === "up"
      ? "border-green-200 bg-green-50"
      : "border-slate-200 bg-slate-50";

  const valueCls =
    tone === "down"
      ? "text-red-700"
      : tone === "up"
      ? "text-green-700"
      : "text-slate-900";

  return (
    <div className={`rounded-lg border p-2 ${toneCls}`}>
      <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <div
        className={`mt-0.5 truncate text-xs ${
          strong ? "font-semibold" : "font-medium"
        } ${valueCls}`}
      >
        {money(value ?? 0, currency)}
      </div>
    </div>
  );
}

/** =========================
 * Helpers
 * ========================= */
function formatDateTime(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function money(n: number, currency: string) {
  const v = Number.isFinite(n) ? n : 0;
  return `${currency}${v.toFixed(2)}`;
}

function safeNum(n?: number | null) {
  if (n === null || n === undefined) return "—";
  return Number.isFinite(n) ? String(n) : "0";
}
