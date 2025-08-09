/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, Table } from "rsuite";

type ICategoryTableProps = {
  isLoading: boolean;
  data: any[];
};
const MedicineSalesTable = ({ data, isLoading }: ICategoryTableProps) => {
  const { Cell, Column, HeaderCell } = Table;

  return (
    <div>
      <Table data={data} loading={isLoading} autoHeight>
        <Column flexGrow={1}>
          <HeaderCell>Invoice No</HeaderCell>
          <Cell dataKey="invoice_no" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Total Amount</HeaderCell>
          <Cell dataKey="paymentId.amount" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Posted By</HeaderCell>
          <Cell dataKey="posted_by" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="flex gap-3 justify-center">
                <Link href={`/category/${rowData._id}?mode=${ENUM_MODE.VIEW}`}>
                  <Button appearance="primary" color="blue" size="xs">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/category/${rowData._id}`}>
                  <Button appearance="primary" color="green" size="xs">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default MedicineSalesTable;
