"use client";
import GenericHeader from "@/components/generics/GenericHeader";
import GenericTable from "@/components/generics/GenericTable";
import RPagination from "@/components/RPagination";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetGenericsQuery } from "@/redux/api/generics/generic.api";
import React from "react";

const Generic = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: genericData,
    isLoading,
    isFetching,
  } = useGetGenericsQuery(query);

  return (
    <div>
      <div className="my-2">
        <GenericHeader addField={addField} />
      </div>
      <div>
        <GenericTable
          data={genericData?.data}
          isLoading={isLoading || isFetching}
        />
      </div>
      <div>
        <RPagination
          addField={addField}
          deleteField={deleteField}
          query={query}
          total={genericData?.meta?.total}
        />
      </div>
    </div>
  );
};

export default Generic;
