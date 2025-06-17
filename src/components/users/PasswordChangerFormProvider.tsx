/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { ENUM_USER } from "@/enums/EnumUser";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { Button, Form, FormInstance, Modal } from "rsuite";
import PasswordFieldProvider from "./PasswordFieldProvider";
import { useChangePasswordAdminMutation } from "@/redux/api/users/user.api";
import { PasswordFieldChangeModel } from "./Types&Defaults";
import Swal from "sweetalert2";

const PasswordChangerFormProvider = (props: { mode: string; id: string }) => {
  const ref = useRef<FormInstance<Record<string, string>>>(undefined);
  const [isOpen, setOpen] = useState(false);
  const [password, setPassword] = useState<Record<string, string>>();
  const [changePassword, { isLoading: changePasswordLoading }] =
    useChangePasswordAdminMutation();
  const session = useSession();

  const submitHandler = async () => {
    if (ref.current?.check()) {
      try {
        const result = await changePassword({
          data: { password: password?.password as string },
          id: props.id,
        }).unwrap();
        if (result.success) {
          Swal.fire(
            "Success",
            result?.message ?? "Password changed successfully",
            "success"
          );
          cancelHandler();
        }
      } catch (error) {
        Swal.fire(
          "Success",
          (error ?? "Internal Server Error") as string,
          "error"
        );
      }
    }
  };

  const cancelHandler = () => {
    setPassword({ password: "" });
    setOpen(!open);
  };
  if (props.mode == ENUM_MODE.NEW) {
    return null;
  }

  if (
    session?.data?.user.role == ENUM_USER.ADMIN ||
    session?.data?.user.role == ENUM_USER.SUPER_ADMIN
  ) {
    return (
      <>
        <div>
          <Button
            size="lg"
            appearance="primary"
            color="green"
            onClick={() => setOpen(!isOpen)}
          >
            Change Password
          </Button>
        </div>

        <Modal
          open={isOpen}
          size={"xs"}
          onAbort={cancelHandler}
          onClose={cancelHandler}
          backdrop={false}
        >
          <Modal.Header>Change User Password</Modal.Header>
          <Modal.Body>
            <div>
              <Form
                fluid
                onChange={setPassword}
                model={PasswordFieldChangeModel}
                ref={ref as any}
              >
                <PasswordFieldProvider />
              </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={cancelHandler} appearance="primary" color="red">
              Cancel
            </Button>
            <Button onClick={submitHandler} appearance="primary">
              Change Password
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else return null;
};

export default PasswordChangerFormProvider;
