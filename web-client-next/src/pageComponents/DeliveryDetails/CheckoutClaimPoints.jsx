import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FaAward, FaShoppingCart, FaTicketAlt } from "react-icons/fa";
import { fetchCart } from "./redux/action";

const REWARD_POINTS_AVAILABLE = 5000;
const BLOCKCHAIN_POINTS = 15500;
const DEFAULT_REDEEM_POINTS = 500;

const getRouteValue = (value) => (Array.isArray(value) ? value[0] : value);

const CheckoutClaimPoints = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const routeUserId = getRouteValue(router.query.user_id);
  const routeStoreName = getRouteValue(router.query.store_name);
  const [redeemPoints, setRedeemPoints] = useState(DEFAULT_REDEEM_POINTS);
  const [confirmedPoints, setConfirmedPoints] = useState(0);

  const [collection, loading, authUser] = useSelector((state) => [
    state.cart?.collection,
    state.cart?.loading,
    state.auth?.user?.data,
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

  const orderTotal = collection?.total_amount || 0;
  const appliedVoucherValue = confirmedPoints ? Math.floor(confirmedPoints / 10) : 0;
  const payableTotal = Math.max(orderTotal - appliedVoucherValue, 0);
  const customerName =
    authUser?.full_name ||
    authUser?.name ||
    authUser?.user_name ||
    routeUserId ||
    "John Doe";
  const storeLabel = routeStoreName
    ? routeStoreName.toString().replace(/_/g, " ")
    : "Store";

  const handlePointsChange = (event) => {
    const nextValue = Number(event.target.value);
    setRedeemPoints(Number.isNaN(nextValue) ? 0 : nextValue);
  };

  const handleConfirmRedemption = () => {
    const validPoints = Math.min(
      Math.max(Number(redeemPoints) || 0, 0),
      REWARD_POINTS_AVAILABLE
    );
    setRedeemPoints(validPoints);
    setConfirmedPoints(validPoints);
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
                      <p className="font-medium">
                        Product {index + 1} ({product.name || product.mfr_code || "Item"})
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
              <div className="mx-auto mb-6 flex max-w-[230px] flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border-4 border-[#d6a432] bg-gradient-to-br from-[#fff3ad] via-[#e3b945] to-[#a8751e] shadow-[0_12px_24px_rgba(135,91,19,0.28)]">
                <div className="absolute inset-3 rounded-[22px] border-2 border-[#fff1a8]" />
                <FaAward className="relative z-10 text-6xl text-[#8a5c14]" />
              </div>

              <p className="mt-4 text-base font-semibold">Badge Level: Gold</p>
              <p className="text-sm leading-5">
                [Current Points on Blockchain:
                <br />
                {BLOCKCHAIN_POINTS.toLocaleString()} pts]
              </p>
            </div>
            <div className="rounded-md border border-[#d7d7d7] bg-[#fbfbfb] p-5 shadow-sm">
              
              <h2 className="text-xl font-semibold">Rewards Points</h2>
              <p className="mt-1 text-sm font-semibold">
                *Reward points available to redeem:**{" "}
                {REWARD_POINTS_AVAILABLE.toLocaleString()}
              </p>

              <div className="mt-5 flex items-center gap-4">
                <FaShoppingCart className="text-4xl text-[#b9b9b9]" />
                <button
                  type="button"
                  onClick={handleConfirmRedemption}
                  className="h-11 flex-1 rounded-md bg-brand text-base font-medium text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]"
                >
                  Redeem points
                </button>
              </div>

              <label className="mt-8 block text-sm font-medium" htmlFor="redeem-points">
                [Enter points to redeem:]
              </label>
              <input
                id="redeem-points"
                type="number"
                min="0"
                max={REWARD_POINTS_AVAILABLE}
                value={redeemPoints}
                onChange={handlePointsChange}
                className="mt-2 h-10 w-full rounded border border-[#cfcfcf] bg-white px-3 text-sm outline-none bg-brand focus:ring-2 focus:ring-[#b06fd3]/20"
              />

              <button
                type="button"
                onClick={handleConfirmRedemption}
                className="mt-3 h-11 w-full rounded-md bg-brand text-sm font-medium text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]"
              >
                + Confirm Redemption
              </button>

              {confirmedPoints > 0 && (
                <p className="mt-4 rounded bg-[#f0e2f8] px-3 py-2 text-sm font-medium text-[#6e2d87]">
                  {confirmedPoints.toLocaleString()} points confirmed for redemption.
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-[520px] rounded-md bg-white p-4 shadow-[0_28px_80px_rgba(176,111,211,0.22)]">
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cart total</span>
                    <span>{orderTotal ? `Rs ${orderTotal.toLocaleString()}` : "SX"}</span>
                  </div>
                  <div className="flex justify-between text-[#7b3f98]">
                    <span>Points value</span>
                    <span>- Rs {appliedVoucherValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#e5e5e5] pt-2 font-semibold">
                    <span>Payable total</span>
                    <span>{orderTotal ? `Rs ${payableTotal.toLocaleString()}` : "SX"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                >
                  <FaTicketAlt />
                  Apply Voucher Now (SX off)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutClaimPoints;
