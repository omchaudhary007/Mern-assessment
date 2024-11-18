import React from "react";

const Loading = ({height,width}) => {
  return (
    <div className={`${height} ${width} flex justify-center items-center`}>
      <img className="w-1/12" src="./loading.gif" alt="loading" />
    </div>
  );
};

export default Loading;
