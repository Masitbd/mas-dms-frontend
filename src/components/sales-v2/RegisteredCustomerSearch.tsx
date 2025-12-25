import { useState } from "react";
import { CustomerSearchOption } from "./SalesTypes";
import { Button, InputPicker } from "rsuite";
import { Search, X } from "lucide-react";

export function RegisteredCustomerSearch({
  value,
  onChange,
  searchRegisteredCustomers,
}: {
  value: string | null;
  onChange: (customerId: string | null) => void;
  searchRegisteredCustomers: (query: string) => Promise<CustomerSearchOption[]>;
}) {
  const [data, setData] = useState<CustomerSearchOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchRegisteredCustomers(query);
      setData(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="mb-1 text-xs font-medium text-slate-600">
          Search Registered Customer
        </div>

        <InputPicker
          block
          searchable
          cleanable={false}
          placeholder="Search by name or phone..."
          data={data}
          value={value ?? undefined}
          onSearch={handleSearch}
          onChange={(val) => onChange(val ? String(val) : null)}
          loading={loading}
          className="rounded-xl"
          renderExtraFooter={() => (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
              <Search className="h-4 w-4" />
              {loading ? "Searching…" : "Type to search"}
            </div>
          )}
        />
      </div>

      <div className="mt-5">
        <Button
          appearance="ghost"
          size="sm"
          onClick={() => onChange(null)}
          title="Clear selection"
        >
          <span className="inline-flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear
          </span>
        </Button>
      </div>
    </div>
  );
}
