import React, { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border border-[#c2c4c9] rounded-lg p-2 bg-white">
      {children}
    </div>
  );
};

export default Container;
