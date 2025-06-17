"use client";
import React, { MouseEventHandler } from "react";
import { Dropdown, Nav, Navbar } from "rsuite";
import AngleRight from "@rsuite/icons/legacy/AngleRight";
import AngleLeft from "@rsuite/icons/legacy/AngleLeft";
const NavToggle = ({
  expand,
  onChange,
}: {
  expand: boolean;
  onChange: (value: MouseEventHandler<HTMLElement>) => void;
}) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Navbar>
        <Nav>
          <Dropdown placement="topStart" trigger="click">
            <Dropdown.Item>Help</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        </Nav>

        <Nav pullRight>
          <Nav.Item
            onClick={onChange as unknown as MouseEventHandler<HTMLElement>}
            style={{ width: 56, textAlign: "center" }}
          >
            {expand ? <AngleLeft /> : <AngleRight />}
          </Nav.Item>
        </Nav>
      </Navbar>
    </Navbar>
  );
};

export default NavToggle;
