"use client";
import CategroyHeader from "@/components/category/CategoryHeader";
import CategoryTable from "@/components/category/CategoryTable";
import RPagination from "@/components/RPagination";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetCategoriesQuery } from "@/redux/api/categories/category.api";
import React from "react";

const Category = () => {
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: categoryData,
    isLoading,
    isFetching,
  } = useGetCategoriesQuery(query);
  return (
    <div>
      <div className="my-2">
        <CategroyHeader addField={addField} />
      </div>
      <div>
        <CategoryTable
          data={categoryData?.data}
          isLoading={isLoading || isFetching}
        />
      </div>
      <div>
        <RPagination
          addField={addField}
          deleteField={deleteField}
          query={query}
          total={categoryData?.meta?.total}
        />
      </div>
    </div>
  );
};

export default Category;
