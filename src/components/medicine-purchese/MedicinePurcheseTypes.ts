import * as yup from "yup";

export const medicinePurchaseSchema = yup
  .object({
    challanNo: yup.string().required(),
    age: yup.number().positive().integer().required(),
  })
  .required();

import { useEffect, useRef } from "react";

export function useValueChange(newValue: any, callback: any) {
  const prevValue = useRef(newValue);
  useEffect(() => {
    if (
      prevValue.current[1] !== newValue[1] ||
      prevValue.current[2] !== newValue[2]
    ) {
      callback();
      prevValue.current = newValue;
    }
  }, [newValue]);
}
