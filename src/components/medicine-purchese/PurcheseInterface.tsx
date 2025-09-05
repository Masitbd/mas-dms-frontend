import React, { FormEvent, useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { Form, Button, Divider, Message, useToaster } from "rsuite";
import { ItemDetailsForm, PurchaseDetailItem } from "./ItemDetails";
import { PurchaseHeaderData, PurchaseHeaderForm } from "./PurchaseHeader";
import { TaxDiscountData, TaxDiscountForm } from "./TaxDiscount";
import { ItemsTable } from "./ItemsTable";
import Bottom from "./Bottom";
import {
  useCreatePurchaseMutation,
  useLazyGetPurchaseItemsForSinglePurchaseQuery,
  useLazyGetSinglePurchasesQuery,
  useUpdatePurchasesMutation,
} from "@/redux/api/purchase/purchase.api";
import { useRouter } from "next/navigation";
import { ENUM_MODE } from "@/enums/EnumMode";
import { defaultValues, useValueChange } from "./MedicinePurcheseTypes";
import Loading from "../layout/Loading";
interface CombinedPurchaseData extends PurchaseHeaderData, TaxDiscountData {}
type FormSubmitter = (
  formValue: Record<string, any> | null,
  event?: FormEvent<HTMLFormElement>
) => void;
export const PurchaseInterface = ({
  id,
  mode,
}: {
  id: string;
  mode: string;
}) => {
  const [editingItem, setEditingItem] = useState<PurchaseDetailItem | null>(
    null
  );
  const [purchaseItems, setPurchaseItems] = useState<PurchaseDetailItem[]>([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const toaster = useToaster();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CombinedPurchaseData>({
    defaultValues: defaultValues,
  });

  const totalAmount = watch("totalAmount");
  const vatPercentage = watch("vatPercentage");
  const discountPercentage = watch("discountPercentage");

  // Auto-calculate total amount from purchase items
  React.useEffect(() => {
    const totalFromItems = purchaseItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    if (totalFromItems > 0) {
      setValue("totalAmount", Number(totalFromItems.toFixed(2)));
    }

    if (purchaseItems && purchaseItems?.length) {
      let totalAmountWithoutItemDiscount = 0; // for overall discount %
      let itemWiseDiscount = 0; // sum of per-item discounts

      purchaseItems.forEach((p) => {
        const qty = Number(p?.quantity ?? 0);
        const rate = Number(p?.purchaseRate ?? 0);
        const amt = Number(p?.amount ?? rate * qty);
        const itemDiscountPct = Number(p?.discount ?? 0);
        const hasItemDiscount = itemDiscountPct > 0;

        if (hasItemDiscount) {
          // per-item discount
          const totalPrice = rate * qty;
          itemWiseDiscount += (totalPrice * itemDiscountPct) / 100;
        } else {
          // eligible for overall discount
          totalAmountWithoutItemDiscount += amt;
        }
      });

      const overallPct = Number(discountPercentage ?? 0); // treat missing as 0%
      const overallDiscount =
        (totalAmountWithoutItemDiscount * overallPct) / 100;

      const discountAmount = Number(
        (itemWiseDiscount + overallDiscount).toFixed(2)
      );
      setValue("discountAmount", discountAmount);
    }
    // Vat calculation
    if (purchaseItems && purchaseItems?.length) {
      let baseWithoutItemVAT = 0; // will get overall VAT%
      let itemWiseVAT = 0; // sum of per-item VATs

      purchaseItems.forEach((p) => {
        const qty = Number(p?.quantity ?? 0);
        const rate = Number(p?.purchaseRate ?? 0);
        const base = Number(p?.amount ?? rate * qty);
        const itemVatPct = Number(p?.vat ?? 0);
        const hasItemVAT = itemVatPct > 0;

        if (hasItemVAT) {
          itemWiseVAT += (base * itemVatPct) / 100;
        } else {
          baseWithoutItemVAT += base;
        }
      });

      const overallVatPct = Number(vatPercentage ?? 0); // treat missing as 0%
      const overallVAT = (baseWithoutItemVAT * overallVatPct) / 100;

      setValue("vatAmount", Number((itemWiseVAT + overallVAT).toFixed(2)));
    }
  }, [purchaseItems, discountPercentage, vatPercentage]);

  // Submission
  const router = useRouter();
  const [postData, { isLoading: postLoading }] = useCreatePurchaseMutation();
  const [updatePurchase, { isLoading: updateLoading }] =
    useUpdatePurchasesMutation();
  const onSubmit = async (data: CombinedPurchaseData) => {
    if (purchaseItems.length === 0) {
      toaster.push(
        <Message type="warning" showIcon>
          Please add at least one item to the purchase
        </Message>,
        { placement: "topCenter" }
      );
      return;
    }

    const submissionData = {
      ...data,
      purchaseItems,
      finalAmount: data.totalAmount + data.vatAmount - data.discountAmount,
    };

    let result;
    if (mode == ENUM_MODE?.UPDATE) {
      result = await updatePurchase({ id, data: submissionData }).unwrap();
    } else {
      result = await postData(submissionData).unwrap();
      console.log("hi");
    }

    if (result?.success) {
      toaster.push(
        <Message type="success" showIcon>
          Purchase saved successfully!
        </Message>,
        { placement: "topCenter" }
      );
      router.push("/medicine-purchase");
    }
  };

  const handleAddItem = (item: Omit<PurchaseDetailItem, "id">) => {
    const newItem: PurchaseDetailItem = {
      ...item,
      id: Date.now().toString(),
    };
    setPurchaseItems((prev) => [...prev, newItem]);

    toaster.push(
      <Message type="success" showIcon>
        Item added successfully!
      </Message>,
      { placement: "topCenter" }
    );
  };

  const handleEditItem = (item: PurchaseDetailItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleUpdateItem = (
    id: string,
    updatedItem: Omit<PurchaseDetailItem, "id">
  ) => {
    setPurchaseItems((prev) =>
      prev.map((item) => (item.id === id ? { ...updatedItem, id } : item))
    );

    setEditingItem(null);

    toaster.push(
      <Message type="success" showIcon>
        Item updated successfully!
      </Message>,
      { placement: "topCenter" }
    );
  };

  const handleDeleteItem = (id: string) => {
    setPurchaseItems((prev) => prev.filter((item) => item.id !== id));

    toaster.push(
      <Message type="info" showIcon>
        Item removed from purchase
      </Message>,
      { placement: "topCenter" }
    );
  };

  const handleReset = () => {
    reset();
    setPurchaseItems([]);

    toaster.push(
      <Message type="info" showIcon>
        Form reset successfully
      </Message>,
      { placement: "topCenter" }
    );
  };

  // Handle if update
  const [
    getPurchaseDetails,
    { isLoading: purchaseLoading, isFetching: purchaseFetching },
  ] = useLazyGetSinglePurchasesQuery();

  const [getItems, { isLoading: itemsLoading, isFetching: itemsFetching }] =
    useLazyGetPurchaseItemsForSinglePurchaseQuery();

  useEffect(() => {
    if (mode == ENUM_MODE.UPDATE && id) {
      (async function () {
        const result = await getPurchaseDetails(id).unwrap();
        const items = await getItems(id).unwrap();
        if (result?.data) {
          reset({
            ...result?.data,
            purchaseDate: new Date(result?.data?.purchaseDate),
          });

          if (items?.data) {
            setPurchaseItems(items?.data);
          }
        }
      })();
    }
  }, [id, mode]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 relative">
      <div className=" mx-auto space-y-6">
        <Loading
          loading={
            purchaseLoading ||
            itemsLoading ||
            purchaseFetching ||
            itemsFetching ||
            postLoading ||
            updateLoading
          }
        />
        <Form
          onSubmit={handleSubmit(onSubmit) as unknown as FormSubmitter}
          fluid
          id="test111"
        >
          {/* Purchase Header Form */}
          <PurchaseHeaderForm
            control={control as unknown as Control<PurchaseHeaderData>}
            errors={errors}
            totalAmountReadOnly={purchaseItems.length > 0}
          />

          {/* Tax & Discount Form */}
          <TaxDiscountForm
            control={control as unknown as Control<TaxDiscountData>}
            errors={errors}
          />
        </Form>

        {/* Items Table */}
        <ItemsTable
          items={purchaseItems}
          onAddItem={() => setIsItemModalOpen(true)}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
        />

        {/* Item Details Modal */}
        <ItemDetailsForm
          open={isItemModalOpen}
          onClose={() => setIsItemModalOpen(false)}
          onAdd={handleAddItem}
          onEdit={handleUpdateItem}
          editItem={editingItem}
        />
        <Bottom watch={watch} />
      </div>
    </div>
  );
};
