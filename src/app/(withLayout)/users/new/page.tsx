"use client";

import UserAdd from "@/components/users/UserAdd";
import { Suspense } from "react";
import { Loader } from "rsuite";

const CreateNew = () => {
  return (
    <Suspense fallback={<Loader />}>
      <UserAdd />
    </Suspense>
  );
};

export default CreateNew;
