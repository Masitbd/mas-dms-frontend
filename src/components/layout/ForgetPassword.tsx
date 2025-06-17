import { tree } from "next/dist/build/templates/app-page";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "rsuite";
import { resetPasswordModel } from "./consumerProfileHelper";
import { useForgetPasswordMutation } from "@/redux/api/users/user.api";
import Swal from "sweetalert2";

const ForgetPassword = ({
  email,
  resetModalOpen,
  setResetModalOpen,
  showText,
}: {
  email?: string;
  resetModalOpen: boolean;
  setResetModalOpen: React.Dispatch<SetStateAction<boolean>>;
  showText?: boolean;
}) => {
  const [forgetPassword, { isLoading: forgetPasswordLoading }] =
    useForgetPasswordMutation();
  const defaultData = { email: "" };
  const ref = useRef<any>(undefined);
  const [formData, setFormData] = useState<Record<string, any>>(defaultData);
  useEffect(() => {
    if (email) {
      setFormData({ email: email });
    }
  }, [email]);

  const submitHandler = async () => {
    if (!ref?.current?.check()) {
      return;
    } else {
      try {
        const result = await forgetPassword({
          email: formData.email,
        }).unwrap();
        if (result?.success) {
          setResetModalOpen(false);
          Swal.fire(
            "Success",
            result?.data?.message ?? "Check your Email",
            "success"
          );
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          (error ?? "Failed to reset password") as string,
          "error"
        );
      }
    }
  };
  const closeHandler = () => {
    setResetModalOpen(false);
    setFormData({ email: email });
  };
  return (
    <div>
      <div>
        {showText ? (
          <div
            className="text-center  text-blue-600 cursor-pointer"
            onClick={() => setResetModalOpen(true)}
          >
            Forget Password ?
          </div>
        ) : (
          <Button
            appearance="primary"
            color="blue"
            onClick={() => setResetModalOpen(true)}
          >
            Forget Password
          </Button>
        )}
      </div>
      <Modal open={resetModalOpen} className="!mt-36" onClose={closeHandler}>
        <>
          <h1 className="text-3xl font-bold text-center my-5">
            Reset Password
          </h1>
          <div className="text-sm text-slate-500 my-5">
            Enter your Email. A mail will be sent to your email address
          </div>
          <Form
            fluid
            model={resetPasswordModel}
            ref={ref}
            onChange={setFormData}
            formValue={formData}
          >
            <Form.Group controlId="email">
              <Form.Control name="email" type="text" placeholder="E-mail" />
            </Form.Group>
          </Form>
          <div className="flex items-end justify-end mt-5">
            <Button
              appearance="primary"
              color="blue"
              onClick={submitHandler}
              //   disabled={resetFromData?.uuid?.length == 0}
              loading={forgetPasswordLoading}
            >
              Reset Password
            </Button>
            <Button
              className="mx-4"
              appearance="primary"
              color="red"
              onClick={closeHandler}
              //   disabled={resetFromData?.uuid?.length == 0}
              loading={forgetPasswordLoading}
            >
              Cancel
            </Button>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default ForgetPassword;
