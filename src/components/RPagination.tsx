/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Pagination } from "rsuite";

const RPagination = (props: {
  total: number;
  addField: (fieldName: string, value: any) => void;
  deleteField: (fieldName: string) => void;
  query: Record<string, any>;
}) => {
  const { query, total } = props;
  return (
    <div className="my-2">
      <Pagination
        layout={["total", "-", "limit", "|", "pager", "skip"]}
        size={"md"}
        prev={true}
        next={true}
        first={true}
        last={true}
        ellipsis={true}
        boundaryLinks={true}
        total={total ?? 0}
        limit={query?.limit ?? 10}
        limitOptions={[10, 20, 50]}
        maxButtons={5}
        activePage={props.query?.page}
        onChangePage={(v: number) => props.addField("page", v)}
        onChangeLimit={(v: number) => props.addField("limit", v)}
      />
    </div>
  );
};

export default RPagination;
