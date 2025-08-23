"use client";
import React, { Ref, useEffect, useRef, useState } from "react";
import { Controller, useForm, UseFormReset } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  InputProps,
  Message,
  PickerHandle,
  Row,
  SelectPicker,
  Table,
  toaster,
} from "rsuite";
import { ISaleFormData } from "./MedicienSalesInterface";
import { Rfield } from "../ui/Rfield";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import MinusRoundIcon from "@rsuite/icons/MinusRound";

import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";
import { SearchIcon, TrashIcon } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addItem,
  changeQty,
  decrementQty,
  IMedicineSale,
  incrementQty,
  removeItem,
  setItemDiscount,
} from "@/redux/order/orderSlice";
import { useGetMedicinesQuery } from "@/redux/api/medicines/medicine.api";
import { useSession } from "next-auth/react";

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
  });
  const itemCodeRef = useRef<PickerHandle>(null);
  const itemNameRef = useRef<PickerHandle>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState<IMedicineSale>();
  const [qty, setQty] = useState(1);

  const routes = useRouter();
  const cancelHandler = () => {
    reset({ name: "", address: "" });
    routes.push("/category");
  };

  const queryParams: Record<string, any> = {};
  // api calling

  if (searchTerm) queryParams.searchTerm = searchTerm;

  const {
    data: medicineitems,
    isLoading,
    isFetching,
  } = useGetMedicinesQuery(queryParams);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues]);

  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.order);

  const user = useSession() as any;

  const onSubmit = async (data: any) => {
    try {
      const medicinePayload = {
        paypatient_type: state.patient_type,
        medicines: state.medicines,
        name: data.name,
        contact_no: data.contact_no,
        amount: state.totalBill,
        // TODO after authenctication
        posted_by: user?.uuid,
      };
      mode !== ENUM_MODE.VIEW &&
        submitHandler &&
        submitHandler(medicinePayload as any, reset);
      mode == ENUM_MODE.VIEW && cancelHandler();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    const doesExists =
      state?.medicines?.length &&
      state.medicines.find((i) => i?.item?._id == item?._id);

    if (qty < 1) {
      toaster.push(
        <Message type="error">!Quantity should be greater than 0</Message>
      );
      return;
    }

    if (doesExists) {
      toaster.push(<Message type="error">!Oops Already exists</Message>);
      return;
    }
    const data = {
      quantity: qty,
      unit_price: item?.salesRate,
      item: item,
      medicineId: item?._id,
      discount: item?.discount ?? 0,
      isVat: item?.isVat,
    };
    dispatch(addItem(data));
    setItem(null as unknown as IMedicineSale);
    setQty(1);
    if (itemCodeRef && itemCodeRef.current !== undefined) {
      itemCodeRef?.current?.open && itemCodeRef?.current?.open();
      itemCodeRef?.current?.target?.focus();
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
    setItem(null as unknown as IMedicineSale);
  };

  const handleIncrementQty = (id: string) => {
    dispatch(incrementQty(id));
  };

  const handleDecrementQty = (id: string) => {
    dispatch(decrementQty(id));
  };

  const selectHandler = (param: any) => {
    setItem(param);
  };

  useEffect(() => {
    if (item) {
      qtyRef?.current?.focus(); // Focus the qty field after item state updates
    }
  }, [item]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-10 border-b">
          <h1 className="text-center text-2xl font-bold text-emerald-600 p-5 rounded-2xl  drop-shadow-lg bg-slate-50">
            Customer Information
          </h1>
          <Grid fluid>
            {/* Name */}
            <Row className="m-4  px-5">
              <Col className="my-2.5" xs={8}>
                <Controller
                  name="name"
                  control={control}
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

              <Col className="my-2.5" xs={8}>
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

              <Col className="my-2.5" xs={8}>
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

              <Col className="my-2.5" xs={8}>
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

              <Col className="my-2.5" xs={8}>
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

              <Col className="my-2.5" xs={8}>
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

              <Col className="my-2.5" xs={8}>
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
        </div>

        {/*  */}
        <div className="border border-[#DCDCDC] p-2 rounded-md">
          <div className="grid 2xl:grid-cols-12 gap-2 xl:grid-cols-10 lg:grid-cols-8 grid-cols-6">
            <div className="2xl:col-span-8  xl:col-span-5 col-span-2">
              <h2>Medicine Name</h2>
              <SelectPicker
                size="sm"
                caretAs={SearchIcon}
                searchable
                block
                placeholder={"Item name"}
                data={medicineitems?.data?.data?.map((cd: IMedicineSale) => ({
                  label: cd?.name,
                  value: cd?._id,
                  children: cd,
                }))}
                onSelect={(v, v1, v2) =>
                  selectHandler(v1?.children as unknown as IMedicineSale)
                }
                value={item?._id}
                disabledItemValues={
                  state?.medicines?.map((i) => i?._id) as string[]
                }
                onSearch={(v) => setSearchTerm(v)}
                loading={isLoading || isFetching}
                ref={itemNameRef as Ref<PickerHandle>}
              />
            </div>
            <div>
              <h2>Qty</h2>
              <Input
                size="sm"
                type="number"
                onChange={(v) => setQty(Number(v))}
                value={qty}
                onPressEnter={() => handleAdd()}
                ref={qtyRef}
              />
            </div>
            <div>
              <h2>Rate</h2>
              <Input size="sm" type="number" value={item?.salesRate} disabled />
            </div>
            <div className="">
              <br />
              <Button
                size="sm"
                appearance="primary"
                color="green"
                className="whitespace-pre"
                onClick={() => handleAdd()}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="my-2">
            <Table bordered cellBordered height={230} data={state?.medicines}>
              <Column flexGrow={1}>
                <HeaderCell children="M. Category" />
                <Cell>{(rowData) => rowData?.item?.category?.name}</Cell>
              </Column>
              <Column flexGrow={3}>
                <HeaderCell children="M. Name" />
                <Cell dataKey="item.name" />
              </Column>
              <Column flexGrow={1.2}>
                <HeaderCell children="Qty" />
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        {
                          <div className="grid grid-cols-4 gap-2">
                            <Button
                              size="xs"
                              appearance="ghost"
                              color="orange"
                              onClick={() =>
                                handleDecrementQty(rowData?.item?._id)
                              }
                            >
                              <MinusRoundIcon />
                            </Button>
                            <Input
                              value={rowData?.quantity}
                              size="sm"
                              type="number"
                              onChange={(v) =>
                                dispatch(
                                  changeQty({
                                    ...rowData?.item,
                                    quantity: Number(v),
                                  })
                                )
                              }
                              className="col-span-2 [&::-webkit-inner-spin-button]:appearance-none text-center"
                            />
                            <Button
                              size="xs"
                              appearance="ghost"
                              color="blue"
                              onClick={() =>
                                handleIncrementQty(rowData?.item?._id)
                              }
                              className="cos"
                            >
                              <PlusRoundIcon />
                            </Button>
                          </div>
                        }
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column flexGrow={0.7}>
                <HeaderCell children="Rate" />
                <Cell dataKey="unit_price" />
              </Column>
              <Column flexGrow={0.7}>
                <HeaderCell children="Disc(%)" />
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        <Input
                          size="sm"
                          name="discount"
                          type="number"
                          // className="[&::-webkit-inner-spin-button]:appearance-none"
                          onChange={(v) =>
                            dispatch(
                              setItemDiscount({
                                item: rowData?.item,
                                discount: Number(v),
                              })
                            )
                          }
                          value={rowData?.discount}
                          disabled
                        />
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column flexGrow={0.7}>
                <HeaderCell children="Total" />
                <Cell dataKey="finalTotal" />
              </Column>

              <Column flexGrow={0.5}>
                <HeaderCell children="Action" />
                <Cell>
                  {(rowData) => {
                    return (
                      <Button
                        appearance="primary"
                        color="red"
                        size="sm"
                        onClick={() => handleRemove(rowData?.item?._id)}
                      >
                        <TrashIcon />
                      </Button>
                    );
                  }}
                </Cell>
              </Column>
            </Table>
          </div>
        </div>

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
