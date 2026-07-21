import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  checkoutUpdatePoints,
  fetchCart,
  redeemSessionHCS20Points,
} from "./redux/action";
import { current_store_name } from "../../constants/config";

const TOTAL_CLAIM_POINTS = 600;
const REWARD_POINTS_AVAILABLE = 500;
const DEFAULT_REDEEM_POINTS = 500;
const DEFAULT_NFT_INSTANCE_ID = "GIVA loyalty points";
const DEFAULT_CLAIM_IMAGE_URL = "https://example.com/nft/platnium.png";

const getRouteValue = (value) => (Array.isArray(value) ? value[0] : value);
const getPointValue = (source, keys, fallback) => {
  const rawValue = keys.reduce(
    (value, key) => (value === undefined ? source?.[key] : value),
    undefined
  );
  const nextValue = Number(rawValue);

  return Number.isFinite(nextValue) ? nextValue : fallback;
};

const CheckoutClaimPoints = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const routeUserId = getRouteValue(router.query.user_id);
  const routeStoreName = getRouteValue(router.query.store_name);
  const [redeemPoints, setRedeemPoints] = useState(DEFAULT_REDEEM_POINTS);
  const [confirmedPoints, setConfirmedPoints] = useState(0);
  const [redeemPointsError, setRedeemPointsError] = useState("");

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

  const cartPath = routeUserId ? `my_cart_${routeUserId}` : "";

  useEffect(() => {
    if (cartPath) {
      dispatch(fetchCart(cartPath));
    }
  }, [cartPath, dispatch]);

  const products = useMemo(
    () => (collection?.product_lists || []).map((product) => ({
      ...product,
      qty: product.qty || 1,
    })),
    [collection]
  );

  const checkoutPointsData =
    checkoutUpdatedPoints?.events?.[0] ||
    checkoutUpdatedPoints?.event ||
    checkoutUpdatedPoints;
  const hasCalculatedPoints = Boolean(checkoutPointsData);
  const totalClaimPoints = getPointValue(
    checkoutPointsData,
    ["total_earned", "total_points", "totalPoints", "points", "earned_points"],
    checkoutUpdatedPoints?.total_earned
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
    checkoutUpdatedPoints?.available_balance
  );
  const orderTotal = collection?.total_amount || 0;
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
  const customerName =
    authUser?.full_name ||
    authUser?.name ||
    authUser?.user_name ||
    routeUserId ||
    "John Doe";
  const storeLabel = routeStoreName
    ? routeStoreName.toString().replace(/_/g, " ")
    : "Store";
  const checkoutUserId = routeUserId || authUser?.user_id || authUser?._id;
  const checkoutStoreName = storeData?.store_name || current_store_name;
  const userDID = authUser?.userDID;
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

    setRedeemPointsError("");
    setRedeemPoints(validPoints);
    setConfirmedPoints(validPoints);
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
      })
    );
     dispatch(
      checkoutUpdatePoints({
        user_id: checkoutUserId.toString(),
        store_name: checkoutStoreName,
        userDID,
      })
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 text-[#242424] md:px-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-[#d7d7d7] bg-white shadow-sm">
        <header className="border-b border-[#d7d7d7] px-5 py-4">
          <p className="text-2xl font-semibold">
            Checkout at the counter - [Customer Name: {customerName}]
          </p>
          <p className="mt-1 capitalize text-sm text-gray-500">{storeLabel}</p>
        </header>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.55fr]">
          <div className="border-b border-[#d7d7d7] p-5 lg:border-b-0 lg:border-r">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="min-h-[132px] space-y-3 text-sm">
              {loading && <p className="text-gray-500">Loading cart...</p>}

              {!loading && products.length === 0 && (
                <p className="text-gray-500">No cart products found.</p>
              )}

              {products.map((product, index) => (
                <div
                  key={`${product.mfr_code || product.product_id || index}`}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {(
                      product.image ||
                      product.product_image ||
                      product.thumbnail ||
                      product.cover_image
                    ) && (
                      <img
                        src={
                          product.image ||
                          product.product_image ||
                          product.thumbnail ||
                          product.cover_image
                        }
                        alt={product.name || product.mfr_code || `Product ${index + 1}`}
                        className="h-20 w-20 flex-none rounded-md border border-[#e5e5e5] object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium whitespace-nowrap overflow-hidden ">
                         ({product.name || product.mfr_code || "Item"})
                      </p>
                      <p className="text-gray-500">Qty {product.qty}</p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {product.display_amount || product.price
                      ? `Rs ${Number(product.display_amount || product.price).toLocaleString()}`
                      : "SX"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[#d7d7d7] pt-4 text-right">
              <p className="text-lg font-semibold">
                {orderTotal ? `Rs ${orderTotal.toLocaleString()}` : "SX"} Total
              </p>
            </div>
          </div>

          <div className="p-5">
            <div className="mx-auto max-w-[420px]  text-[15px] text-black">
              <button
                type="button"
                onClick={handleCalculatePoints}
                disabled={checkoutUpdatePointsLoading}
                className="w-full bg-kiosk-secondary hover:bg-kiosk-primary py-1 text-center text-[16px] uppercase disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checkoutUpdatePointsLoading ? "CALCULATING POINTS" : "CALCULATE POINTS"}
              </button>
              {checkoutUpdatePointsLoading && 
              <div className="px-3 py-2 leading-6">
                <p>Calculating points at checkout....</p>
                <p>Reading rules..</p>
                <p>Checking for points per product........</p>
              </div>
                 }

              <div className="border-t-2 mt-3 border-black pt-3 text-center">
                <p className="text-[16px] uppercase">
                  TOTAL POINTS FOR {customerName.toString().toUpperCase()}:{" "}
                  {totalClaimPoints}
                </p>
                <p className="mt-5 text-[16px]">
                  Max Available to redeem:{" "}
                  <span className="ml-2">{maxAvailableToRedeem}</span>
                </p>
              </div>

              <div className="mt-5 bg-[#fbfbfb] px-2 py-3">
                <label
                  htmlFor="redeem-points"
                  className="mb-1 block text-base font-semibold"
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
                  className="mt-2 w-full hover:bg-kiosk-primary bg-kiosk-secondary py-1 text-center text-[16px] uppercase disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {redeemSessionHCS20PointsLoading
                    ? "REDEEMING POINTS"
                    : "REDEEM POINTS"}
                </button>
              </div>

              {hasCalculatedPoints && (
                <div className="mt-6 border-t-2 border-black px-3 pt-5 leading-6">
                  { redeemSessionHCS20PointsLoading&& <p>Updating final balance....</p>}
                  <p>Remaining balance: {remainingPoints} points</p>
                </div>
              )}

              {checkoutUpdatePointsError && (
                <p className="mt-6 border-t-2 border-black px-3 pt-5 text-xs text-red-600">
                  Failed to calculate checkout points.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutClaimPoints;
