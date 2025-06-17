import { Schema } from "rsuite";

export const model = Schema.Model({
  email: Schema.Types.StringType()
    .isRequired("Email is required")
    .isEmail("Email must be valid"),
  password: Schema.Types.StringType().isRequired("Password is required"),
});
export type ILoginData = { email: string; password: string };
