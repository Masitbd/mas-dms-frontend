"use client";
import { ENUM_BASEPATH } from "@/enums/ENumBasePath";
import { SessionProvider } from "next-auth/react";
import React from "react";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider basePath={`${ENUM_BASEPATH.PATH}api/auth`}>
      {children}
    </SessionProvider>
  );
};

export default SessionWrapper;
