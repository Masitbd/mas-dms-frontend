import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Divider, Message, useToaster } from "rsuite";
// import {
//   PurchaseHeaderForm,
//   PurchaseHeaderData,
// } from "./forms/PurchaseHeaderForm";
// import { TaxDiscountForm, TaxDiscountData } from "./forms/TaxDiscountForm";
// import { ItemDetailsForm, PurchaseDetailItem } from "./forms/ItemDetailsForm";
// import { ItemsTable } from "./tables/ItemsTable";
import { ShoppingCart, Save, RefreshCw } from "lucide-react";
import { ItemDetailsForm, PurchaseDetailItem } from "./ItemDetails";
import { PurchaseHeaderData, PurchaseHeaderForm } from "./PurchaseHeader";
import { TaxDiscountData, TaxDiscountForm } from "./TaxDiscount";
import { ItemsTable } from "./ItemsTable";
import Bottom from "./Bottom";
interface CombinedPurchaseData extends PurchaseHeaderData, TaxDiscountData {}

export const PurchaseInterface: React.FC = () => {
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
    formState: { errors, isSubmitting },
  } = useForm<CombinedPurchaseData>({
    defaultValues: {
      challanNo: "",
      supplierName: "",
      totalAmount: 0,
      totalPaid: 0,
      purchaseDate: new Date(),
      supplierBill: "",
      vatPercentage: 0,
      vatAmount: 0,
      discountPercentage: 0,
      discountAmount: 0,
    },
  });

  const watchedValues = watch([
    "totalAmount",
    "vatPercentage",
    "discountPercentage",
  ]);

  // Auto-calculate VAT and Discount amounts
  React.useEffect(() => {
    const [totalAmount, vatPercentage, discountPercentage] = watchedValues;

    if (totalAmount && vatPercentage) {
      const vatAmount = (totalAmount * vatPercentage) / 100;
      setValue("vatAmount", Number(vatAmount.toFixed(2)));
    }

    if (totalAmount && discountPercentage) {
      const discountAmount = (totalAmount * discountPercentage) / 100;
      setValue("discountAmount", Number(discountAmount.toFixed(2)));
    }
  }, [watchedValues, setValue]);

  // Auto-calculate total amount from purchase items
  React.useEffect(() => {
    const totalFromItems = purchaseItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    if (totalFromItems > 0) {
      setValue("totalAmount", Number(totalFromItems.toFixed(2)));
    }
  }, [purchaseItems, setValue]);

  const onSubmit = (data: CombinedPurchaseData) => {
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

    console.log("Complete Purchase Data:", submissionData);

    toaster.push(
      <Message type="success" showIcon>
        Purchase saved successfully!
      </Message>,
      { placement: "topCenter" }
    );
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

  const calculateFinalAmount = () => {
    const totalAmount = watch("totalAmount") || 0;
    const vatAmount = watch("vatAmount") || 0;
    const discountAmount = watch("discountAmount") || 0;
    return totalAmount + vatAmount - discountAmount;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">
                  Purchase Management
                </h1>
                <p className="text-gray-600 text-sm m-0">
                  Complete purchase transaction interface
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                appearance="subtle"
                startIcon={<RefreshCw className="w-4 h-4" />}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                appearance="primary"
                startIcon={<Save className="w-4 h-4" />}
                onClick={handleSubmit(onSubmit)}
                loading={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Purchase
              </Button>
            </div>
          </div>
        </div> */}

        <Form onSubmit={handleSubmit(onSubmit)} fluid>
          {/* Purchase Header Form */}
          <PurchaseHeaderForm
            control={control}
            errors={errors}
            totalAmountReadOnly={purchaseItems.length > 0}
          />

          {/* Tax & Discount Form */}
          <TaxDiscountForm control={control} errors={errors} />

          {/* Summary Card */}
          {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Subtotal</p>
                <p className="text-xl font-bold text-gray-800">
                  ৳{(watch("totalAmount") || 0).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">VAT Amount</p>
                <p className="text-xl font-bold text-green-600">
                  +৳{(watch("vatAmount") || 0).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Discount</p>
                <p className="text-xl font-bold text-red-600">
                  -৳{(watch("discountAmount") || 0).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  Final Amount
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ৳{calculateFinalAmount().toFixed(2)}
                </p>
              </div>
            </div>
          </div> */}
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
        <Bottom />
      </div>
    </div>
  );
};
