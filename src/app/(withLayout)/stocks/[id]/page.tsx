"use client";
import { useParams } from "next/navigation";
import React from "react";

const MedicineStockView = () => {
  const { id } = useParams();
  console.log(id);

  return <div></div>;
};

export default MedicineStockView;
