"use client";
import { PurchaseInterface } from "@/components/medicine-purchese/PurcheseInterface";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useSearchParams } from "next/navigation";
import React from "react";

const NewPurchase = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");
  return (
    <div>
      <PurchaseInterface id={id ?? ""} mode={mode ?? ENUM_MODE.NEW} />
    </div>
  );
};

export default NewPurchase;
