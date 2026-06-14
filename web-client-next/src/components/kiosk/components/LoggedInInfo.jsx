import React from "react";

const LoggedInInfo = ({ userInfo }) => {
  return (
      <div className="fixed bottom-5 right-5 z-50 border border-gray-200 bg-gray-200/90 rounded-full px-6 py-3 shadow-sm cursor-auto transition-shadow duration-300">
        <p className="text-sm font-semibold text-black">
          👤 Logged in as:{" "}
          <span className=" ">
            {userInfo?.user_name || userInfo?.email || "Guest User"}
          </span>
        </p>
      </div>
  );
};

export default LoggedInInfo;