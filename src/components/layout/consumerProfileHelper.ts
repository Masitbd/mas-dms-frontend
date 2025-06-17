import { Schema } from "rsuite";

const { StringType, NumberType } = Schema.Types;

export const deliveryLocationModel = Schema.Model({
  name: StringType().isRequired("Full Name is required."),
  phone: StringType().isRequired("Phone number is required."),
  landMark: StringType(), // Optional field
  division: StringType().isRequired("Division is required."),
  city: StringType().isRequired("City is required."),
  zone: StringType().isRequired("Zone is required."),
  address: StringType().isRequired("Address is required."),
});
export const divisionData = [
  "Barishal",
  "Chattogram",
  "Dhaka",
  "Khulna",
  "Mymensingh",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
];

export const initialFormData = {
  isDefault: false,
  name: "",
  city: "",
  landMark: "",
  division: "",
  zone: "",
  address: "",
  phone: "",
};

export interface TDeliveryAddress {
  name: string;
  phone: string;
  landMark: string;
  division: string;
  city: string;
  zone: string;
  address: string;
  userId: string;
  isDefault: boolean;
}

export const profileModal = Schema.Model({
  name: StringType().isRequired("Name is required"),
  email: StringType()
    .isEmail("Please enter a valid email")
    .isRequired("Email is required"),
  phone: StringType().addRule((value) => {
    if (value && !/^\d{10}$/.test(value)) {
      return false;
    }
    return true;
  }, "Please enter a valid 11-digit phone number"),
  age: NumberType().min(0, "Age cannot be negative"),
  gender: StringType(),
});

export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const initialProfileValue = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
};
export const resetPasswordModel = Schema.Model({
  email: StringType()
    .isEmail("Please enter a valid email")
    .isRequired("Email is required"),
});
