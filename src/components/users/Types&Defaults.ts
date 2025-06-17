/* eslint-disable @typescript-eslint/no-explicit-any */

import { ENUM_MODE } from "@/enums/EnumMode";
import { Schema } from "rsuite";

const { StringType, NumberType, DateType } = Schema.Types;

export const userFormSchema = Schema.Model({
  name: StringType().isRequired("Name is required."),
  motherName: StringType().isRequired("Mother Name is required."),
  fatherName: StringType().isRequired("Father Name is required."),
  age: NumberType()
    .isInteger("Age must be an integer.")
    .min(1, "Age must be at least 1.")
    .max(120, "Age must be less than or equal to 120.")
    .isRequired("Age is required."),
  dateOfBirth: DateType().isRequired("Date of Birth is required."),
  gender: StringType().isRequired("Gender is required."),
  role: StringType().isRequired("Role is required."),
  phone: StringType()
    .isRequired("Phone number is required.")
    .pattern(
      /^[0-9]{10}$/,
      "Phone number must be 10 digits and only contain numbers."
    ),
  email: StringType()
    .isEmail("Please enter a valid email address.")
    .isRequired("Email is required."),
  address: StringType().isRequired("Address is required."),
  password: StringType()
    .isRequired("Password is required.")
    .minLength(8, "Password must be at least 8 characters long.")
    .addRule(
      (value) => /[A-Z]/.test(value),
      "Password must contain at least one uppercase letter."
    )
    .addRule(
      (value) => /[a-z]/.test(value),
      "Password must contain at least one lowercase letter."
    )
    .addRule(
      (value) => /[0-9]/.test(value),
      "Password must contain at least one number."
    )
    .addRule(
      (value) => /[@$!%*?&]/.test(value),
      "Password must contain at least one special character (e.g., @, $, !, %, *, ?, &)."
    ),
  confirmPassword: StringType()
    .isRequired("Confirm Password is required.")
    .addRule(
      (value, formData) => value === formData.password,
      "Passwords do not match."
    ),
});

type IUserSearchAndFilterProps = {
  addField: (fieldName: string, value: any) => void;
  deleteField: (fieldName: string) => void;
  getQuery: Record<string, any>;
};

export type IProfile = {
  name: string;
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  uuid?: string;
  age: string;
  dateOfBirth: Date;
  gender: string;
};

export type IUserResponse = {
  id: string;
  uuid: string;
  role: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  profile?: IProfile;
  status: string;
  email: string;
};

export type IUser = {
  uuid: string;
  role: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  profile?: string | IProfile;
  status: string;
  email: string;
  branch: string;
};
export type IUserPost = {
  role: string;
  password?: string;
  profile: IProfile;
  email: string;
  branch?: string;
};

export type IuserFormData = {
  _id: string;
  role: string;
  password?: string;
  name: string;
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  age: string;
  dateOfBirth: Date;
  gender: string;
  uuid?: string;
  branch: string;
};

export const PasswordFieldChangeModel = Schema.Model({
  password: StringType()
    .isRequired("Password is required.")
    .minLength(8, "Password must be at least 8 characters long.")
    .addRule(
      (value) => /[A-Z]/.test(value),
      "Password must contain at least one uppercase letter."
    )
    .addRule(
      (value) => /[a-z]/.test(value),
      "Password must contain at least one lowercase letter."
    )
    .addRule(
      (value) => /[0-9]/.test(value),
      "Password must contain at least one number."
    )
    .addRule(
      (value) => /[@$!%*?&]/.test(value),
      "Password must contain at least one special character (e.g., @, $, !, %, *, ?, &)."
    ),
  confirmPassword: StringType()
    .isRequired("Confirm Password is required.")
    .addRule(
      (value, formData) => value === formData.password,
      "Passwords do not match."
    ),
});
