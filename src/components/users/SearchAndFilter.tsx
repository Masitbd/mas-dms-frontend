/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input, InputGroup, SelectPicker } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import CloseIcon from "@rsuite/icons/Close";

const SearchAndFilter = (props: any) => {
  const { addField, deleteField, getQuery } = props;
  return (
    <div className="contents">
      <div className="col-span-4">
        <InputGroup className="col-span-3">
          <Input
            placeholder="search"
            size="lg"
            onChange={(v) => addField("searchTerm", v)}
            value={getQuery?.searchTerm ?? ""}
          />
          <InputGroup.Addon style={{ backgroundColor: "white" }}>
            <CloseIcon
              className="text-xs cursor-pointer hover:text-xl "
              color="red"
              onClick={(v) => deleteField("searchTerm")}
            />
          </InputGroup.Addon>
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>
      </div>

      <div className="col-span-2">
        <SelectPicker
          placeholder={"Status"}
          block
          size="lg"
          onSelect={(v) => addField("status", v)}
          onClean={(v) => deleteField("status", v)}
          data={[
            { label: "Active", value: "active" },
            { label: "Rusticated", value: "rusticate" },
          ]}
        />
      </div>
      <div className="col-span-2">
        <SelectPicker
          placeholder={"Sort By"}
          block
          size="lg"
          onSelect={(v) => addField("sortOrder", v)}
          onClean={(v) => deleteField("sortOrder", v)}
          data={[
            { label: "Ascending", value: "asc" },
            { label: "Descending", value: "desc" },
          ]}
        />
      </div>
    </div>
  );
};

export default SearchAndFilter;
