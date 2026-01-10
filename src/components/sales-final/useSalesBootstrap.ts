"use client";

import { useEffect } from "react";
import {
  hydrateDraft,
  resetDraft,
  setMeta,
} from "@/redux/features/sales/salesDraftSlice";

// ✅ adjust to your real sales API slice

import { useAppDispatch } from "@/lib/hooks";
import { useLazyGetSingleSaleQuery } from "@/redux/api/sales-final/sales.api";

export function useSalesBootstrap(
  mode: "create" | "edit",
  saleId: string | null
) {
  const dispatch = useAppDispatch();

  const [getSaleById] = useLazyGetSingleSaleQuery();

  useEffect(() => {
    let alive = true;

    (async () => {
      if (mode === "create") {
        dispatch(resetDraft());
        dispatch(
          setMeta({
            mode: "create",
            saleId: null,
            status: "ready",
            error: null,
          })
        );
        return;
      }

      // edit mode requires saleId
      if (!saleId) {
        dispatch(
          setMeta({
            mode: "edit",
            saleId: null,
            status: "error",
            error: "Missing saleId for edit mode.",
          })
        );
        return;
      }

      dispatch(
        setMeta({ mode: "edit", saleId, status: "loading", error: null })
      );

      try {
        const data = await getSaleById(saleId).unwrap();

        if (!alive) return;

        // ✅ data must match this shape (map server->draft here if needed)
        dispatch(
          hydrateDraft({
            saleId,
            customerMode: data.customerMode,
            customer: data.customer,
            lines: data.lines,
            finance: data.finance,
          })
        );
      } catch (e: any) {
        if (!alive) return;
        dispatch(
          setMeta({
            status: "error",
            error: e?.message ?? "Failed to load sale.",
          })
        );
      }
    })();

    return () => {
      alive = false;
    };
  }, [mode, saleId, dispatch, getSaleById]);
}
