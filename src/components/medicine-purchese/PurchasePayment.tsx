import React, { useState } from "react";
import PurchasePaymentHistory, {
  PurchasePayment as PurchasePaymentType,
} from "./PurchasePaymentTable";
import { CollectPurchasePaymentModal } from "./PurchasePaymentModal";
import { Purchase } from "./MedicinePurcheseTypes";
import {
  useGetPurchasePaymentsQuery,
  useGetSinglePurchasePaymentQuery,
} from "@/redux/api/purchasePayment/purchasePayment.api";

const PurchasePayment = ({ purchaseData }: { purchaseData: Purchase }) => {
  const {
    isLoading: purchasePaymentDataLaoding,
    data: PurchasePaymentData,
    isFetching: paymentDataFetching,
  } = useGetSinglePurchasePaymentQuery(purchaseData?._id, {
    skip: !purchaseData?._id,
  });

  return (
    <div>
      <PurchasePaymentHistory
        data={PurchasePaymentData?.data as unknown as PurchasePaymentType[]}
        purchaseData={purchaseData}
        isLoading={purchasePaymentDataLaoding || paymentDataFetching}
      />
    </div>
  );
};

export default PurchasePayment;
