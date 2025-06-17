import { ENUM_PROVIDER } from "@/enums/ProviderEnum";
import { useSignUpByUserMutation } from "@/redux/api/users/user.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Checkbox, Divider, Form } from "rsuite";
import Swal from "sweetalert2";

const SingupForm = () => {
  const router = useRouter();
  const [formData, setFormdata] = useState<Record<string, string>>();
  const [post, { isLoading }] = useSignUpByUserMutation();
  const handleSIgnUp = async () => {
    const userData = {
      name: formData?.name,
      email: formData?.email,
      password: formData?.password,
      provider: ENUM_PROVIDER.LOCAL,
    };

    try {
      const result = await post(userData).unwrap();
      if (result.success) {
        Swal.fire("success", "Account Created successfully", "success");
        router?.push("/login");
      }
    } catch (error) {
      Swal.fire("Error", (error ?? "Failed to sign up") as string, "error");
    }
  };
  return (
    <Form
      fluid
      className="lg:w-[50%] w-[80%]  user-signup-form"
      onChange={setFormdata}
      formValue={formData}
    >
      <h2 className="text-4xl font-semibold my-5">Get Started Now</h2>
      <Form.Group controlId="name">
        <Form.ControlLabel className="text-lg font-bold font-roboto">
          Name
        </Form.ControlLabel>
        <Form.Control name="name" placeholder="Enter name" size="lg" />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.ControlLabel className="text-lg font-bold font-roboto">
          Email
        </Form.ControlLabel>
        <Form.Control name="email" placeholder="Enter Email" size="lg" />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.ControlLabel className="text-lg font-bold font-roboto">
          Password
        </Form.ControlLabel>
        <Form.Control name="password" placeholder="password" size="lg" />
      </Form.Group>

      <Form.Group controlId="username" className="flex flex-row">
        <Form.Control
          name="userName"
          placeholder="Enter username"
          size="lg"
          accepter={Checkbox}
        >
          I agree to the{" "}
          <Link href={"/terms"}>
            <span className="text-blue-600">Terms And Policy</span>
          </Link>
        </Form.Control>
      </Form.Group>

      <Button
        className="w-full text-lg"
        size="lg"
        style={{ backgroundColor: "#FC8A06", fontWeight: "bold" }}
        appearance="primary"
        loading={isLoading}
        disabled={isLoading}
        onClick={() => handleSIgnUp()}
      >
        Submit
      </Button>
      <div className=" flex flex-row items-center mt-5">
        <Divider />
        <span className="mx-4"> Or</span>
        <Divider />
        <div></div>
      </div>

      <div className=" flex items-center justify-center">
        Already have an account ?
        <Link href={"/login"}>
          <span className="text-blue-600"> Login</span>
        </Link>
      </div>
    </Form>
  );
};

export default SingupForm;
