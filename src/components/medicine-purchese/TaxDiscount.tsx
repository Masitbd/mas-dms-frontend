import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Form, Grid, Row, Col, InputNumber } from "rsuite";
import { Rfield } from "../ui/Rfield";
import { DollarSign, Percent, Calculator } from "lucide-react";

export interface TaxDiscountData {
  vatPercentage: number;
  vatAmount: number;
  discountPercentage: number;
  discountAmount: number;
}

interface TaxDiscountFormProps {
  control: Control<TaxDiscountData>;
  errors: FieldErrors<TaxDiscountData>;
}

export const TaxDiscountForm: React.FC<TaxDiscountFormProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Calculator className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 m-0">
            Tax & Discount
          </h3>
          <p className="text-gray-600 text-sm m-0">
            VAT and discount calculations
          </p>
        </div>
      </div> */}

      <Grid fluid>
        <Row gutter={20}>
          <Col xs={24} sm={6}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <Percent className="w-4 h-4" />
              VAT (%)
            </Form.ControlLabel>
            <Controller
              name="vatPercentage"
              control={control}
              render={({ field }) => (
                <Rfield
                  as={InputNumber}
                  //@ts-ignore
                  field={field}
                  error={errors.vatPercentage?.message}
                  placeholder="0"
                  size="md"
                  suffix="%"
                  step={0.01}
                  max={100}
                  min={0}
                />
              )}
            />
          </Col>

          <Col xs={24} sm={6}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              VAT Amount
            </Form.ControlLabel>
            <Controller
              name="vatAmount"
              control={control}
              render={({ field }) => (
                <Rfield
                  as={InputNumber}
                  field={field}
                  error={errors.vatAmount?.message}
                  placeholder="0.00"
                  size="md"
                  prefix="৳"
                  step={0.01}
                  readOnly
                />
              )}
            />
          </Col>

          <Col xs={24} sm={6}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <Percent className="w-4 h-4" />
              Discount (%)
            </Form.ControlLabel>
            <Controller
              name="discountPercentage"
              control={control}
              render={({ field }) => (
                <Rfield
                  as={InputNumber}
                  field={field}
                  error={errors.discountPercentage?.message}
                  placeholder="0"
                  size="md"
                  suffix="%"
                  step={0.01}
                  max={100}
                  min={0}
                />
              )}
            />
          </Col>

          <Col xs={24} sm={6}>
            <Form.ControlLabel className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              Discount Amount
            </Form.ControlLabel>
            <Controller
              name="discountAmount"
              control={control}
              render={({ field }) => (
                <Rfield
                  as={InputNumber}
                  field={field}
                  error={errors.discountAmount?.message}
                  placeholder="0.00"
                  size="md"
                  prefix="৳"
                  step={0.01}
                  readOnly
                />
              )}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};
