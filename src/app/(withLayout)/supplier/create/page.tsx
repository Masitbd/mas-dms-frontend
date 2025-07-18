"use client";

import { ISupplierFormData } from "@/components/suppliers/Supplier.interface";
import SupplierForm from "@/components/suppliers/SupplierForm";
import { Toast } from "@/components/ui/Toast";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useCreateSupplierMutation } from "@/redux/api/suppliers/supplier.api";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";

const CreateSupplier = () => {
  const router = useRouter();

  const [createSupplier, { isLoading, isSuccess }] =
    useCreateSupplierMutation();

  const submitHandler = async (
    data: ISupplierFormData,
    reset: UseFormReset<ISupplierFormData>
  ) => {
    try {
      const result = await createSupplier(data).unwrap();
      if (result?.success) {
        Toast.fire({ icon: "success", title: "Category Created" });
        reset();
        router.push("/supplier");
      }
    } catch (error) {
      Toast.fire({ icon: "error", text: (error ?? "Try Again") as string });
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="h-[80vh] flex items-center justify-center flex-col">
        <div className="min-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">
                  Supplier Management
                </h1>
                <p className="text-gray-600 text-sm m-0">
                  Manage suppliers for your business
                </p>
              </div>
            </div>
          </div>
        </div>

        <SupplierForm
          submitHandler={submitHandler}
          isSuccess={isSuccess}
          loading={isLoading}
          mode={ENUM_MODE.NEW}
        />
      </div>
    </div>
  );
};

export default CreateSupplier;
