import React from "react";
import { Button, Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import Link from "next/link";
const MedicineEntryHeader = ({
  addField,
}: {
  addField: (a: string, b: string) => void;
}) => {
  return (
    <div className="flex">
      <div>
        <Link href={"/medicine-entry/create"}>
          <Button appearance="primary" color="blue" size="lg">
            Entry Medicine
          </Button>
        </Link>
      </div>
      <div className="mx-2 w-full">
        <InputGroup>
          <Input size="lg" onChange={(v) => addField("searchTerm", v)} />
          <InputGroup.Button>
            <SearchIcon />
          </InputGroup.Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default MedicineEntryHeader;
