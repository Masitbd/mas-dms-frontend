import { NavLink } from "@/components/layout/Navlink";
import { ENUM_BASEPATH } from "@/enums/ENumBasePath";
import Image from "next/image";
import React from "react";
import { Button } from "rsuite";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen flex-col">
      <div className="text-5xl font-bold">OOPS !</div>
      <Image
        src={`${ENUM_BASEPATH.PATH}error_401.png`}
        height={1000}
        width={600}
        alt="Unauthorized page"
      />

      <div className="text-4xl font-bold">
        You are not authorized to access this page
      </div>
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

export default Unauthorized;
