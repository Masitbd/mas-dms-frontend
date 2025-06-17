import React, { useState } from "react";
import { Form, InputGroup } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";

import UnvisibleIcon from "@rsuite/icons/Unvisible";

const PasswordFieldProvider = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();

  return (
    <div className="contents">
      <Form.Group controlId="password">
        <Form.ControlLabel>Password</Form.ControlLabel>

        <InputGroup inside>
          <Form.Control
            name="password"
            placeholder="Password"
            type={visible ? "text" : "password"}
            onChange={(v) => setPassword(v)}
          />
          <InputGroup.Button onClick={() => setVisible(!visible)}>
            {visible ? <VisibleIcon /> : <UnvisibleIcon />}
          </InputGroup.Button>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="confirmPassword">
        <Form.ControlLabel>Confirm Password</Form.ControlLabel>
        <InputGroup inside>
          <Form.Control
            name="confirmPassword"
            placeholder="Confirm Password"
            type={visible ? "text" : "password"}
            onChange={(v) => setConfirmPassword(v)}
          />
          <InputGroup.Button onClick={() => setVisible(!visible)}>
            {visible ? <VisibleIcon /> : <UnvisibleIcon />}
          </InputGroup.Button>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default PasswordFieldProvider;
