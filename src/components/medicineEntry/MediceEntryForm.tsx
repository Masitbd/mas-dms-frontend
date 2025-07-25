"use client";

import React, { useEffect } from "react";
import { Controller, useForm, UseFormReset } from "react-hook-form";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  InputProps,
  Row,
  SelectPicker,
} from "rsuite";

import { Rfield } from "../ui/Rfield";
import {
  Building2,
  User,
  ChartBarStacked,
  Boxes,
  Fan as Fax,
  Calendar,
  BanknoteArrowUp,
  CirclePercent,
  ShoppingBag,
  CircleAlert,
} from "lucide-react";

import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";
import { TIdName, TMedicineEntry } from "./medicineEntry.interface";

import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import { useGetGenericsQuery } from "@/redux/api/generics/generic.api";
import { useGetSuppliersQuery } from "@/redux/api/suppliers/supplier.api";

interface SupplierFormProps {
  defaultValues?: Partial<TMedicineEntry>;
  loading?: boolean;
  submitHandler: (
    props: TMedicineEntry,
    reset: UseFormReset<TMedicineEntry>
  ) => void;
  isSuccess: boolean;
  mode?: ENUM_MODE;
}

const MedicineEntryForm = ({
  defaultValues,
  loading,
  submitHandler,
  isSuccess,
  mode,
}: SupplierFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TMedicineEntry>({
    defaultValues: {
      medicineId: "",
      name: "",
      genericName: "",
      category: "",
      supplierName: "",
      reOrderLevel: 0,
      unit: "",
      openingBalance: 0,
      openingBalanceDate: undefined,
      openingBalanceRate: 0,
      salesRate: 0,
      discount: 0,
      alertQty: 0,
      ...defaultValues,
    },
  });

  const routes = useRouter();
  const cancelHandler = () => {
    reset({
      name: "",
      genericName: "",
      category: "",
      supplierName: "",
      reOrderLevel: 0,
      unit: "",
      openingBalance: 0,
      openingBalanceDate: undefined,
      openingBalanceRate: 0,
      salesRate: 0,
      discount: 0,
      alertQty: 0,
    });
    routes.push("/medicine-entry");
  };

  //

  const { data: generics, isLoading: isGenericLoading } =
    useGetGenericsQuery(undefined);
  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery(undefined);

  const { data: suppliers, isLoading: isSupplierLoading } =
    useGetSuppliersQuery(undefined);

  const onsubmit = async (data: TMedicineEntry) => {
    const {
      reOrderLevel,
      openingBalance,
      openingBalanceRate,
      salesRate,
      alertQty,
      ...rest
    } = data;
    const payload = {
      ...rest,
      reOrderLevel: Number(reOrderLevel.toString()),
      openingBalance: Number(openingBalance.toString()),
      openingBalanceRate: Number(openingBalanceRate.toString()),
      salesRate: Number(salesRate.toString()),
      alertQty: Number(alertQty.toString()),
    };
    try {
      mode !== ENUM_MODE.VIEW && submitHandler && submitHandler(payload, reset);
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
    <div className="px-7">
      <form onSubmit={handleSubmit(onsubmit)}>
        <Grid fluid>
          <Row className="m-4  px-5">
            <Col className="my-2.5" xs={12}>
              <Controller
                name="medicineId"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "medicineId">
                    as={Input}
                    field={field}
                    placeholder="Medicine ID"
                    size="lg"
                    type="text"
                    disabled
                    label={
                      <>
                        <Building2 className="w-4 h-4" />
                        Medicine ID
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Medicine name is required" }}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "name">
                    as={Input}
                    field={field}
                    error={errors.name?.message as string}
                    placeholder="Medicine Name"
                    size="lg"
                    type="text"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <Building2 className="w-4 h-4" />
                        Medicine Name
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="genericName"
                control={control}
                rules={{ required: "Generic name is required" }}
                render={({ field }) => (
                  <Rfield<any, TMedicineEntry, "genericName">
                    as={SelectPicker}
                    field={field}
                    error={errors.genericName?.message as string}
                    label="Generic Name"
                    disabled={mode === ENUM_MODE.VIEW}
                    placeholder="Select Generic Name"
                    data={generics?.data?.map((generic: TIdName) => ({
                      label: generic.name,
                      value: generic._id,
                    }))}
                    block
                    size="lg"
                    searchable
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Rfield<any, TMedicineEntry, "category">
                    as={SelectPicker}
                    field={field}
                    error={errors.category?.message as string}
                    disabled={mode === ENUM_MODE.VIEW}
                    data={categories?.data?.map((category: TIdName) => ({
                      label: category.name,
                      value: category._id,
                    }))}
                    block
                    size="lg"
                    searchable
                    label={
                      <>
                        <ChartBarStacked className="w-4 h-4" />
                        Category
                      </>
                    }
                  >
                    {/* Replace with real options */}
                  </Rfield>
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="supplierName"
                control={control}
                rules={{ required: "Supplier name is required" }}
                render={({ field }) => (
                  <Rfield<any, TMedicineEntry, "supplierName">
                    as={SelectPicker}
                    field={field}
                    error={errors.supplierName?.message as string}
                    disabled={mode === ENUM_MODE.VIEW}
                    data={suppliers?.data?.map((supplier: TIdName) => ({
                      label: supplier.name,
                      value: supplier._id,
                    }))}
                    block
                    size="lg"
                    searchable
                    label={
                      <>
                        <User className="w-4 h-4" />
                        Supplier Name
                      </>
                    }
                  >
                    {/* Replace with real options */}
                  </Rfield>
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="reOrderLevel"
                control={control}
                rules={{ required: "Re-order level is required" }}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "reOrderLevel">
                    as={Input}
                    field={field}
                    type="number"
                    placeholder="Re-order Level"
                    size="lg"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Re-order Level
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="unit"
                control={control}
                rules={{ required: "Unit is required" }}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "unit">
                    as={Input}
                    field={field}
                    placeholder="Unit (e.g., tablet, ml)"
                    size="lg"
                    type="text"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <Boxes className="w-4 h-4" />
                        Unit
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="openingBalance"
                control={control}
                rules={{ required: "Opening balance is required" }}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "openingBalance">
                    as={Input}
                    field={field}
                    placeholder="Opening Balance"
                    size="lg"
                    type="number"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <BanknoteArrowUp className="w-4 h-4" />
                        Opening Balance
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="openingBalanceDate"
                control={control}
                rules={{
                  required: "Opening balance date is required",
                }}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "openingBalanceDate">
                    as={DatePicker}
                    field={field}
                    // @ts-ignore
                    oneTap
                    placeholder="Opening Balance Date"
                    className="w-full"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <Calendar className="w-4 h-4" />
                        Opening Balance Date
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="openingBalanceRate"
                control={control}
                rules={{
                  required: "Opening balance rate is required",
                }}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "openingBalanceRate">
                    as={Input}
                    field={field}
                    placeholder="Opening Balance Rate"
                    size="lg"
                    type="number"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <BanknoteArrowUp className="w-4 h-4" />
                        Opening Balance Rate
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="salesRate"
                control={control}
                rules={{
                  required: "Sales rate is required",
                }}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "salesRate">
                    as={Input}
                    field={field}
                    placeholder="Sales Rate"
                    size="lg"
                    type="number"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <BanknoteArrowUp className="w-4 h-4" />
                        Sales Rate
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "discount">
                    as={Input}
                    field={field}
                    placeholder="Discount (%)"
                    size="lg"
                    type="number"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <CirclePercent className="w-4 h-4" />
                        Discount (%)
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col className="my-2.5" xs={12}>
              <Controller
                name="alertQty"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, TMedicineEntry, "alertQty">
                    as={Input}
                    field={field}
                    placeholder="Alert Quantity"
                    size="lg"
                    type="number"
                    disabled={mode === ENUM_MODE.VIEW}
                    label={
                      <>
                        <CircleAlert className="w-4 h-4" />
                        Alert Quantity
                      </>
                    }
                  />
                )}
              />
            </Col>
          </Row>
        </Grid>

        <div className="flex items-end justify-end">
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

export default MedicineEntryForm;
