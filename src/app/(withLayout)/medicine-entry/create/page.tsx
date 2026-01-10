"use client";

import Loading from "@/app/Loading";
import MedicineEntryForm from "@/components/medicineEntry/MediceEntryForm";
import { TMedicineEntry } from "@/components/medicineEntry/medicineEntry.interface";
import { Toast } from "@/components/ui/Toast";
import { ENUM_MODE } from "@/enums/EnumMode";
import {
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
} from "@/redux/api/medicines/medicine.api";
import { Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { UseFormReset } from "react-hook-form";

export const MedicineEntryPage = () => {
  const router = useRouter();

  const [createMedicine, { isLoading, isSuccess }] =
    useCreateMedicineMutation();
  const [UPDATE, { isLoading: updateLoading }] = useUpdateMedicineMutation();

  const submitHandler = async (
    data: TMedicineEntry,
    reset: UseFormReset<TMedicineEntry>,
    mode: string
  ) => {
    try {
      if (mode == ENUM_MODE.NEW) {
        const result = await createMedicine(data).unwrap();
        if (result?.success) {
          Toast.fire({ icon: "success", title: "Category Created" });
        }
      }
      if (mode == ENUM_MODE.UPDATE) {
        const result = await UPDATE(data).unwrap();
        if (result?.success) {
          Toast.fire({ icon: "success", title: "Medicine Update" });
        }
      }
      reset();
      router.push("/medicine-entry");
    } catch (error) {
      Toast.fire({ icon: "error", text: (error ?? "Try Again") as string });
      console.error(error);
    }
  };

  const searchParams = useSearchParams();

  return (
    <div className="w-full">
      <div className=" flex justify-center flex-col">
        <div className="w-full ">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">
                  Medicine Management
                </h1>
                <p className="text-gray-600 text-sm m-0">
                  Manage Medicines for your business
                </p>
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<Loading />}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-2xl">
            <div className=" gap-3">
              <div>
                <MedicineEntryForm
                  submitHandler={submitHandler}
                  isSuccess={isSuccess}
                  loading={isLoading || updateLoading}
                  mode={ENUM_MODE.NEW}
                  searchParams={searchParams}
                />
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

const MainComponent = () => {
  return (
    <Suspense fallback={<Loading />}>
      <MedicineEntryPage />
    </Suspense>
  );
};

export default MainComponent;
