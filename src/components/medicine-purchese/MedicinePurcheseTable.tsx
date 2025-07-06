/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table } from "rsuite";

type IMedicineCategoryTableProps = {
  isLoading: boolean;
  data: any[];
};
const MedicineCategoryTable = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  return (
    <div>
      <Table>
        <Column flexGrow={1}>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Category Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Action</HeaderCell>
          <Cell dataKey="id" />
        </Column>
      </Table>
    </div>
  );
};

export default MedicineCategoryTable;
