/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { Eye, Pencil, Printer } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, Table } from "rsuite";
import { SALES_PATH } from "./SalesTypes";
import {
  useGetSaleUpdateQuery,
  useLazyGetSaleUpdateQuery,
} from "@/redux/api/sales-final/sales.api";
import { printInvoice } from "./SalesInvoicePrinter";

type ITableProps = {
  isLoading: boolean;

  data: any[];

  link1?: string;
  link2?: string;
  btn1Visibility?: boolean;
  btn2Visibility?: boolean;
};
const AllSalesTable = ({
  data,
  isLoading,
  btn1Visibility,
  btn2Visibility,
  link1,
  link2,
}: ITableProps) => {
  const { Cell, Column, HeaderCell } = Table;
  const [
    getSalesData,
    { isLoading: salesDataLoading, isFetching: salesDataFetching },
  ] = useLazyGetSaleUpdateQuery();

  const handlePdfPrinting = async (id: string) => {
    try {
      const salesData = await getSalesData(id).unwrap();
      if (salesData?.data?.length) {
        printInvoice(
          { ...salesData?.data[0], ...salesData?.data[0]?.current },
          "pos"
        );
      }
    } catch (error) {}
  };

  return (
    <div>
      <Table
        data={data}
        loading={isLoading || salesDataFetching || salesDataFetching}
        autoHeight
        hover
        bordered
        rowHeight={40}
        headerHeight={40}
        className="!text-sm"
      >
        <Column flexGrow={1}>
          <HeaderCell>Invoice No.</HeaderCell>
          <Cell dataKey="invoiceNo" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="current.customer.name" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Date</HeaderCell>
          <Cell>
            {(rowData) =>
              new Date(rowData?.createdAt).toLocaleDateString("en-GB")
            }
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Time</HeaderCell>
          <Cell>
            {(rowData) =>
              new Date(rowData?.createdAt).toLocaleTimeString("en-GB", {
                hour12: true,
              })
            }
          </Cell>
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>Customer Type</HeaderCell>
          <Cell className="capitalize">
            {(rowData) => rowData?.current?.customer?.mode || "N/A"}
          </Cell>
        </Column>

        <Column flexGrow={1.5}>
          <HeaderCell>Net Payable</HeaderCell>
          <Cell dataKey="current.finance.netPayable" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Paid</HeaderCell>
          <Cell dataKey="current.finance.paid" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell>Due</HeaderCell>
          <Cell dataKey="current.finance.due" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData: any) => (
              <div className="flex gap-3 justify-center">
                <Link
                  href={`${SALES_PATH}/view?id=${rowData._id}?mode=${ENUM_MODE.VIEW}`}
                >
                  <Button appearance="primary" color="blue" size="xs">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href={`${SALES_PATH}/update?id=${rowData._id}&mode=${ENUM_MODE.UPDATE}`}
                >
                  <Button appearance="primary" color="green" size="xs">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>

                <Button
                  appearance="ghost"
                  color="yellow"
                  size="xs"
                  onClick={() => handlePdfPrinting(rowData?._id)}
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default AllSalesTable;
