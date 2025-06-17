/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import notFound from "../assets/images/notFound.png";
import { Button } from "rsuite";
import { NavLink } from "@/components/layout/Navlink";

const NotFoundPage = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center flex-col">
      <div className="flex flex-col">
        <Image src={notFound} height={1000} width={1000} alt="Not Found Page" />
      </div>
      <div className="text-6xl font-extrabold ">Not Found</div>
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

export default NotFoundPage;
