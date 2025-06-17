import React from "react";

const UserInfoGrid = ({
  address,
  age,

  dateOfBirth,
  email,
  fatherName,
  gender,
  motherName,
  name,
  phone,

  uuid,
}: {
  [x: string]: string;
}) => {
  const userInfo = [
    { label: "UUID", value: uuid },
    { label: "Name", value: name },
    { label: "Gender", value: gender },
    {
      label: "Date of Birth",
      value: dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : "N/A",
    },
    { label: "Age", value: age },
    { label: "Address", value: address },
    { label: "Phone", value: phone },
    { label: "Email", value: email },
    { label: "Father's Name", value: fatherName },
    { label: "Mother's Name", value: motherName },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
      {userInfo.map(
        (item, index) =>
          item.value && ( // Only render if the value exists
            <div key={index} className="">
              <p className="font-semibold text-gray-600">{item.label}</p>
              <p className="text-black font-serif">{item.value}</p>
            </div>
          )
      )}
    </div>
  );
};

export default UserInfoGrid;
