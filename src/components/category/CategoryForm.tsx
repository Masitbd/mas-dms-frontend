/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect } from "react";
import { Controller, useForm, UseFormReset } from "react-hook-form";
import { Button, Col, Form, Grid, Input, InputProps, Row } from "rsuite";
import { categoryZodSchema, ICategoryFormData } from "./CategoryInterface";
import { Rfield } from "../ui/Rfield";
import { Tag } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  defaultValues?: Partial<ICategoryFormData>;
  loading?: boolean;
  submitHandler: (
    props: ICategoryFormData,
    reset: UseFormReset<ICategoryFormData>
  ) => void;
  isSuccess: boolean;
  mode?: ENUM_MODE;
}

const CategoryForm = ({
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
  } = useForm<ICategoryFormData>({
    defaultValues: {
      categoryId: "",
      name: "",
      ...defaultValues,
    },
    resolver: zodResolver(categoryZodSchema),
  });

  const routes = useRouter();
  const cancelHandler = () => {
    reset({ name: "", categoryId: "" });
    routes.push("/category");
  };

  const onSubmit = async (data: ICategoryFormData) => {
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
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Rfield<InputProps, ICategoryFormData, "categoryId">
                    as={Input}
                    field={field}
                    placeholder="Category ID"
                    size="lg"
                    type="text"
                    disabled
                    label={
                      <>
                        <Tag className="w-4 h-4" />
                        Category ID
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
                  <Rfield<InputProps, ICategoryFormData, "name">
                    as={Input}
                    field={field}
                    error={errors.name?.message as string}
                    placeholder="Category Name"
                    size="lg"
                    type="text"
                    disabled={mode == ENUM_MODE.VIEW}
                    label={
                      <>
                        <Tag className="w-4 h-4" />
                        Category Name
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

export default CategoryForm;
