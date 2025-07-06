import * as yup from "yup";

export const medicinePurchaseSchema = yup
  .object({
    challanNo: yup.string().required(),
    age: yup.number().positive().integer().required(),
  })
  .required();
