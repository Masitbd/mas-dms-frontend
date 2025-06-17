import React from "react";
import { Tag } from "rsuite";

const UserStatusProvider = (props: { status: string }) => {
  const { status } = props;
  if (!status) return null;
  if (status == "active") {
    return (
      <Tag color="green" size="sm">
        Active
      </Tag>
    );
  }
  if (status == "rusticate") {
    return (
      <Tag color="red" size="sm">
        Rusticated
      </Tag>
    );
  }
};

export default UserStatusProvider;
