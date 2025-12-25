/* ============================================================
 * 7) CUSTOMER MODE TOGGLE
 * ============================================================
 */

import { Button, ButtonGroup } from "rsuite";
import { CustomerMode } from "./SalesTypes";
import { UserCheck, UserX } from "lucide-react";

export function CustomerModeToggle({
  mode,
  onChange,
}: {
  mode: CustomerMode;
  onChange: (next: CustomerMode) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm font-medium text-slate-800">Customer Type</div>

      <ButtonGroup>
        <Button
          appearance={mode === "unregistered" ? "primary" : "ghost"}
          size="sm"
          onClick={() => onChange("unregistered")}
        >
          <span className="inline-flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Unregistered
          </span>
        </Button>

        <Button
          appearance={mode === "registered" ? "primary" : "ghost"}
          size="sm"
          onClick={() => onChange("registered")}
        >
          <span className="inline-flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Registered
          </span>
        </Button>
      </ButtonGroup>
    </div>
  );
}
