"use client";

import MedicienSalesForm from "@/components/medicineSales/MedicineSalesForm";

import { Toast } from "@/components/ui/Toast";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useCreateMedicineSalesMutation } from "@/redux/api/medicines/sales.api";
import { resetBill } from "@/redux/order/orderSlice";
import { SquarePercent } from "lucide-react";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";

const page = () => {
  const router = useRouter();

  const [createMedicineSales, { isLoading, isSuccess }] =
    useCreateMedicineSalesMutation();

  const submitHandler = async (data: any, reset: UseFormReset<any>) => {
    try {
      const result = await createMedicineSales(data).unwrap();
      if (result?.success) {
        Toast.fire({ icon: "success", title: "Category Created" });
        resetBill();
        reset();
        router.push("/medicine-sale");
      }
    } catch (error) {
      Toast.fire({ icon: "error", text: (error ?? "Try Again") as string });
      console.error(error);
    }
  };
  return (
    <div className="w-full">
      <div className="h-[80vh] flex items-center justify-center flex-col">
        <div className="w-full px-5 m-5 mt-32">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <SquarePercent className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">
                  Medicine Sales
                </h1>
                <p className="text-gray-600 text-sm m-0">
                  Sell Medicines for your business
                </p>
              </div>
            </div>
          </div>
        </div>
        <MedicienSalesForm
          submitHandler={submitHandler}
          isSuccess={isSuccess}
          loading={isLoading}
          mode={ENUM_MODE.NEW}
        />
      </div>
    </div>
  );
};

export default page;
