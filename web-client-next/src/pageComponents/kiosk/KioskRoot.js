import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useKioskAccess } from "../../components/kiosk/components/LoggedInInfo";
import KioskHome from "./KioskHome";
import { useRouter } from "next/router";
import CollectionPage from "../../components/kiosk/CollectionPage";
import { getwishlistUserCollection } from "../Auth/redux/actions";
import { KIOSK_LOGIN_CHANGE_EVENT } from "../../constants/codes";

const KioskRoot = (props) => {
  const router = useRouter();

  const [isUserLogin, authUser, storeData] = useSelector((state) => [
    state.auth.user.isUserLogin,
    state.auth.user.data,
    state.store.data,
  ]);
  const dispatch = useDispatch();
  const { collection_name } = router.query;
  const { isKioskCollectionPage, isRootPage = false } = props;
  const hasKioskAccess = useKioskAccess({
    isUserLogin,
    storeData,
    authUser,
  });

  const getKioskLogin = useCallback(() => {
    if (typeof window === "undefined") return null;

    try {
      return JSON.parse(window.sessionStorage.getItem("Kiosk-login") || "null");
    } catch (error) {
      return null;
    }
  }, []);
  const [KioskLoginAuth, setKioskLoginAuth] = useState(() => getKioskLogin());

  const syncKioskLogin = useCallback(() => {
    const login = getKioskLogin();
    setKioskLoginAuth(login);
  }, [getKioskLogin]);

  const kioskUserLogin = getKioskLogin()?.user_id;
  useEffect(() => {
    window.addEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);

    return () => {
      window.removeEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);
    };
  }, [syncKioskLogin]);
  useEffect(() => {
    dispatch(
      getwishlistUserCollection({
        path: `my_wishlist_${KioskLoginAuth?.user_id}`,
      }),
    );
  }, [kioskUserLogin]);
  // params={{ collection_name }}
  return (
    <div>
      {isRootPage && <KioskHome />}
      {isKioskCollectionPage && <CollectionPage params={{ collection_name }} />}
    </div>
  );
};

export default KioskRoot;
