import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useKioskAccess } from "../../components/kiosk/components/LoggedInInfo";
import KioskHome from "./KioskHome";
import { useRouter } from "next/router";
import CollectionPage from "../../components/kiosk/CollectionPage";
import { KIOSK_LOGIN_CHANGE_EVENT } from "../../constants/codes";
import { getStoredKioskLogin } from "../../helper/utils";
import { getwishlistUserCollection, getWishlistUserCollectionReset } from "../Auth/redux/actions";
import { fetchCart, fetchCartReset } from "../DeliveryDetails/redux/action";

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

  const getKioskLogin = useCallback(() => getStoredKioskLogin(), []);
  const [KioskLoginAuth, setKioskLoginAuth] = useState(() => getKioskLogin());

  const syncKioskLogin = useCallback(() => {
    const login = getKioskLogin();
    setKioskLoginAuth(login);
  }, [getKioskLogin]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    syncKioskLogin();
    window.addEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);

    return () => {
      window.removeEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);
    };
  }, [router.asPath, syncKioskLogin]);
  useEffect(() => {
    if (!KioskLoginAuth?.user_id) {
      dispatch(getWishlistUserCollectionReset());
      dispatch(fetchCartReset());
      return;
    }
    dispatch(
      getwishlistUserCollection({
        path: `my_wishlist_${KioskLoginAuth.user_id}`,
      }),
    );
    dispatch(fetchCart(`my_cart_${KioskLoginAuth.user_id}`));
  }, [KioskLoginAuth?.user_id, dispatch]);

  return (
    <div>
      {isRootPage && <KioskHome />}
      {isKioskCollectionPage && <CollectionPage params={{ collection_name }} />}
    </div>
  );
};

export default KioskRoot;
