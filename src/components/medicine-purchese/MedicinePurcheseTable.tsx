/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import { useGetPurchasesQuery } from "@/redux/api/purchase/purchase.api";
import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Table, Button } from "rsuite";
import RPagination from "../RPagination";

const MedicineCategoryTable = ({
  query,
  addField,
  deleteField,
}: {
  query: any;
  addField: (fieldName: string, value: any) => void;
  deleteField: (fieldName: string) => void;
}) => {
  const { Cell, Column, HeaderCell } = Table;
  const router = useRouter();

  const {
    data: purchaseData,
    isLoading: purchaseDataLoading,
    isFetching: purchaseDataFetching,
  } = useGetPurchasesQuery(query);
  return (
    <>
      <div>
        <Table
          data={purchaseData?.data}
          autoHeight
          loading={purchaseDataLoading || purchaseDataFetching}
        >
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
                  <>
                    <div className="gap-2 flex">
                      <Button
                        appearance="primary"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/medicine-purchase/new?mode=${ENUM_MODE.UPDATE}&id=${rowData?._id}`
                          )
                        }
                        startIcon={<Edit className="w-3 h-3" />}
                        color="blue"
                      />
                      <Button
                        appearance="primary"
                        size="sm"
                        onClick={() =>
                          router.push(`/medicine-purchase/${rowData?._id}`)
                        }
                        startIcon={<Eye className="w-3 h-3" />}
                        color="green"
                      />
                    </div>
                  </>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
      <div>
        <RPagination
          addField={addField}
          deleteField={deleteField}
          query={query}
          total={purchaseData?.meta?.total ?? 0}
        />
      </div>
    </>
  );
};

export default MedicineCategoryTable;
