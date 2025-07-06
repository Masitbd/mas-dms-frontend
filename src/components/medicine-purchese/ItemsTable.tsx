import React from "react";
import { Table, Button, Tag, Panel } from "rsuite";
import { Plus, Package, Trash2, Edit } from "lucide-react";
import { PurchaseDetailItem } from "../forms/ItemDetailsForm";

const { Column, HeaderCell, Cell } = Table;

interface ItemsTableProps {
  items: PurchaseDetailItem[];
  onAddItem: () => void;
  onEditItem?: (item: PurchaseDetailItem) => void;
  onDeleteItem?: (id: string) => void;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid Date";

      return dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "৳0.00";

    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) return "৳0.00";

    return `৳${numericAmount.toFixed(2)}`;
  };

  const ActionCell = ({ rowData, ...props }: any) => (
    <Cell {...props} className="link-group">
      <div className="flex gap-2">
        {onEditItem && (
          <Button
            appearance="link"
            size="xs"
            onClick={() => onEditItem(rowData)}
            startIcon={<Edit className="w-3 h-3" />}
            color="blue"
          ></Button>
        )}
        {onDeleteItem && (
          <Button
            appearance="link"
            size="xs"
            color="red"
            onClick={() => onDeleteItem(rowData.id)}
            startIcon={<Trash2 className="w-3 h-3" />}
          ></Button>
        )}
      </div>
    </Cell>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 m-0">
              Purchase Items
            </h3>
            <p className="text-gray-600 text-sm m-0">
              {items.length} items added
            </p>
          </div>
        </div>
        <Button
          appearance="primary"
          size="sm"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={onAddItem}
          className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
        >
          Add Item
        </Button>
      </div>

      <div className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No items added yet</p>
            <p className="text-sm">
              Click the "Add Item" button to add purchase details
            </p>
          </div>
        ) : (
          <div>
            <Table
              data={items}
              autoHeight
              className="w-full"
              rowHeight={40}
              headerHeight={45}
            >
              <Column flexGrow={0.5} align="center" fixed>
                <HeaderCell className="font-semibold bg-gray-50">
                  Category
                </HeaderCell>
                <Cell dataKey="category">
                  {(rowData: PurchaseDetailItem) => (
                    <Tag color="blue" size="sm">
                      {rowData.category || "N/A"}
                    </Tag>
                  )}
                </Cell>
              </Column>

              <Column flexGrow={1.5} fixed>
                <HeaderCell className="font-semibold bg-gray-50">
                  Medicine Name
                </HeaderCell>
                <Cell dataKey="medicineName" className="font-medium" />
              </Column>

              <Column align="center">
                <HeaderCell className="font-semibold bg-gray-50">
                  Qty
                </HeaderCell>
                <Cell dataKey="quantity" />
              </Column>

              <Column width={100} align="right">
                <HeaderCell className="font-semibold bg-gray-50">
                  P Rate
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) =>
                    formatCurrency(rowData.purchaseRate)
                  }
                </Cell>
              </Column>

              <Column width={100} align="right">
                <HeaderCell className="font-semibold bg-gray-50">
                  Amount
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) => (
                    <span className="font-semibold text-green-600">
                      {formatCurrency(rowData.amount)}
                    </span>
                  )}
                </Cell>
              </Column>

              <Column width={100} align="right">
                <HeaderCell className="font-semibold bg-gray-50">
                  S Rate
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) =>
                    formatCurrency(rowData.salesRate)
                  }
                </Cell>
              </Column>

              <Column width={110} align="center">
                <HeaderCell className="font-semibold bg-gray-50">
                  Expiry
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) => (
                    <span className="text-sm">
                      {formatDate(rowData.dateExpire)}
                    </span>
                  )}
                </Cell>
              </Column>

              <Column width={110} align="center">
                <HeaderCell className="font-semibold bg-gray-50">
                  Mfg Date
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) => (
                    <span className="text-sm">
                      {formatDate(rowData.dateMfg)}
                    </span>
                  )}
                </Cell>
              </Column>

              <Column width={80} align="center">
                <HeaderCell className="font-semibold bg-gray-50">
                  VAT
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) => {
                    const vat =
                      typeof rowData.vat === "number"
                        ? rowData.vat
                        : parseFloat(rowData.vat as string) || 0;
                    return `${vat}%`;
                  }}
                </Cell>
              </Column>

              <Column width={80} align="center">
                <HeaderCell className="font-semibold bg-gray-50">
                  Discount
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) => {
                    const discount =
                      typeof rowData.discount === "number"
                        ? rowData.discount
                        : parseFloat(rowData.discount as string) || 0;
                    return `${discount}%`;
                  }}
                </Cell>
              </Column>

              <Column width={100} align="right">
                <HeaderCell className="font-semibold bg-gray-50">
                  Balance
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) => (
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(rowData.balance)}
                    </span>
                  )}
                </Cell>
              </Column>

              <Column width={80} align="center">
                <HeaderCell className="font-semibold bg-gray-50">
                  Status
                </HeaderCell>
                <Cell>
                  {(rowData: PurchaseDetailItem) => (
                    <Tag color="green" size="sm">
                      {rowData.posted || "N/A"}
                    </Tag>
                  )}
                </Cell>
              </Column>

              {(onEditItem || onDeleteItem) && (
                <Column width={120} align="center" fixed="right">
                  <HeaderCell className="font-semibold bg-gray-50">
                    Actions
                  </HeaderCell>
                  <ActionCell />
                </Column>
              )}
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
