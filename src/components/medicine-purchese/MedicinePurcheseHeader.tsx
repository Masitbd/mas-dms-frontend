import React from "react";
import { Button, Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import Link from "next/link";
const MedicineHeader = () => {
  return (
    <div className="flex">
      <div>
        <Link href={"/medicine-purchase/new"}>
          <Button appearance="primary" color="blue" size="lg">
            Add Purchase
          </Button>
        </Link>
      </div>
      <div className="mx-2 w-full">
        <InputGroup>
          <Input size="lg" />
          <InputGroup.Button>
            <SearchIcon />
          </InputGroup.Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default MedicineHeader;
