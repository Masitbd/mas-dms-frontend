import SearchIcon from "@rsuite/icons/Search";
import Link from "next/link";
import React from "react";
import { Button, Input, InputGroup } from "rsuite";

interface IGenericHeaderProps {
  addField: (v: string, a: string) => void;
}

const GenericHeader = ({ addField }: IGenericHeaderProps) => {
  return (
    <div className="flex">
      <div>
        <Link href={"/generics/new"}>
          <Button appearance="primary" color="blue" size="lg">
            Add Category
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

export default GenericHeader;
