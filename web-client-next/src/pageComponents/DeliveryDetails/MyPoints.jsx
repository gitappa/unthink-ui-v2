import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLoyaltyBadge, fetchEarningPoints } from "./redux/action";

const MyPoints = () => {
  const [
    authUser,
    authUserId,
    storeData,
    imageLoyaltyBadge,
    imageLoyaltyBadgeLoading,
    earningPoints,
    earningPointsLoading,
    earningPointsError,
  ] = useSelector((state) => [
    state.auth.user.data,
    state.auth.user.data.user_id,
    state.store.data,
    state.cart.imageLoyaltyBadge,
    state.cart.imageLoyaltyBadgeLoading,
    state.cart.earningPoints,
    state.cart.earningPointsLoading,
    state.cart.earningPointsError,
  ]);
  // console.log("earningPoints", earningPoints);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!authUserId || !storeData?.store_name || earningPoints) {
      return;
    }

    dispatch(
      fetchEarningPoints({
        user_id: authUserId,
        store_name: storeData.store_name,
      }),
    );
  }, [authUserId, dispatch, earningPoints, storeData?.store_name]);
  useEffect(() => {
    if (!storeData?.pdp_settings?.badge_url || imageLoyaltyBadge) {
      return;
    }

    dispatch(
      createLoyaltyBadge({
        name: authUser?.first_name || authUser?.last_name || authUser?.user_name,
        points: earningPoints?.available_balance,
        badge_image_url: storeData?.pdp_settings?.badge_url,
        qr_page_url: `/checkout-claim-badge`,
      }),
    );
  }, [dispatch, earningPoints?.available_balance]);

  return (
    <div>
      {/* <div className="text-center mt-5">
        {earningPointsLoading ? (
          <p className="text-lg font-semibold">Loading your points...</p>
        ) : earningPointsError ? (
          <p className="text-lg font-semibold text-red-600">
            Unable to load points.
          </p>
        ) : points !== undefined && points !== null ? (
          <p className="text-lg font-semibold">
            Your points: {Number(points).toLocaleString()}
          </p>
        ) : null}
      </div> */}

      {imageLoyaltyBadge ? (
        <img
          src={imageLoyaltyBadge}
          alt="image loyalty badge"
          className="m-auto mt-5"
        />
      ) : !imageLoyaltyBadgeLoading && !imageLoyaltyBadge && (
        <div className="text-center mt-5">
          <p className="text-lg font-semibold">No loyalty badge found.</p>
        </div>
      )}
    </div>
  );
};

export default MyPoints;
