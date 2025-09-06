"use client";
import React from "react";
import { Dropdown, Nav, Sidebar, Sidenav } from "rsuite";

import NavToggle from "./NavToggle";
import { NavLink } from "./Navlink";

import DateTaskIcon from "@rsuite/icons/DateTask";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

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
              <Nav.Item href="/medicine-sale" eventKey="7" as={NavLink}>
                Sales
              </Nav.Item>
              <Nav.Menu
                eventKey="9"
                trigger="hover"
                title="Reports"
                icon={<DateTaskIcon />}
                placement="rightStart"
              >
                <Nav.Item
                  eventKey="9-1"
                  href="/reports/medicine-sales"
                  as={NavLink}
                >
                  Medicine Sales Reports
                </Nav.Item>
                <Nav.Item
                  eventKey="9-2"
                  href="/reports/due-collection"
                  as={NavLink}
                >
                  Due Collection Statement
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="9-3"
                  href="/reports/due-collection-summary"
                  as={NavLink}
                >
                  Due Collection Summary
                </Nav.Item>
                <Nav.Item
                  eventKey="9-4"
                  href="/reports/patient-due"
                  as={NavLink}
                >
                  Patient Due Statement
                </Nav.Item>
                <Nav.Item
                  eventKey="9-4"
                  href="/reports/stock-overview"
                  as={NavLink}
                >
                  Medicine Stock Overview
                </Nav.Item>

                {/*  */}
              </Nav.Menu>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>
    </>
  );
};

export default DashSidebar;
