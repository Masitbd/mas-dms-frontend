/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { formatDate } from "./formateDate";

type TReportHeder = {
  data: any;
  startDate?: Date | null;
  endDate?: Date | null;
  name: string;
};

const ReporetHeader: React.FC<TReportHeder> = ({
  data,
  startDate,
  endDate,
  name,
}) => {
  return (
    <div className="text-center mb-10 flex flex-col items-center justify-center">
      <div className="text-2xl font-bold flex items-center justify-center gap-5 mb-2">
        <p>{data?.branchInfo?.name}</p>
      </div>
      <p>{data?.branchInfo?.address1}</p>
      <p>HelpLine:{data?.branchInfo?.phone} </p>
      <p className="font-semibold my-1">
        VAT Registration No:{data?.branchInfo?.vatNo}{" "}
      </p>
      <div className="w-full h-[2px] bg-black"></div>
      <p className="italic text-red-600 text-center mb-5 font-semibold">
        {name} {startDate && formatDate(startDate)}
        {startDate && endDate ? ` to ${formatDate(endDate)}` : ""}
      </p>
    </div>
  );
};

export default ReporetHeader;
