/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { useGetPurchasesQuery } from "@/redux/api/purchase/purchase.api";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Table, Button } from "rsuite";

type IMedicineCategoryTableProps = {
  isLoading: boolean;
  data: any[];
};
const MedicineCategoryTable = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const router = useRouter();

  const { data: purchaseData } = useGetPurchasesQuery({ limit: 1000 });

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
        <Column flexGrow={1.5}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData) => {
              return (
                <Button
                  appearance="link"
                  size="lg"
                  onClick={() =>
                    router.push(
                      `/medicine-purchase/new?mode=${ENUM_MODE.UPDATE}&id=${rowData?._id}`
                    )
                  }
                  startIcon={<Edit className="w-3 h-3" />}
                  color="blue"
                />
              );
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default MedicineCategoryTable;
