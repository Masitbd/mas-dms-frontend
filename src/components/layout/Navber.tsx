"use client";
import { SyntheticEvent, useState } from "react";
import { Navbar as ResuiteNavber, Nav, Button } from "rsuite";
import { NavLink } from "./Navlink";
import { signOut, useSession } from "next-auth/react";

const CustomNavbar = ({
  onSelect,
  activeKey,
  ...props
}: {
  onSelect: SyntheticEvent<Element, Event>;
  activeKey: boolean;
}) => {
  const session = useSession();

  return (
    <ResuiteNavber {...props} appearance="inverse" style={{ zIndex: 222222 }}>
      <Nav
        onSelect={
          onSelect as unknown as (
            eventKey: unknown,
            event: SyntheticEvent<Element, Event>
          ) => void
        }
        activeKey={activeKey}
      >
        {/* <Nav.Item eventKey="2" as={NavLink} href="/profile">
          Profile
        </Nav.Item> */}
        <Nav.Item eventKey="3" as={NavLink} href="/journal">
          Dashboard
        </Nav.Item>
      </Nav>
      <Nav pullRight className="mr-2">
        <Nav.Item>
          <div>
            Logged in as <b>{session?.data?.user?.name}</b>
          </div>
        </Nav.Item>
        <Nav.Item onClick={() => signOut()}>
          <Button appearance="primary" color="red">
            Logout
          </Button>
        </Nav.Item>
      </Nav>
    </ResuiteNavber>
  );
};

export const Navbar = () => {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <>
      <CustomNavbar
        activeKey={activeKey as unknown as boolean}
        onSelect={setActiveKey as unknown as SyntheticEvent<Element, Event>}
      />
    </>
  );
};
