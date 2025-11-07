import React from "react";
import { Button, Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import Link from "next/link";
import { ENUM_MODE } from "@/enums/EnumMode";
const MedicineEntryHeader = ({
  addField,
  link4,
  btn3Text,
}: {
  addField: any;
  link4?: string;
  btn3Text: string;
}) => {
  return (
    <div className="flex">
      <div>
        <Link
          href={`/${link4 ? link4 : "medicine-entry"}/create?mode=${
            ENUM_MODE.NEW
          }`}
        >
          <Button appearance="primary" color="blue" size="lg">
            {btn3Text ? btn3Text : " Entry Medicine"}
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
