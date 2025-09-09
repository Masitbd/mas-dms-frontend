import React, { useEffect } from "react";
import { Controller, useForm, UseFormReset } from "react-hook-form";
import { Button, Col, Grid, Input, InputProps, Row } from "rsuite";

import { Rfield } from "../ui/Rfield";
import {
  Building2,
  User,
  MapPin,
  Phone,
  Fan as Fax,
  Mail,
  Globe,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";
import { ISupplierFormData, supplierZodSchema } from "./Supplier.interface";

interface SupplierFormProps {
  defaultValues?: Partial<ISupplierFormData>;
  loading?: boolean;
  submitHandler: (
    props: ISupplierFormData,
    reset: UseFormReset<ISupplierFormData>
  ) => void;
  isSuccess: boolean;
  mode?: ENUM_MODE;
}

const SupplierForm = ({
  defaultValues,
  loading,
  submitHandler,

  mode,
}: SupplierFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISupplierFormData>({
    defaultValues: {
      supplierId: "",
      name: "",
      contactPerson: "",
      address: "",
      phone: "",
      fax: "",
      city: "",
      country: "",
      email: undefined,
      ...defaultValues,
    },
    resolver: zodResolver(supplierZodSchema),
  });

  const routes = useRouter();
  const cancelHandler = () => {
    reset({
      supplierId: "",
      name: "",
      contactPerson: "",
      address: "",
      phone: "",
      fax: "",
      city: "",
      country: "",
      email: undefined,
    });
    routes.push("/supplier");
  };

  const onsubmit = async (data: ISupplierFormData) => {
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
    <div className="px-7">
      <form onSubmit={handleSubmit(onsubmit)}>
        <Grid fluid>
          <Row className="m-4 px">
            <Col xs={12}>
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "supplierId">
                    as={Input}
                    field={field}
                    placeholder="Supplier ID"
                    size="lg"
                    type="text"
                    disabled
                    label={
                      <>
                        <Building2 className="w-4 h-4" />
                        Supplier ID
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "name">
                    as={Input}
                    field={field}
                    error={errors.name?.message as string}
                    placeholder="Supplier Name"
                    size="lg"
                    type="text"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <Building2 className="w-4 h-4" />
                        Supplier Name
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col xs={12}>
              <Controller
                name="contactPerson"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "contactPerson">
                    as={Input}
                    field={field}
                    error={errors.contactPerson?.message as string}
                    placeholder="Contact Person"
                    size="lg"
                    type="text"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <User className="w-4 h-4" />
                        Contact Person
                      </>
                    }
                  />
                )}
              />
            </Col>

            <Col xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "address">
                    as={Input}
                    field={field}
                    error={errors.address?.message as string}
                    placeholder="Address"
                    size="lg"
                    type="text"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <MapPin className="w-4 h-4" />
                        Address
                      </>
                    }
                  />
                )}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xs={12}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "city">
                    as={Input}
                    field={field}
                    error={errors.city?.message as string}
                    placeholder="City"
                    size="lg"
                    type="text"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <MapPin className="w-4 h-4" />
                        City
                      </>
                    }
                  />
                )}
              />
            </Col>
            <Col xs={12}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "country">
                    as={Input}
                    field={field}
                    error={errors.country?.message as string}
                    placeholder="Country"
                    size="lg"
                    type="text"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <Globe className="w-4 h-4" />
                        Country
                      </>
                    }
                  />
                )}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xs={12}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "phone">
                    as={Input}
                    field={field}
                    error={errors.phone?.message as string}
                    placeholder="Phone Number"
                    size="lg"
                    type="number"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <Phone className="w-4 h-4" />
                        Phone
                      </>
                    }
                  />
                )}
              />
            </Col>
            <Col xs={12}>
              <Controller
                name="fax"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "fax">
                    as={Input}
                    field={field}
                    error={errors.fax?.message as string}
                    placeholder="Fax Number"
                    size="lg"
                    type="number"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <Fax className="w-4 h-4" />
                        Fax
                      </>
                    }
                  />
                )}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ISupplierFormData, "email">
                    as={Input}
                    field={field}
                    error={errors.email?.message as string}
                    placeholder="Email Address"
                    size="lg"
                    type="email"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <Mail className="w-4 h-4" />
                        Email
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

export default SupplierForm;
