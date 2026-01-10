"use client";
import Loading from "@/app/Loading";
import { SaleViewPage } from "@/components/sales-v2/Salesview";
import React, { Suspense } from "react";

const SalesView = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <SaleViewPage />
      </Suspense>
    </div>
  );
};

export default SalesView;
