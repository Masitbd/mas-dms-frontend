import React, { ReactElement } from "react";
import { Form } from "rsuite";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

// Generic Rfield props
type RFieldProps<
  TComponentProps extends object,
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = {
  label?: ReactElement;
  as: React.ElementType<any>;
  field: ControllerRenderProps<TFieldValues, TName>;
  error?: string;
  type: "text" | "date" | "number" | "select" | "password" | "email";
} & TComponentProps;

export const Rfield = <
  TComponentProps extends object,
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({
  label,
  as: Component,
  field,
  error,
  ...rest
}: RFieldProps<TComponentProps, TFieldValues, TName>) => {
  const Comp = Component as React.ElementType;
  return (
    <Form.Group>
      <Form.ControlLabel className="flex! items-center gap-2 font-medium text-gray-700 mb-2 w-full">
        {label}
      </Form.ControlLabel>
      <Comp
        {...(rest as TComponentProps)}
        id={field.name}
        value={field.value}
        onChange={field.onChange}
      />
      {error && (
        <Form.ErrorMessage show={error as unknown as boolean}>
          {error}
        </Form.ErrorMessage>
      )}
    </Form.Group>
  );
};
