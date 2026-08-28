import React, { useEffect } from "react";

const LoggedInInfo = ({ userInfo }) => {
  return (
    <div className="flex justify-end mt-10">
      <div className=" w-fit mb-2 right-5 z-50 border border-gray-200 bg-gray-200/90 rounded-full px-6 py-3 shadow-sm cursor-auto transition-shadow duration-300">
        <p className="text-sm font-semibold text-black">
          👤 Logged in as:{" "}
          <span className=" ">
            {userInfo?.user_name || userInfo?.email || "Guest User"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoggedInInfo;

export const useKioskAccess = ({ isUserLogin, storeData, authUser }) => {
   

  if (!authUser?.emailId || !Array.isArray(storeData?.kiosk_list) || !isUserLogin) {
    return null;
  }

  const hasAccess = storeData.kiosk_list.includes(authUser.emailId);


  return hasAccess;
};