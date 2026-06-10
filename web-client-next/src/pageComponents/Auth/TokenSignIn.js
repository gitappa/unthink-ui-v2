import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useNavigate } from "../../helper/useNavigate";
import { useDispatch } from "react-redux";
import { Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import AuthHeader from "../AuthHeader";
import { getUserCollectionsReset, getUserInfo } from "./redux/actions";
import { authAPIs } from "../../helper/serverAPIs";
import Cookies from "js-cookie";
import {
  setIsRegistered,
  setTTid,
  setUserEmail,
} from "../../helper/getTrackerInfo";
import {
  PATH_ROOT,
  PATH_SIGN_IN,
  PATH_STORE,
  SIGN_IN_EXPIRE_DAYS,
} from "../../constants/codes";
import { is_store_instance } from "../../constants/config";
import styles from "./authPage.module.scss";
import {
  checkAndGenerateUserId,
  clearStorages,
  generateSessionId,
} from "../../helper/utils";
import { logoutVenlyUser } from "../../helper/venlyUtils";
import { fetchCategoriesReset } from "../categories/redux/actions";

const TokenSignIn = () => {
  const router = useRouter();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Accept token from either the dynamic route param (/user/verify/[token])
  // or from the query string (/user/verify?token=...). Some QR flows
  // embed the token in the query to avoid routing issues with special chars.
  // Build URLSearchParams once (only available in the browser).
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  // router.query.token can be undefined, a string, or an array (e.g. repeated params).
  // Prefer the route param when available, otherwise fall back to the raw query string.
  let token = router.query?.token;
  if (Array.isArray(token)) token = token[0];
  if (!token && params) {
    token = params.get("token") || token;
  }

  const redirectPage = params?.get("page")?.trim()
  console.log("redirectPageaaa", redirectPage);
  // const collectionPath = redirectPage?.split("/").pop();

//   console.log("collectionPath", collectionPath);

  useEffect(() => {
    if (token) verifyToken(token);
  }, [token]);

  const redirectBackToHome = () => {
    notification["success"]({
      message: "Sign In Success!",
      duration: 3,
    });
    if (is_store_instance) {
      navigate(PATH_ROOT);
    } else {
      navigate(PATH_STORE);
    }
  };

  const handleVerificationError = () => {
    notification.error({
      message: "Token is invalid/expired. Please sign in again",
    });
    navigate(PATH_SIGN_IN);
  };
  const Signout=()=>{
     Cookies.set("isGuestLoggedIn", false, {
            expires: SIGN_IN_EXPIRE_DAYS,
          });
          localStorage.removeItem("adminRolePopupShown", "false");
          clearStorages();
          checkAndGenerateUserId(); // generating user id again for guest user after sign out
          generateSessionId(); // generating new session id for guest user after sign out          
          try {
            logoutVenlyUser();
          } catch {
            console.log("wallet error");
          }
  }

  const verifyToken = async (signInToken) => {
    try {
      const res = await authAPIs.verifyTokenAPICall(signInToken);

      if (
        res.data.status_code === 200 &&
        res.data.data.user_id &&
        res.data.data.user_name &&
        res.data.data.emailId
      ) {
        // START
        setTTid(res.data.data.user_id);
        setIsRegistered(true);
        setUserEmail(res.data.data.emailId);
        // END
        dispatch(getUserInfo());
        if (redirectPage === "my-products") {
          navigate("/my-products");
          return;
        }
        if (redirectPage === "create-collection") {
          navigate("/create-collection");
          return;
        }
        if (redirectPage?.startsWith("collections/")) {
          const collectionPath = redirectPage.split("/").pop();

          console.log("collectionPath", collectionPath);

          navigate(`/collections/${collectionPath}`);
          Signout()
        }
		   if (redirectPage?.startsWith("influencer/")) {
          const collectionPath = redirectPage.split("/").pop();

        //   console.log("collectionPath", collectionPath);

          navigate(`/influencer/${collectionPath}`);
         Signout()
        }
        if (redirectPage?.startsWith("product/")) {
          	navigate(`/${redirectPage}`);
          	Signout();
        }
        if (redirectPage?.startsWith("cart/")) {
          	navigate(`/${redirectPage}`);
          	// Signout();
        }


        redirectBackToHome();
      } else {
        handleVerificationError();
      }
    } catch(e) {
      console.log('tokenerror',e)
      handleVerificationError();
    }

    dispatch(getUserCollectionsReset());

    setTimeout(() => {
      dispatch(getUserInfo());
      //   navigate(is_store_instance ? "/" : "/store");
      dispatch(fetchCategoriesReset()); // clearing fetched categories
    }, 0);
    // console.log("dfdfdouhoh");
  };

  return (
    <div className={`static_page_bg ${styles.tokenSignInRoot}`}>
      <div className={styles.authHeaderContainer}>
        <AuthHeader
          userTextLink={{
            text: "Sign In",
            to: "/signin",
          }}
        />
      </div>
      <div className={styles.tokenSignInLoader}>
        <Spin
          indicator={<LoadingOutlined className={styles.loaderIcon} spin />}
        />
      </div>
    </div>
  );
};

export default TokenSignIn;
