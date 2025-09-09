"use client";

import { formatDate } from "@/components/medicine-purchese/MedicinePurcheseTypes";
import { useGetSuppliersQuery } from "@/redux/api/suppliers/supplier.api";
import { IFormValues } from "@/types";
import React, { useState } from "react";
import { Button, DatePicker, Form, SelectPicker } from "rsuite";

const SupplierWisePurchaseStatement = () => {
  const [isSearchEnable, setIsSearchEnable] = useState(false);

  const { data: suppliers, isLoading: isSupplierLoading } =
    useGetSuppliersQuery(undefined);

  const queryParams: Record<string, any> = {};

  // console.log("data", data);

  const [formValue, setFormValue] = useState<IFormValues>({
    supplier: "",
    startDate: null,
    endDate: null,
  });

  const handleChange = (value: Record<string, any>) => {
    setFormValue({
      supplier: value.supplier,
      startDate: value.startDate || null,
      endDate: value.endDate || null,
    });
  };

  if (formValue.startDate)
    queryParams.startDate = formatDate(formValue.startDate);
  if (formValue.endDate) queryParams.endDate = formatDate(formValue.endDate);
  if (formValue.branch) queryParams.branch = formValue.branch;

  // Handle form submission
  const handleSubmit = async (
    formValue: Record<string, any> | null,
    event?: React.FormEvent<HTMLFormElement>
  ) => {
    if (formValue) {
      setIsSearchEnable(true);
    }
  };

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-80 mx-auto rounded-xl">
        Supplier Wise Purchase Statement
      </h2>
      <div className="px-2 my-5">
        <Form
          onChange={handleChange}
          onSubmit={handleSubmit}
          formValue={formValue}
          className="grid grid-cols-5 gap-10 justify-items-center  w-full"
        >
          <Form.Group controlId="startDate">
            <Form.ControlLabel>Start Date</Form.ControlLabel>
            <DatePicker
              oneTap
              name="startDate"
              format="yyyy-MM-dd"
              value={formValue.startDate}
              onChange={(date: Date | null) =>
                setFormValue((prev) => ({ ...prev, startDate: date }))
              }
            />
          </Form.Group>

          <Form.Group controlId="endDate">
            <Form.ControlLabel>End Date</Form.ControlLabel>
            <DatePicker
              oneTap
              name="endDate"
              format="yyyy-MM-dd"
              value={formValue.endDate}
              onChange={(date: Date | null) =>
                setFormValue((prev) => ({ ...prev, endDate: date }))
              }
            />
          </Form.Group>
          <Form.Group controlId="supplierId">
            <Form.ControlLabel>Supplier</Form.ControlLabel>
            <SelectPicker
              name="endDate"
              data={suppliers?.data?.map?.(
                (d: { name: string; _id: string }) => ({
                  label: d?.name,
                  value: d?._id,
                })
              )}
              placeholder="Select supplier"
              size="lg"
              searchable={false}
              block
            />
          </Form.Group>

          <Button
            className="max-h-11 mt-5  w-full max-w-md mx-auto"
            size="sm"
            appearance="primary"
            type="submit"
          >
            Search
          </Button>
        </Form>

        {/* {data && data?.data && (
          <PatientDueReportsTable
            data={data.data?.[0]}
            startDate={formValue.startDate}
            endDate={formValue.endDate}
          />
        )} */}
      </div>
    </div>
  );
};

export default SupplierWisePurchaseStatement;
