/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect } from "react";
import { Controller, useForm, UseFormReset } from "react-hook-form";
import { Button, Col, Form, Grid, Input, InputProps, Row } from "rsuite";
import { genericZodSchema, IGenericFormData } from "./GenericInterface";
import { Rfield } from "../ui/Rfield";
import { Tag } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";
interface GenericFormProps {
  defaultValues?: Partial<IGenericFormData>;
  loading?: boolean;
  submitHandler: (
    props: IGenericFormData,
    reset: UseFormReset<IGenericFormData>
  ) => void;
  isSuccess: boolean;
  mode: ENUM_MODE;
}

const GenericForm = ({
  defaultValues,
  loading,
  submitHandler,
  isSuccess,
  mode,
}: GenericFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IGenericFormData>({
    defaultValues: {
      genericId: "",
      name: "",
      ...defaultValues,
    },
    resolver: zodResolver(genericZodSchema),
  });
  const routes = useRouter();
  const cancelHandler = () => {
    reset({ name: "", genericId: "" });
    routes.push("/category");
  };

  const onSubmit = async (data: IGenericFormData) => {
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
          <Row className="mb-4">
            <Col xs={24}>
              <Controller
                name="genericId"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, IGenericFormData, "genericId">
                    as={Input}
                    field={field}
                    placeholder="Generic ID"
                    size="lg"
                    type="text"
                    disabled
                    label={
                      <>
                        <Tag className="w-4 h-4" />
                        Generic ID
                      </>
                    }
                  />
                )}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xs={24}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, IGenericFormData, "name">
                    as={Input}
                    field={field}
                    error={errors.name?.message as string}
                    placeholder="Generic Name"
                    size="lg"
                    type="text"
                    label={
                      <>
                        <Tag className="w-4 h-4" />
                        Generic Name
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

export default GenericForm;
