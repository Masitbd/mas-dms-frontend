"use client";
import GenericForm from "@/components/generics/GenericForm";
import { IGenericFormData } from "@/components/generics/GenericInterface";
import { Toast } from "@/components/ui/Toast";
import { ENUM_MODE } from "@/enums/EnumMode";
import {
  useGetGenericQuery,
  useGetSingleGenericQuery,
  useUpdateGenericMutation,
} from "@/redux/api/generics/generic.api";
import { Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { UseFormReset } from "react-hook-form";

const UpdateGeneric = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: defaultValues, isLoading: dataLoading } =
    useGetSingleGenericQuery(params.id);
  const [update, { isLoading: updateLoading, isSuccess }] =
    useUpdateGenericMutation();
  const submitHandler = async (
    data: IGenericFormData,
    reset: UseFormReset<IGenericFormData>
  ) => {
    try {
      const result = await update({ id: params.id, data }).unwrap();
      if (result?.success) {
        Toast.fire({ icon: "success", title: "Generic Updated" });
        reset();
        router.push("/generics");
      }
    } catch (error) {
      Toast.fire({ icon: "error", text: (error ?? "Try Again") as string });
      console.error(error);
    }
  };

  const searchParams = useSearchParams();
  return (
    <div className="h-[80vh] flex items-center justify-center  flex-col">
      <div className="  ">
        <div className="min-w-2xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">
                  Generic Management
                </h1>
                <p className="text-gray-600 text-sm m-0">
                  Manage product generics for your inventory
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-2xl">
            <div className=" gap-3">
              <div>
                <GenericForm
                  submitHandler={submitHandler}
                  isSuccess={isSuccess}
                  loading={updateLoading}
                  defaultValues={defaultValues?.data}
                  mode={searchParams.get("mode") as ENUM_MODE}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGeneric;
