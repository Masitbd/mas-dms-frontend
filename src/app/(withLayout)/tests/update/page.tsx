"use client";
import Loading from "@/app/Loading";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import SalesPage from "../new/page";

const SalesUpdate = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");

  return (
    <div>
      <SalesPage params={{ id: id as string, mode: mode as string }} />
    </div>
  );
};

const MainComponent = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SalesUpdate />
    </Suspense>
  );
};

export default MainComponent;
