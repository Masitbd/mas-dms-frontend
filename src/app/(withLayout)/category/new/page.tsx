"use client";
import CategoryForm from "@/components/category/CategoryForm";
import { ICategoryFormData } from "@/components/category/CategoryInterface";
import { Toast } from "@/components/ui/Toast";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useCreateCategoryMutation } from "@/redux/api/categories/category.api";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { UseFormReset } from "react-hook-form";

const NewCategory = () => {
  const router = useRouter();
  const [create, { isLoading: createLoading, isSuccess }] =
    useCreateCategoryMutation();
  const submitHandler = async (
    data: ICategoryFormData,
    reset: UseFormReset<ICategoryFormData>
  ) => {
    try {
      const result = await create(data).unwrap();
      if (result?.success) {
        Toast.fire({ icon: "success", title: "Category Created" });
        reset();
        router.push("/category");
      }
    } catch (error) {
      Toast.fire({ icon: "error", text: (error ?? "Try Again") as string });
      console.error(error);
    }
  };
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
                  Category Management
                </h1>
                <p className="text-gray-600 text-sm m-0">
                  Manage product categories for your inventory
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-2xl">
            <div className=" gap-3">
              <div>
                <CategoryForm
                  submitHandler={submitHandler}
                  isSuccess={isSuccess}
                  loading={createLoading}
                  mode={ENUM_MODE.NEW}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
