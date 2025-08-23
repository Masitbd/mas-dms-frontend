/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { useDeleteMedicineSalesMutation } from "@/redux/api/medicines/sales.api";
import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, ButtonToolbar, Message, Table } from "rsuite";
import Swal from "sweetalert2";

type ICategoryTableProps = {
  isLoading: boolean;
  data: any[];
};
const MedicineSalesTable = ({ data, isLoading }: ICategoryTableProps) => {
  const { Cell, Column, HeaderCell } = Table;

  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteMedicineSalesMutation();

  const handleDelete = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await deleteItem(id).unwrap();
          if (result?.success) {
            Swal.fire({
              title: "Deleted!",
              timer: 1500,
              toast: true,
              position: "top-end",
              showConfirmButton: false,

              timerProgressBar: true,
              icon: "success",
            });
          }
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong",
        timer: 1500,
        toast: true,
        position: "top-end",
        showConfirmButton: false,

        timerProgressBar: true,
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Table data={data} loading={isLoading} autoHeight>
        <Column flexGrow={1}>
          <HeaderCell>Invoice No</HeaderCell>
          <Cell dataKey="invoice_no" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Total Amount</HeaderCell>
          <Cell dataKey="paymentId.totalBill" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Total Dis</HeaderCell>
          <Cell dataKey="paymentId.totalDiscount" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Payable</HeaderCell>
          <Cell dataKey="paymentId.netPayable" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Due</HeaderCell>
          <Cell dataKey="paymentId.due" />
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
                <Link href={`/medicine-sale/${rowData._id}`}>
                  <Button appearance="ghost" color="green" size="xs">
                    <Pencil size={15} />
                  </Button>
                </Link>

                <Button
                  onClick={() => handleDelete(rowData._id)}
                  appearance="primary"
                  color="red"
                  size="xs"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default MedicineSalesTable;
