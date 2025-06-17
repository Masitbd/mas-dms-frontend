import React from "react";
import { Input, InputProps } from "rsuite";
import { WithAsProps } from "rsuite/esm/internals/types";
import { Omit } from "rsuite/esm/internals/types/utils";

const TextArea = (
  props: React.JSX.IntrinsicAttributes &
    Omit<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      WithAsProps<"input"> & InputProps
    > &
    WithAsProps<"input"> &
    InputProps & { children?: React.ReactNode | undefined }
) => {
  return <Input as="textarea" {...props} />;
};

export default TextArea;
