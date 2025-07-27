"use client";
import React from "react";
import { Dropdown, Nav, Sidebar, Sidenav } from "rsuite";
import Dashboard from "@rsuite/icons/legacy/Dashboard";

import AdminIcon from "@rsuite/icons/Admin";
import GearCircle from "@rsuite/icons/legacy/GearCircle";
import TableIcon from "@rsuite/icons/Table";
import PeoplesIcon from "@rsuite/icons/Peoples";

import ListIcon from "@rsuite/icons/List";
import SettingIcon from "@rsuite/icons/Setting";
import PeopleBranchIcon from "@rsuite/icons/PeopleBranch";

import NavToggle from "./NavToggle";
import { NavLink } from "./Navlink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import StorageIcon from "@rsuite/icons/Storage";
import FunnelTimeIcon from "@rsuite/icons/FunnelTime";
import DocPassIcon from "@rsuite/icons/DocPass";

import DateTaskIcon from "@rsuite/icons/DateTask";
import { useRouter } from "next/navigation";
import UserInfoIcon from "@rsuite/icons/UserInfo";
import { useSession } from "next-auth/react";
import { ENUM_USER } from "@/enums/EnumUser";

const DashSidebar = () => {
  const navigate = useRouter();
  const [expand, setExpand] = React.useState(true);
  const session = useSession();
  return (
    <>
      <Sidebar
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          minHeight: "93vh",
          justifyContent: "space-between",
          background: "white",
        }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav expanded={expand} defaultOpenKeys={["3"]} appearance="subtle">
          <Sidenav.Body
            style={{
              maxHeight: "88vh",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <Nav>
              <Nav.Item href="/users" eventKey="1" as={NavLink}>
                Users
              </Nav.Item>
              <Nav.Item href="/category" eventKey="2" as={NavLink}>
                Medicine Category
              </Nav.Item>
              <Nav.Item href="/generics" eventKey="3" as={NavLink}>
                Medicine Generics
              </Nav.Item>
              <Nav.Item href="/medicine-entry" eventKey="4" as={NavLink}>
                Medicine Entry
              </Nav.Item>
              <Nav.Item href="/supplier" eventKey="5" as={NavLink}>
                Supplier List
              </Nav.Item>
              <Nav.Item href="/medicine-purchase" eventKey="6" as={NavLink}>
                Purchase Entry
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>
    </>
  );
};

export default DashSidebar;
