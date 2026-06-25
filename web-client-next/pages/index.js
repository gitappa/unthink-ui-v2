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
import { useDispatch, useSelector } from "react-redux";
import KioskHome from "../src/pageComponents/kiosk/KioskHome";
import { useKioskAccess } from "../src/components/kiosk/components/LoggedInInfo";
import { fetchCart } from "../src/pageComponents/DeliveryDetails/redux/action";
import { getStoredKioskLoginUserId } from "../src/helper/utils";
import { getTTid } from "../src/helper/getTrackerInfo";

// Dynamically import StorePage to avoid hydration issues
const SharedPage = dynamic(() => import("../src/pageComponents/storePage"), {
    ssr: false,
    loading: () => <div className="min-h-screen">
            <Spin className="flex justify-center items-center mt-5" />
    </div>
});

const Index = ({ ...props }) => {
    const [mounted, setMounted] = useState(false);
    // Call ALL hooks at the top level
    const [isUserLogin, authUser, storeData] = useSelector((state) => [
        state.auth.user.isUserLogin,  
        state.auth.user.data,
        state.store.data,
    ]);
    const dispatch = useDispatch()

    // All useEffect hooks must be at the top level
    useEffect(() => {
        setMounted(true);
    }, []);

    // Show KioskHome if user is logged in and has kiosk_list
    const hasKioskAccess = useKioskAccess({
        isUserLogin,
        storeData,
        authUser,
    });

    const storeAss = isUserLogin &&
        storeData?.store_assistant_list?.find(
            (data) => authUser?.emailId === data,
        );
        const  kioskLogin =getStoredKioskLoginUserId() 
        const LoginData =  authUser?.user_id || getTTid()
        useEffect(()=>{
            if(LoginData ||kioskLogin ){
                if(hasKioskAccess){
                    dispatch(fetchCart(kioskLogin))
                    return
                }
                dispatch(fetchCart(LoginData))
            }
        },[LoginData ,kioskLogin, hasKioskAccess, dispatch])

    // console.log('storeAss', storeAss);
    // Now we can do conditionals
    if (is_store_instance && !mounted) {
        return null; // Don't render anything until mounted on client
    }

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
                <div className='overflow-hidden static_page_bg'>
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
