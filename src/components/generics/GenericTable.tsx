/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, Table } from "rsuite";

type IGenericTableProps = {
  isLoading: boolean;
  data: any[];
};
const GenericTable = ({ data, isLoading }: IGenericTableProps) => {
  const { Cell, Column, HeaderCell } = Table;

  return (
    <div>
      <Table data={data} loading={isLoading} autoHeight>
        <Column flexGrow={1}>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="genericId" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Generic Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="flex gap-3 justify-center">
                <Link href={`/generics/${rowData._id}?mode=${ENUM_MODE.VIEW}`}>
                  <Button appearance="primary" color="blue" size="xs">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/generics/${rowData._id}`}>
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

export default GenericTable;
