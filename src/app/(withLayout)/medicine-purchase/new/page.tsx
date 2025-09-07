"use client";
import Loading from "@/app/Loading";
import { PurchaseInterface } from "@/components/medicine-purchese/PurcheseInterface";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useParams, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const NewPurchase = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <PurchaseInterface />
      </Suspense>
    </div>
  );
};

export default NewPurchase;
