import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  Form,
  Grid,
  Row,
  Col,
  Input,
  DatePicker,
  SelectPicker,
  InputNumber,
  Tag,
  SelectPickerProps,
} from "rsuite";
import { Rfield } from "../ui/Rfield";
import { ShoppingCart, Calendar, User, Receipt } from "lucide-react";
import { useGetSuppliersQuery } from "@/redux/api/suppliers/supplier.api";

export interface PurchaseHeaderData {
  challanNo: string;
  supplierName: string;
  totalAmount: number;
  totalPaid: number;
  purchaseDate: Date;
  supplierBill: string;
}

interface PurchaseHeaderFormProps {
  control: Control<PurchaseHeaderData>;
  errors: FieldErrors<PurchaseHeaderData>;
  totalAmountReadOnly?: boolean;
}

const supplierOptions = [
  { label: "ABC Suppliers Ltd.", value: "abc_suppliers" },
  { label: "XYZ Trading Co.", value: "xyz_trading" },
  { label: "Global Import Export", value: "global_import" },
  { label: "Premier Wholesale", value: "premier_wholesale" },
  { label: "Metro Suppliers", value: "metro_suppliers" },
];

export const PurchaseHeaderForm: React.FC<PurchaseHeaderFormProps> = ({
  control,
  errors,
  totalAmountReadOnly = false,
}) => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const { data: supplierData } = useGetSuppliersQuery({ limit: 1000 });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 m-0">
              Purchase Information
            </h3>
            <p className="text-gray-600 text-sm m-0">
              Basic purchase transaction details
            </p>
          </div>
        </div>
        <Tag color="green" size="md">
          {getCurrentTime()}
        </Tag>
      </div>

      <Grid fluid>
        <Row gutter={20} className="mb-4">
          <Col xs={24} sm={8}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <Receipt className="w-4 h-4" />
              Challan No
            </Form.ControlLabel>
            <Controller
              name="challanNo"
              control={control}
              render={({ field }) => (
                <Rfield
                  as={Input}
                  field={field}
                  error={errors.challanNo?.message as string}
                  size="md"
                  fluid
                  disabled
                  block
                />
              )}
            />
          </Col>

          <Col xs={24} sm={8}>
            <Controller
              name="supplierId"
              control={control}
              rules={{ required: "Supplier name is required" }}
              render={({ field }) => (
                <Rfield<SelectPickerProps, PurchaseHeaderData, "supplierId">
                  as={SelectPicker}
                  field={field}
                  error={errors.supplierName?.message as string}
                  data={supplierData?.data?.map?.((d) => ({
                    label: d?.name,
                    value: d?._id,
                  }))}
                  placeholder="Select supplier"
                  size="lg"
                  searchable={false}
                  block
                  type="select"
                  label={
                    <>
                      <User className="w-4 h-4" />
                      Supplier Name
                    </>
                  }
                />
              )}
            />
          </Col>

          <Col xs={24} sm={8}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Purchase Date
            </Form.ControlLabel>
            <Controller
              name="purchaseDate"
              control={control}
              rules={{ required: "Purchase date is required" }}
              render={({ field }) => (
                <Rfield
                  as={DatePicker}
                  field={field}
                  error={errors.purchaseDate?.message}
                  placeholder="Select date"
                  size="md"
                  format="dd MMM yyyy"
                  block
                  oneTap
                />
              )}
            />
          </Col>
        </Row>

        <Row gutter={20}>
          <Col xs={24} sm={8}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              Total Amount
            </Form.ControlLabel>
            <Controller
              name="totalAmount"
              control={control}
              render={({ field }) => (
                <Rfield
                  as={InputNumber}
                  field={field}
                  error={errors.totalAmount?.message}
                  placeholder="0.00"
                  size="md"
                  prefix="৳"
                  step={0.01}
                  readOnly={totalAmountReadOnly}
                  fluid
                  disabled
                />
              )}
            />
          </Col>

          <Col xs={24} sm={8}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              Total Paid
            </Form.ControlLabel>
            <Controller
              name="totalPaid"
              control={control}
              rules={{ min: { value: 0, message: "Amount must be positive" } }}
              render={({ field }) => (
                <Rfield
                  as={InputNumber}
                  field={field}
                  error={errors.totalPaid?.message}
                  placeholder="0.00"
                  size="md"
                  prefix="৳"
                  step={0.01}
                />
              )}
            />
          </Col>

          <Col xs={24} sm={8}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <Receipt className="w-4 h-4" />
              Supplier Bill Ref.
            </Form.ControlLabel>
            <Controller
              name="supplierBill"
              control={control}
              render={({ field }) => (
                <Rfield
                  as={Input}
                  field={field}
                  error={errors.supplierBill?.message}
                  placeholder="Enter bill reference"
                  size="md"
                />
              )}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};
