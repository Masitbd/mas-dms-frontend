"use client";

import MedicineIncomeStatementDetails from "@/components/reports/MedicineIncomeStatementDetails";
import { useGetMedicineIncomeStatementDetailsReportsQuery } from "@/redux/api/reports.api";
import { IFormValues } from "@/types";
import { formatDate } from "@/utils/formateDate";
import { useState } from "react";
import { Button, DatePicker, Form, Loader } from "rsuite";

const MedicineIncomeStatementDetailsPage = () => {
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const queryParams: Record<string, any> = {};

  const [formValue, setFormValue] = useState<IFormValues>({
    startDate: null,
    endDate: null,
  });

  const handleChange = (value: Record<string, any>) => {
    setFormValue({
      startDate: value.startDate || null,
      endDate: value.endDate || null,
    });
  };

  if (formValue.startDate) {
    queryParams.startDate = formatDate(formValue.startDate);
  }

  if (formValue.endDate) {
    queryParams.endDate = formatDate(formValue.endDate);
  }

  const handleSubmit = (currentValue: Record<string, any> | null) => {
    if (currentValue) {
      setIsSearchEnable(true);
    }
  };

  const { data, isLoading, isFetching } =
    useGetMedicineIncomeStatementDetailsReportsQuery(queryParams, {
      skip: !isSearchEnable,
    });

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-[420px] mx-auto rounded-xl">
        Medicine Income Statement Details
      </h2>

      <div className="px-2 my-5">
        <Form
          onSubmit={handleSubmit}
          onChange={handleChange}
          formValue={formValue}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 justify-items-center w-full"
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

          <Button
            className="max-h-11 mt-5 w-full max-w-md mx-auto"
            size="sm"
            appearance="primary"
            type="submit"
          >
            Search
          </Button>
        </Form>

        {(isLoading || isFetching) && (
          <div className="flex justify-center mt-8">
            <Loader size="md" content="Loading report..." />
          </div>
        )}

        {!isLoading && !isFetching && data?.data && (
          <MedicineIncomeStatementDetails
            data={data.data as any}
            startDate={formValue.startDate}
            endDate={formValue.endDate}
          />
        )}
      </div>
    </div>
  );
};

export default MedicineIncomeStatementDetailsPage;
