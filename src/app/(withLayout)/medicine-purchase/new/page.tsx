"use client";
import { PurchaseInterface } from "@/components/medicine-purchese/PurcheseInterface";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const NewPurchase = () => {
  const { id, mode } = useParams();

  return (
    <div>
      <PurchaseInterface
        id={(id ?? "") as string}
        mode={(mode ?? ENUM_MODE.NEW) as string}
      />
    </div>
  );
};

export default NewPurchase;
