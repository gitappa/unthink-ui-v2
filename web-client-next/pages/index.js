// old : used Brands as a home page
// new : using RootStatic as a home page

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { aura_header_theme, is_store_instance } from "../src/constants/config";
import Footer from "../src/pageComponents/staticHomePage/Footer";
import Header from "../src/pageComponents/staticHomePage/Header";
import RootStatic from "../src/pageComponents/staticHomePage/RootStatic";
import { ROUTES } from "../src/constants/codes";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import KioskHome from "../src/pageComponents/kiosk/KioskHome";

// Dynamically import StorePage to avoid hydration issues
const SharedPage = dynamic(() => import("../src/pageComponents/storePage"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen">
      <Spin className="flex justify-center items-center mt-5" />
    </div>
  ),
});

const Index = ({ ...props }) => {
  const [mounted, setMounted] = useState(false);

  // Call ALL hooks at the top level
  const [isUserLogin, authUser, storeData] = useSelector((state) => [
    state.auth.user.isUserLogin,
    state.auth.user.data,
    state.store.data,
  ]);

  // All useEffect hooks must be at the top level
  useEffect(() => {
    setMounted(true);
  }, []);

  // Now we can do conditionals
  if (is_store_instance && !mounted) {
    return null; // Don't render anything until mounted on client
  }

  // Show KioskHome if user is logged in and has kiosk_list
  const hasKioskAccess =
    isUserLogin &&
    storeData?.kiosk_list?.find((data) => authUser?.emailId === data);
  console.log("hasKioskAccess", hasKioskAccess);

  return (
    <>
      {hasKioskAccess ? (
        <KioskHome {...props} />
      ) : is_store_instance ? ( // for store home page
        mounted && (
          <SharedPage
            isRootPage
            isSharedPage
            {...props}
            serverData={{
              config: {
                aura_header_theme: aura_header_theme,
              },
            }}
          />
        )
      ) : (
        <div className="overflow-hidden static_page_bg">
          <Header
            // showSignIn={false}
            signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
            currentPath={props.path}
          />
          <RootStatic />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Index;
