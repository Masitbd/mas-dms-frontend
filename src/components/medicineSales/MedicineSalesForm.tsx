/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect } from "react";
import { Controller, useForm, UseFormReset } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  InputProps,
  Row,
  SelectPicker,
} from "rsuite";
import { salesZodSchema, ISaleFormData } from "./MedicienSalesInterface";
import { Rfield } from "../ui/Rfield";

import { zodResolver } from "@hookform/resolvers/zod";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  defaultValues?: Partial<ISaleFormData>;
  loading?: boolean;
  submitHandler: (
    props: ISaleFormData,
    reset: UseFormReset<ISaleFormData>
  ) => void;
  isSuccess: boolean;
  mode?: ENUM_MODE;
}

const MedicienSalesForm = ({
  defaultValues,
  loading,
  submitHandler,
  isSuccess,
  mode,
}: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISaleFormData>({
    defaultValues: {
      name: "",
      ...defaultValues,
    },
    resolver: zodResolver(salesZodSchema),
  });

  const routes = useRouter();
  const cancelHandler = () => {
    reset({ name: "", address: "" });
    routes.push("/category");
  };

  const onSubmit = async (data: ISaleFormData) => {
    try {
      mode !== ENUM_MODE.VIEW && submitHandler && submitHandler(data, reset);
      mode == ENUM_MODE.VIEW && cancelHandler();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid fluid>
          {/* Name */}
          <Row className="m-4  px-5">
            <Col className="my-2.5" xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Name is required",
                }}
                render={({ field }) => (
                  <Rfield<InputProps, ISaleFormData, "name">
                    as={Input}
                    field={field}
                    error={errors.name?.message as string}
                    placeholder="Enter name"
                    size="lg"
                    label={<>Name</>}
                    type="text"
                    disabled={mode === ENUM_MODE.VIEW}
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISaleFormData, "address">
                    as={Input}
                    field={field}
                    error={errors.address?.message as string}
                    placeholder="Enter address"
                    size="lg"
                    type="text"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={<>Address</>}
                  />
                )}
              />
            </Col>

            {/* Contact Number (optional) */}

            <Col className="my-2.5" xs={12}>
              <Controller
                name="contact_no"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISaleFormData, "contact_no">
                    as={Input}
                    field={field}
                    error={errors.contact_no?.message as string}
                    placeholder="Enter contact number"
                    size="lg"
                    type="text"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={<> Contact No</>}
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="transaction_date"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISaleFormData, "transaction_date">
                    as={Input}
                    field={field}
                    error={errors.transaction_date?.message as string}
                    placeholder="Select transaction date"
                    size="lg"
                    type="date"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={<>Transaction Date</>}
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="patient_type"
                control={control}
                render={({ field }) => (
                  <Rfield<any, ISaleFormData, "patient_type">
                    as={SelectPicker}
                    field={field}
                    error={errors.patient_type?.message as string}
                    disabled={mode === ENUM_MODE.VIEW}
                    label="Patient Type"
                    data={[
                      {
                        label: "Outdoor",
                        value: "outdoor",
                      },
                      {
                        label: "Indoor",
                        value: "indoor",
                      },
                    ]}
                    block
                    size="lg"
                    searchable
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="bed_no"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISaleFormData, "bed_no">
                    as={Input}
                    field={field}
                    error={errors.bed_no?.message as string}
                    placeholder="Enter bed no (if indoor)"
                    size="lg"
                    type="text"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={<>Bed No</>}
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="indoor_bill_no"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISaleFormData, "indoor_bill_no">
                    as={Input}
                    field={field}
                    error={errors.indoor_bill_no?.message as string}
                    placeholder="Enter indoor bill no (if indoor)"
                    size="lg"
                    type="text"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={<>Indoor Bill No</>}
                  />
                )}
              />
            </Col>
          </Row>
        </Grid>

        {/* Form Buttons */}
        <div className="flex items-end justify-end mt-4">
          <Button
            appearance="primary"
            color="red"
            className="mx-2"
            disabled={loading}
            loading={loading}
            onClick={() => cancelHandler()}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            color="blue"
            type="submit"
            disabled={loading}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedicienSalesForm;
