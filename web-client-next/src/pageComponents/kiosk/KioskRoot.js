import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KioskHome from "./KioskHome";
import { useRouter } from "next/router";
import CollectionPage from "../../components/kiosk/CollectionPage";
import { getwishlistUserCollection, getWishlistUserCollectionReset } from "../Auth/redux/actions";
import { fetchCart, fetchCartReset } from "../DeliveryDetails/redux/action";
import useKioskSessionReminder, { KioskSessionPopup } from "../../components/kiosk/useKioskSessionReminder";

const KioskRoot = (props) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const kioskUserId = useSelector((state) => state.kiosk.userId);
  const { collection_name } = router.query;
  const { isKioskCollectionPage, isRootPage = false } = props;
const { showSessionPopup, handleStayLoggedIn, handleLogout } =
    useKioskSessionReminder({ time: 60 * 1000 });

  useEffect(() => {
    if (!kioskUserId) {
      dispatch(getWishlistUserCollectionReset());
      dispatch(fetchCartReset());
      return;
    }
    dispatch(
      getwishlistUserCollection({
        path: `my_wishlist_${kioskUserId}`,
      }),
    );
    dispatch(fetchCart(`my_cart_${kioskUserId}`));
  }, [kioskUserId, dispatch]);

  return (
    <div>
      {isRootPage && <KioskHome />}
      {isKioskCollectionPage && <CollectionPage params={{ collection_name }} />}
       {/* Session reminder popup for kiosk users (floating bottom-right) */}
       {showSessionPopup && (
        <KioskSessionPopup
          onStay={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default KioskRoot;
