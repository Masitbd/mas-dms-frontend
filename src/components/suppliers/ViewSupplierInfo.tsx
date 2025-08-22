import React from "react";
import {
  Building2,
  Hash,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  CalendarClock,
  FileQuestion,
  Settings,
} from "lucide-react";
import { Button } from "rsuite";
import { useRouter } from "next/navigation";

// ----- Types -----
export type Supplier = {
  _id?: { $oid?: string } | string;
  supplierId?: string;
  name?: string;
  contactPerson?: string;
  address?: string;
  phone?: string;
  fax?: string;
  city?: string;
  country?: string;
  email?: string;
  createdAt?: { $date?: string } | string;
  updatedAt?: { $date?: string } | string;
  __v?: number;
};

// ----- Utilities -----
const toDateString = (d?: { $date?: string } | string) => {
  const raw = typeof d === "string" ? d : d?.$date;
  if (!raw) return undefined;
  const date = new Date(raw);
  if (isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const val = (v?: string | number | null) =>
  v === undefined || v === null || String(v).trim() === ""
    ? "N/A"
    : String(v).trim();

// Small, reusable info row
function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value?: string | number | null;
  href?: string;
}) {
  const content = (
    <div className="flex min-w-0 items-center gap-3">
      <Icon className="h-4 w-4 flex-none text-gray-500" aria-hidden />
      <div className="flex min-w-0 flex-col">
        <span className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <span className="truncate text-sm font-medium text-gray-900">
          {val(value)}
        </span>
      </div>
    </div>
  );
  return href ? (
    <a
      href={href}
      className="transition-opacity hover:opacity-80"
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    content
  );
}

function NoDataFullPage() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-8">
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 p-6 text-gray-500">
        <FileQuestion className="h-5 w-5" aria-hidden />
        <span className="text-sm">No data found</span>
      </div>
    </main>
  );
}

// ----- Main: single-record, full-page layout (Tailwind + lucide-react only) -----
export default function SupplierProfile({
  data,
  className,
}: {
  data?: Supplier | null;
  className?: string;
}) {
  if (!data) return <NoDataFullPage />;

  const name = data.name?.trim() || "Unnamed Supplier";
  const created = toDateString(data.createdAt);
  const updated = toDateString(data.updatedAt);
  const supplierId = val(data.supplierId);
  const oid = typeof data._id === "string" ? data._id : data._id?.$oid;
  const fullAddress = [data.address, data.city, data.country]
    .filter(Boolean)
    .join(", ");

  const router = useRouter();
  return (
    <main
      className={
        " flex items-center justify-center h-[80vh] " + (className ?? "")
      }
    >
      {/* Header / Hero */}
      <div className=" w-4xl">
        <div className="min-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">
                  Supplier Management
                </h1>
                <p className="text-gray-600 text-sm m-0">
                  Supplier Information
                </p>
              </div>
            </div>
          </div>
        </div>
        <section className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-transparent to-emerald-50" />
          <div className="relative mx-auto max-w-4xl px-6 pt-12 pb-8">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-100/70">
                <Building2 className="h-7 w-7 text-sky-600" aria-hidden />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold leading-snug text-gray-900">
                  {name}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-gray-700">
                    <Hash className="h-3.5 w-3.5 text-gray-500" aria-hidden />
                    <span className="font-medium">{supplierId}</span>
                  </span>
                  {oid && (
                    <span className="truncate text-xs text-gray-500">
                      ID: {oid}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="mx-auto max-w-4xl px-6 pb-12  bg-white rounded-lg shadow-sm border border-gray-200 pt-3">
          <div className="grid gap-6 md:grid-cols-2 ">
            <InfoRow
              icon={User}
              label="Contact Person"
              value={data.contactPerson}
            />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={data.phone}
              href={data.phone ? `tel:${data.phone}` : undefined}
            />

            <InfoRow
              icon={Mail}
              label="Email"
              value={data.email}
              href={data.email ? `mailto:${data.email}` : undefined}
            />
            <InfoRow icon={Globe} label="Country" value={data.country} />

            <InfoRow icon={MapPin} label="City" value={data.city} />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={fullAddress || data.address}
            />

            {/* Optional fields */}
            <InfoRow icon={Phone} label="Fax" value={data.fax} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarClock className="h-4 w-4" aria-hidden />
              <span>Created:</span>
              <span className="font-medium text-gray-900">
                {created ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarClock className="h-4 w-4" aria-hidden />
              <span>Updated:</span>
              <span className="font-medium text-gray-900">
                {updated ?? "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-3 flex justify-end items-end">
            <Button
              appearance="primary"
              color="red"
              onClick={() => router.push("/supplier")}
            >
              Back
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
