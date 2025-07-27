/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPurchasesQuery } from "@/redux/api/purchase/purchase.api";
import React from "react";
import { Table } from "rsuite";

type IMedicineCategoryTableProps = {
  isLoading: boolean;
  data: any[];
};
const MedicineCategoryTable = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  const { data: purchaseData } = useGetPurchasesQuery({ limit: 1000 });
  console.log(purchaseData);
  return (
    <div>
      <Table data={purchaseData?.data} autoHeight>
        <Column flexGrow={1}>
          <HeaderCell>Invoice No.</HeaderCell>
          <Cell dataKey="invoiceNo" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Supplier Name</HeaderCell>
          <Cell dataKey="supplierId.name" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Total</HeaderCell>
          <Cell dataKey="totalAmount" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Paid Amount</HeaderCell>
          <Cell dataKey="paidAmount" />
        </Column>
      </Table>
    </div>
  );
};

export default MedicineCategoryTable;
