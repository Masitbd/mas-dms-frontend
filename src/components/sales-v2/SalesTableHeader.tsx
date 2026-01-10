/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, Input, InputGroup, SelectPicker } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import Link from "next/link";
import { useGetSuppliersQuery } from "@/redux/api/suppliers/supplier.api";
const SalesHeader = ({
  addField,
  deleteField,
  query,
}: {
  addField: (fieldName: string, value: any) => void;
  deleteField: (fieldName: string) => void;
  query: any;
}) => {
  return (
    <div className="grid grid-cols-12 gap-3">
      <div>
        <Link href={"/tests/new"}>
          <Button appearance="primary" color="blue" size="lg">
            Add Sales
          </Button>
        </Link>
      </div>
      <div className="mx-2 w-full col-span-8">
        <InputGroup>
          <Input
            size="lg"
            onChange={(v) => addField("searchTerm", v)}
            placeholder="Invoice No."
            value={query?.searchTerm}
          />
          <InputGroup.Button>
            <SearchIcon />
          </InputGroup.Button>
        </InputGroup>
      </div>
      {/* <div className="col-span-3">
        <SelectPicker
          data={supplierData?.data?.map(
            (sd: { name: string; _id: string }) => ({
              label: sd?.name,
              value: sd?._id,
            })
          )}
          block
          size="lg"
          placeholder={"Supplier"}
          loading={supplerdataLoading || supplierDataFetching}
          onChange={(v) => addField("supplierId", v)}
          onClean={() => deleteField("supplierId")}
        />
      </div> */}
    </div>
  );
};

export default SalesHeader;
