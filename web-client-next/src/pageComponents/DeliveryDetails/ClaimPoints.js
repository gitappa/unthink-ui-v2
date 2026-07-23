import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkoutUpdatePoints,
  redeemSessionHCS20Points,
} from "./redux/action";
import { current_store_name } from "../../constants/config";
import { useRouter } from "next/router";

const DEFAULT_REDEEM_POINTS = 500;
const DEFAULT_NFT_INSTANCE_ID = "GIVA loyalty points";

const getPointValue = (source, keys, fallback = 0) => {
  const rawValue = keys.reduce(
    (value, key) => (value === undefined ? source?.[key] : value),
    undefined
  );
  const nextValue = Number(rawValue);

  return Number.isFinite(nextValue) ? nextValue : fallback;
};

const DEFAULT_CLAIM_IMAGE_URL = "https://example.com/nft/platnium.png";
const getRouteValue = (value) => (Array.isArray(value) ? value[0] : value);
const ClaimPoints = ({
  // checkoutUpdatedPoints,
  // checkoutUpdatePointsLoading,
  // checkoutUpdatePointsError,
  // redeemSessionHCS20PointsLoading,
  // checkoutUserId,
  // checkoutStoreName,
  // userDID,
  // claimImageUrl,
  checkoutPage = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [redeemPoints, setRedeemPoints] = useState(DEFAULT_REDEEM_POINTS);
  const [confirmedPoints, setConfirmedPoints] = useState(0);
  const [redeemPointsError, setRedeemPointsError] = useState("");
  const [pendingRedeemPoints, setPendingRedeemPoints] = useState(null);
  const routeUserId = getRouteValue(router.query.user_id);
const [
    collection,
    loading,
    authUser,
    checkoutUpdatedPoints,
    checkoutUpdatePointsLoading,
    checkoutUpdatePointsError,
    redeemSessionHCS20PointsLoading,
    storeData,
  ] = useSelector((state) => [
    state.cart?.collection,
    state.cart?.loading,
    state.auth?.user?.data,
    state.cart?.checkoutUpdatedPoints,
    state.cart?.checkoutUpdatePointsLoading,
    state.cart?.checkoutUpdatePointsError,
    state.cart?.redeemSessionHCS20PointsLoading,
    state.store.data,
  ]);

  const userDID = authUser?.userDID;
  const checkoutStoreName = storeData?.store_name || current_store_name;
   const checkoutUserId = routeUserId || authUser?.user_id || authUser?._id;
  const checkoutPointsData =
    checkoutUpdatedPoints?.events?.[0] ||
    checkoutUpdatedPoints?.event ||
    checkoutUpdatedPoints;
  const hasCalculatedPoints = Boolean(checkoutPointsData);
  const totalClaimPoints = getPointValue(
    checkoutPointsData,
    ["total_earned", "total_points", "totalPoints", "points", "earned_points"],
    checkoutUpdatedPoints?.total_earned || 0
  );
  const maxAvailableToRedeem = getPointValue(
    checkoutPointsData,
    [
      "max_available_to_redeem",
      "maxAvailableToRedeem",
      "available_to_redeem",
      "available_balance",
      "available_points",
    ],
    checkoutUpdatedPoints?.available_balance || 0
  );
  const redeemablePoints = Math.min(
    Math.max(Number(redeemPoints) || 0, 0),
    maxAvailableToRedeem
  );
  const appliedPoints = confirmedPoints || redeemablePoints;
  const remainingPoints = getPointValue(
    checkoutPointsData,
    ["available_balance", "remaining_balance", "remainingBalance", "remaining_points"],
    Math.max(totalClaimPoints - appliedPoints, 0)
  );
 const claimImageUrl =
    storeData?.pdp_settings?.badge_url ||
    storeData?.badge_image_url ||
    DEFAULT_CLAIM_IMAGE_URL;

  const handlePointsChange = (event) => {
    const nextValue = Number(event.target.value);
    const normalizedValue = Number.isNaN(nextValue) ? 0 : nextValue;
    setRedeemPoints(normalizedValue);

    if (hasCalculatedPoints && normalizedValue > maxAvailableToRedeem) {
      setRedeemPointsError(
        `Enter ${maxAvailableToRedeem} points or less to redeem.`
      );
      return;
    }

    setRedeemPointsError("");
  };

  const handleCalculatePoints = () => {
    if (!checkoutUserId || !checkoutStoreName) {
      console.error("Missing checkout points payload:", {
        user_id: checkoutUserId,
        store_name: checkoutStoreName,
      });
      return;
    }

    dispatch(
      checkoutUpdatePoints({
        user_id: checkoutUserId.toString(),
        store_name: checkoutStoreName,
        userDID,
        claimpoints: checkoutPage ? true : false,
      })
    );
  };

  const handleConfirmRedemption = () => {
    const validPoints = Math.max(Number(redeemPoints) || 0, 0);

    if (!userDID) {
      setRedeemPointsError("User DID is required to redeem points.");
      return;
    }

    if (validPoints > maxAvailableToRedeem) {
      setRedeemPointsError(
        `Enter ${maxAvailableToRedeem} points or less to redeem.`
      );
      return;
    }

    setPendingRedeemPoints(validPoints);
  };

  const handleCloseRedeemModal = () => {
    if (redeemSessionHCS20PointsLoading) {
      return;
    }

    setPendingRedeemPoints(null);
  };

  const handleConfirmRedeemPoints = () => {
    if (pendingRedeemPoints === null) {
      return;
    }

    const validPoints = pendingRedeemPoints;

    setRedeemPointsError("");
    setRedeemPoints(validPoints);
    setConfirmedPoints(validPoints);
    setPendingRedeemPoints(null);

    const checkoutRefreshPayload = {
      user_id: checkoutUserId?.toString(),
      store_name: checkoutStoreName,
    };

    dispatch(
      redeemSessionHCS20Points({
        redeemPayload: {
          recipientId: userDID,
          pointsAmount: validPoints,
        },
        claimPayload: {
          user_id: checkoutUserId?.toString(),
          store_name: checkoutStoreName,
          nft_instance_id: DEFAULT_NFT_INSTANCE_ID,
          points_exchanged: validPoints,
          image_url: claimImageUrl,
        },
        checkoutRefreshPayload,
      })
    );
  };

  return (
    <div className="p-5">
      <div className="mx-auto max-w-[420px] text-[15px] text-black">
        <button
          type="button"
          onClick={handleCalculatePoints}
          disabled={checkoutUpdatePointsLoading}
          className="w-full bg-kiosk-secondary py-1 text-center text-[16px] uppercase hover:bg-kiosk-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {checkoutUpdatePointsLoading
            ? "CALCULATING POINTS"
            : "CALCULATE POINTS"}
        </button>
        {checkoutUpdatePointsLoading && (
          <div className="px-3 py-2 leading-6">
            <p>Calculating points at checkout....</p>
            <p>Reading rules..</p>
            <p>Checking for points per product........</p>
          </div>
        )}

        <div className="mt-3 border-t-2 border-black pt-3 text-center">
          <p className="mt-5 text-[16px]">
            Max Available to redeem:{" "}
            <span className="ml-2">{maxAvailableToRedeem}</span>
          </p>
        </div>

        <div className="mt-5 bg-[#fbfbfb] px-2 py-3">
          <label
            htmlFor="redeem-points"
            className="mb-1 block text-center text-base font-semibold"
          >
            [Enter points to redeem]
          </label>
          <input
            id="redeem-points"
            type="number"
            min="0"
            max={maxAvailableToRedeem}
            value={redeemPoints}
            onChange={handlePointsChange}
            disabled={!hasCalculatedPoints}
            className="h-7 w-full border border-[#dedede] bg-white px-2 text-[11px] outline-none disabled:cursor-not-allowed disabled:bg-[#f2f2f2] disabled:text-[#9a9a9a]"
          />
          {redeemPointsError && (
            <p className="mt-1 text-[10px] leading-4 text-red-600">
              {redeemPointsError}
            </p>
          )}
          <button
            type="button"
            onClick={handleConfirmRedemption}
            disabled={
              !hasCalculatedPoints ||
              Boolean(redeemPointsError) ||
              redeemSessionHCS20PointsLoading
            }
            className="mt-2 w-full bg-kiosk-secondary py-1 text-center text-[16px] uppercase hover:bg-kiosk-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {redeemSessionHCS20PointsLoading
              ? "REDEEMING POINTS"
              : "REDEEM POINTS"}
          </button>
        </div>

        {hasCalculatedPoints && (
          <div className="mt-6 border-t-2 border-black px-3 pt-5 leading-6">
            {redeemSessionHCS20PointsLoading && (
              <p>Updating final balance....</p>
            )}
            <p>Remaining balance: {remainingPoints} points</p>
          </div>
        )}

        {checkoutUpdatePointsError && (
          <p className="mt-6 border-t-2 border-black px-3 pt-5 text-xs text-red-600">
            Failed to calculate checkout points.
          </p>
        )}
      </div>

      {pendingRedeemPoints !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="redeem-points-confirmation-title"
            className="w-full max-w-[420px] rounded-lg bg-white p-5 text-black shadow-2xl"
          >
            <div className="border-b border-[#dedede] pb-3">
              <p
                id="redeem-points-confirmation-title"
                className="text-lg font-semibold"
              >
                Confirm points redemption
              </p>
              <p className="mt-1 text-sm leading-5 text-[#555]">
                Please review this action before applying points to checkout.
              </p>
            </div>

            <div className="py-5 text-center">
              <p className="text-sm uppercase tracking-wide text-[#777]">
                Points to redeem
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {pendingRedeemPoints}
              </p>
              <p className="mt-3 text-sm leading-5 text-[#555]">
                This will update the final checkout balance for this customer.
              </p>
            </div>

            <div className="flex gap-3 border-t border-[#dedede] pt-4">
              <button
                type="button"
                onClick={handleCloseRedeemModal}
                disabled={redeemSessionHCS20PointsLoading}
                className="h-9 flex-1 border border-[#222] bg-white text-[13px] font-semibold uppercase text-[#222] hover:bg-[#f4f4f4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeemPoints}
                disabled={redeemSessionHCS20PointsLoading}
                className="h-9 flex-1 bg-kiosk-secondary text-[13px] font-semibold uppercase text-black hover:bg-kiosk-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {redeemSessionHCS20PointsLoading
                  ? "Confirming"
                  : "Confirm redemption"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimPoints;
