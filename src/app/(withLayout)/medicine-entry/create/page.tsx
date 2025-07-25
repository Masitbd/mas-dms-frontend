"use client";

import MedicineEntryForm from "@/components/medicineEntry/MediceEntryForm";
import { TMedicineEntry } from "@/components/medicineEntry/medicineEntry.interface";
import { Toast } from "@/components/ui/Toast";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useCreateMedicineMutation } from "@/redux/api/medicines/medicine.api";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";

const MedicineEntryPage = () => {
  const router = useRouter();

  const [createMedicine, { isLoading, isSuccess }] =
    useCreateMedicineMutation();

  const submitHandler = async (
    data: TMedicineEntry,
    reset: UseFormReset<TMedicineEntry>
  ) => {
    try {
      console.log(data, "data in medicine entry page");
      const result = await createMedicine(data).unwrap();
      if (result?.success) {
        Toast.fire({ icon: "success", title: "Category Created" });
        reset();
        router.push("/medicine-entry");
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
        <MedicineEntryForm
          submitHandler={submitHandler}
          isSuccess={isSuccess}
          loading={isLoading}
          mode={ENUM_MODE.NEW}
        />
      </div>
    </div>
  );
};

export default MedicineEntryPage;
