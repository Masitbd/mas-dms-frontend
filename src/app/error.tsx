"use client";
import React from "react";
import RemindFillIcon from "@rsuite/icons/RemindFill";
import { Button } from "rsuite";
import { NavLink } from "@/components/layout/Navlink";

const ErrorPage = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center flex-col">
      <div className="text-9xl">
        <RemindFillIcon className="text-red-600" />
      </div>
      <div className="text-6xl font-bold">OOPS!</div>
      <div className="text-5xl">Something went wrong.</div>
      <div className="my-5">
        <NavLink href={"/"}>
          <Button appearance="primary" color="blue" size="lg">
            Back To Homepage
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default ErrorPage;
