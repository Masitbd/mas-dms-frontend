import { useEffect, useMemo, useState } from "react";
import {
  CustomerDetailsModuleProps,
  CustomerInfo,
  CustomerMode,
} from "./SalesTypes";
import { RotateCcw, User, Wand2 } from "lucide-react";
import { Button, ButtonGroup, Divider, Message, Panel } from "rsuite";
import { CustomerModeToggle } from "./CustomerModeToggle";
import { RegisteredCustomerSearch } from "./RegisteredCustomerSearch";
import { CustomerInfoForm } from "./CustomerInfoForm";
import { useLazyGetSingleCustomerQuery } from "@/redux/api/customer/customer.api";

export function CustomerDetailsModule({
  mode,
  onModeChange,
  customer,
  onCustomerChange,
  blankCustomer,
  updateDefaults,
}: // fetchRegisteredCustomer,
CustomerDetailsModuleProps) {
  const [selectedRegisteredId, setSelectedRegisteredId] = useState<
    string | null
  >(customer.customerId ?? null);
  const [info, setInfo] = useState<{ type: "none" | "error"; text?: string }>({
    type: "none",
  });

  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    setSelectedRegisteredId(customer.customerId ?? null);
  }, [customer.customerId]);

  const header = useMemo(() => {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-white">
            <User className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">
              Customer Details
            </div>
            <div className="text-xs text-slate-500">
              Registered search or unregistered manual entry
            </div>
          </div>
        </div>

        {/* <ButtonGroup>
          {updateDefaults ? (
            <Button
              appearance="ghost"
              size="sm"
              onClick={() => {
                setInfo({ type: "none" });
                setSelectedRegisteredId(null);
                onCustomerChange(updateDefaults);
                setSyncKey((k) => k + 1);
              }}
            >
              <span className="inline-flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Load Defaults
              </span>
            </Button>
          ) : null}

          <Button
            appearance="ghost"
            size="sm"
            onClick={() => {
              setInfo({ type: "none" });
              setSelectedRegisteredId(null);
              onCustomerChange(blankCustomer);
              onModeChange("unregistered");
              setSyncKey((k) => k + 1);
            }}
          >
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </span>
          </Button>
        </ButtonGroup> */}
      </div>
    );
  }, [blankCustomer, onCustomerChange, onModeChange, updateDefaults]);

  const handleModeChange = (next: CustomerMode) => {
    setInfo({ type: "none" });
    onModeChange(next);

    if (next === "unregistered") {
      setSelectedRegisteredId(null);
      onCustomerChange(blankCustomer);
      setSyncKey((k) => k + 1);
    } else {
      setSelectedRegisteredId(null);
      onCustomerChange({
        ...blankCustomer,
        patientType: customer.patientType ?? "outdoor",
      });
      setSyncKey((k) => k + 1);
    }
  };

  // fetching and setting registered customer
  const [fetchRegisteredCustomer, { isLoading: registeredCustomerLoading }] =
    useLazyGetSingleCustomerQuery();

  const handlePickRegistered = async (customerId: string) => {
    setInfo({ type: "none" });
    setSelectedRegisteredId(customerId);

    const fetched = await fetchRegisteredCustomer(customerId).unwrap();
    if (!fetched) {
      setInfo({ type: "error", text: "Customer not found. Please try again." });
      return;
    }

    const next: CustomerInfo = {
      ...fetched?.data,
      patientType: customer.patientType ?? fetched.patientType ?? "outdoor",
    };

    onCustomerChange(next);
    setSyncKey((k) => k + 1);
  };

  return (
    <Panel
      bordered
      className="min-h-[260px] w-full overflow-auto rounded-2xl border-slate-200 bg-white"
      header={header}
    >
      {info.type === "error" ? (
        <div className="mb-3">
          <Message
            type="error"
            closable
            onClose={() => setInfo({ type: "none" })}
          >
            {info.text}
          </Message>
        </div>
      ) : null}

      <CustomerModeToggle mode={mode} onChange={handleModeChange} />

      {mode === "registered" ? (
        <div className="mt-3">
          <RegisteredCustomerSearch
            value={selectedRegisteredId}
            onChange={async (val) => {
              if (!val) {
                setSelectedRegisteredId(null);
                onCustomerChange({
                  ...blankCustomer,
                  patientType: customer.patientType ?? "outdoor",
                });
                setSyncKey((k) => k + 1);
                return;
              }
              await handlePickRegistered(val);
            }}
          />
        </div>
      ) : null}

      <Divider className="my-3" />

      <CustomerInfoForm
        mode={mode}
        value={customer}
        onChange={onCustomerChange}
        syncKey={syncKey}
      />
    </Panel>
  );
}
