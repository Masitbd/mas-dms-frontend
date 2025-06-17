"use client";
import { ENUM_BASEPATH } from "@/enums/ENumBasePath";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { Message, toaster } from "rsuite";

const LogoutPage = () => {
  useEffect(() => {
    signOut({
      callbackUrl: ENUM_BASEPATH.PATH + "unauthorized",
    });
  }, []);

  return <div></div>;
};

export default LogoutPage;
