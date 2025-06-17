import React from "react";

const Loading = () => {
  return (
    <div className="h-[100vh] w-full flex items-center justify-center">
      <div className="loader">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
      </div>
    </div>
  );
};

export default Loading;
