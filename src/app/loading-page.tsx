import React from 'react';

const LoadingPage = () => {
  return (
    <div className="h-full">
      <div className="h-[40px]  bg-[#481349]"></div>
      <div className="flex h-[calc(100vh-40px)]">
        <div className="side w-[50px] bg-[#481349]"></div>
        <div className="sidebar w-[300px] bg-[#5E2C5F]"></div>
        <div className="content flex-1 bg-white"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
