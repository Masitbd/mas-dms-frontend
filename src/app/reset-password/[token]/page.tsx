"use client";
import { useResetPasswordMutation } from "@/redux/api/users/user.api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Schema } from "rsuite";
import Swal from "sweetalert2";

const ResetPassword = (params: any) => {
  const ref = useRef<any>(undefined);
  const router = useRouter();
  const { StringType } = Schema.Types;
  const [post, { isLoading: passwordResetLoading }] =
    useResetPasswordMutation();
  const [passwordData, setPasswordData] = useState<Record<string, string>>({
    newPassword: "",
    confirmPassword: "",
  });
  const model = Schema.Model({
    newPassword: StringType().isRequired("This field is required."),
    confirmPassword: StringType()
      .isRequired("This field is required.")
      .addRule(
        (value, data) => value === data.newPassword,
        "Passwords do not match."
      ),
  });
  const postHandler = async () => {
    if (!ref?.current?.check()) {
      Swal.fire("Error", "Fill in all the form fields", "error");
      return;
    }
    const data = {
      newPassword: passwordData.newPassword,
      token: params.token,
    };
    try {
      const result = await post(data).unwrap();
      if (result?.success) {
        Swal.fire("Success", "Password changed successfully", "success");
        router.push("/login");
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      Swal.fire("Error", `${error}`, "error");
    }
  };

  return (
    <div className=" h-[100vh] flex items-center justify-center">
      <div className="h-96 w-96 shadow-lg p-4 border border-stone-200">
        <h1 className="font-[Roboto] text-3xl font-bold text-center mt-5 text-stone-700">
          Enter your new Password
        </h1>

        <div className="mt-10">
          <Form
            fluid
            className="w-full"
            onChange={setPasswordData}
            formValue={passwordData}
            ref={ref}
            model={model}
          >
            <Form.Group>
              <Form.ControlLabel>New Password</Form.ControlLabel>
              <Form.Control name="newPassword" size="lg" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Re-enter Your password</Form.ControlLabel>
              <Form.Control name="confirmPassword" size="lg" />
            </Form.Group>
          </Form>

          <div className="mt-5 flex items-end justify-end">
            <Button
              appearance="primary"
              color="blue"
              size="lg"
              onClick={() => postHandler()}
              loading={passwordResetLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
