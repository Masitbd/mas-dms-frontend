/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, Table } from "rsuite";
import { ISupplierFormData } from "./Supplier.interface";

type ITableProps = {
  isLoading: boolean;
  data: any[];
};
const SupplierTable = ({ data, isLoading }: ITableProps) => {
  const { Cell, Column, HeaderCell } = Table;

  return (
    <div>
      <Table data={data} loading={isLoading} autoHeight hover bordered>
        <Column flexGrow={1}>
          <HeaderCell>Supplier ID</HeaderCell>
          <Cell dataKey="supplierId" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Contact Peon</HeaderCell>
          <Cell dataKey="contactPeon" />
        </Column>

        <Column flexGrow={3}>
          <HeaderCell>Address</HeaderCell>
          <Cell dataKey="address" />
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>Phone</HeaderCell>
          <Cell dataKey="phone" />
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>Fax</HeaderCell>
          <Cell dataKey="fax" />
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>City</HeaderCell>
          <Cell dataKey="city" />
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>Country</HeaderCell>
          <Cell dataKey="country" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData: ISupplierFormData & { _id: string }) => (
              <div className="flex gap-3 justify-center">
                <Link href={`/supplier/${rowData._id}?mode=${ENUM_MODE.VIEW}`}>
                  <Button appearance="primary" color="blue" size="xs">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/supplier/${rowData.supplierId}`}>
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

export default SupplierTable;
