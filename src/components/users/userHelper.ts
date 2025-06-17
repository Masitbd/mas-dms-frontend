/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from "sweetalert2";
import {
  IProfile,
  IUser,
  IuserFormData,
  IUserPost,
  IUserResponse,
} from "./Types&Defaults";

import Message, { toaster } from "rsuite";
import { ENUM_MODE } from "@/enums/EnumMode";
import {
  IUseCreateUserMutation,
  IUserDeleteMutation,
  IUserUpdateUserProfileMutation,
} from "@/redux/api/users/user.api";
import { Schema } from "rsuite";
import { ENUM_USER } from "@/enums/EnumUser";

const { StringType, NumberType, DateType } = Schema.Types;
export const deleteUser = async (uuid: string, fn: IUserDeleteMutation[0]) => {
  try {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003CFF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete User!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await fn(uuid)?.unwrap();

        if (result?.success) {
          Swal.fire("Success", result?.message ?? "User deleted", "success");
        }
      }
    });
  } catch (err) {
    Swal.fire("Error", (err ?? "Failed to change status") as string, "error");
  }
};

export const userDataFormatter = (
  data: IuserFormData,
  mode: string
): (IUserPost | IProfile) & { branch?: string } => {
  const profileData: IProfile & { branch?: string } = {
    name: data?.name,
    phone: data?.phone,
    address: data?.address,
    dateOfBirth: data?.dateOfBirth,
    gender: data?.gender,
    fatherName: data?.fatherName,
    motherName: data?.motherName,
    age: data?.age,
    email: data?.email,
  };
  const userData: IUserPost = {
    email: data?.email,
    role: data?.role,
    profile: profileData,
  };

  if (data?.branch) {
    userData.branch = data?.branch;
  }
  if (mode == ENUM_MODE.NEW) {
    userData["password"] = data?.password;
    return userData;
  }
  if (mode == ENUM_MODE.UPDATE) {
    profileData.uuid = data?.uuid;
    profileData.branch = data?.branch as keyof IProfile;
  }
  return profileData;
};

const successHandler = (message: string) => {
  Swal.fire({
    title: "Success",
    text: message,
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  });
};

const errorHandler = (message: string) => {
  Swal.fire({
    title: "Error",
    text: message,
    icon: "error",
  });
};

export const userPostHandler = async (
  data: IUserPost,
  fn: IUseCreateUserMutation[0]
) => {
  try {
    const result = await fn(data).unwrap();
    if (result?.success) {
      successHandler(result?.message ?? "User created successfully");
    }
  } catch (error) {
    errorHandler((error ?? "Failed to create user") as string);
  }
};

export const userUpdateHandler = async (
  data: IProfile,
  fn: IUserUpdateUserProfileMutation[0]
) => {
  try {
    console.log(data);
    const result = await fn({
      profile: data,
      uuid: data?.uuid as string,
    }).unwrap();
    if (result?.success) {
      successHandler(result?.message ?? "User created successfully");
    }
  } catch (error) {
    errorHandler((error ?? "Failed to create user") as string);
  }
};

export const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const roles = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

export const userModelProvider = (
  mode: ENUM_MODE
): typeof Schema.Model<IuserFormData> => {
  console.log(mode);
  const userFormSchema: Record<
    keyof (IuserFormData & { confirmPassword?: string }),
    any
  > = {
    name: StringType().isRequired("Name is required."),

    dateOfBirth: DateType().isRequired("Date of Birth is required."),
    gender: StringType().isRequired("Gender is required."),
    role: StringType().isRequired("Role is required."),
    phone: StringType()
      .isRequired("Phone number is required.")
      .pattern(
        /^[0-9]{11}$/,
        "Phone number must be 11 digits and only contain numbers."
      ),
    email: StringType()
      .isEmail("Please enter a valid email address.")
      .isRequired("Email is required."),
    address: StringType().isRequired("Address is required."),
  } as Record<keyof (IuserFormData & { confirmPassword?: string }), any>;

  if (mode == ENUM_MODE.NEW) {
    userFormSchema.password = StringType()
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
      );

    userFormSchema.confirmPassword = StringType()
      .isRequired("Confirm Password is required.")
      .addRule(
        (value, formData) => value === formData.password,
        "Passwords do not match."
      );
  }

  return Schema.Model(userFormSchema) as any;
};

export const userRoleProviderForNewUser = (userRole: string) => {
  const role = [];
  if (userRole === ENUM_USER.SUPER_ADMIN) {
    role.push(
      { label: "Admin", value: ENUM_USER.ADMIN },
      { label: "Manager", value: ENUM_USER.MANAGER },
      { label: "Cashier", value: ENUM_USER.CASHIER },
      { label: "Accountant", value: ENUM_USER.ACCOUNTANT },
      { label: "User", value: ENUM_USER.USER }
    );
  }
  if (userRole === ENUM_USER.ADMIN) {
    role.push(
      { label: "Manager", value: ENUM_USER.MANAGER },
      { label: "Cashier", value: ENUM_USER.CASHIER },
      { label: "Accountant", value: ENUM_USER.ACCOUNTANT },
      { label: "User", value: ENUM_USER.USER }
    );
  }
  if (userRole === ENUM_USER.MANAGER) {
    role.push(
      { label: "Cashier", value: ENUM_USER.CASHIER },
      { label: "Accountant", value: ENUM_USER.ACCOUNTANT }
    );
  }
  if (userRole === ENUM_USER.ACCOUNTANT) {
    role.push({ label: "User", value: ENUM_USER.USER });
  }
  if (userRole === ENUM_USER.CASHIER) {
    role.push({ label: "User", value: ENUM_USER.USER });
  }

  return role;
};
