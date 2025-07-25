/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, Table } from "rsuite";
import { TMedicineEntry } from "./medicineEntry.interface";

type ITableProps = {
  isLoading: boolean;
  data: any[];
};
const MedicineEntryTable = ({ data, isLoading }: ITableProps) => {
  const { Cell, Column, HeaderCell } = Table;

  return (
    <div>
      <Table data={data} loading={isLoading} autoHeight hover bordered>
        <Column flexGrow={1}>
          <HeaderCell>Medicine ID</HeaderCell>
          <Cell dataKey="medicineId" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Gen Name</HeaderCell>
          <Cell>{(rowData) => rowData.genericName?.name || "N/A"}</Cell>
        </Column>

        <Column flexGrow={3}>
          <HeaderCell>Category</HeaderCell>
          <Cell>{(rowData) => rowData.category?.name || "N/A"}</Cell>
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>Unit</HeaderCell>
          <Cell dataKey="unit" />
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>Sales Rate</HeaderCell>
          <Cell dataKey="salesRate" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Discount</HeaderCell>
          <Cell dataKey="discount" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData: TMedicineEntry) => (
              <div className="flex gap-3 justify-center">
                <Link
                  href={`/supplier/${rowData.medicineId}?mode=${ENUM_MODE.VIEW}`}
                >
                  <Button appearance="primary" color="blue" size="xs">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/supplier/${rowData.medicineId}`}>
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

export default MedicineEntryTable;
