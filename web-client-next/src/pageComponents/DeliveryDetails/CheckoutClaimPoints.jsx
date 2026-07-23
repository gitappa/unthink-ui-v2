import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./redux/action";
import { current_store_name } from "../../constants/config";
import ClaimPoints from "./ClaimPoints";

const DEFAULT_CLAIM_IMAGE_URL = "https://example.com/nft/platnium.png";

const getRouteValue = (value) => (Array.isArray(value) ? value[0] : value);

const CheckoutClaimPoints = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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
  const customerName =
    authUser?.full_name ||
    authUser?.name ||
    authUser?.user_name ||
    routeUserId ||
    "John Doe";
  const checkoutUserId = routeUserId || authUser?.user_id || authUser?._id;
  const checkoutStoreName = storeData?.store_name || current_store_name;
  const userDID = authUser?.userDID;
  const claimImageUrl =
    storeData?.pdp_settings?.badge_url ||
    storeData?.badge_image_url ||
    DEFAULT_CLAIM_IMAGE_URL;

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 text-[#242424] md:px-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-[#d7d7d7] bg-white shadow-sm">
        <header className="border-b border-[#d7d7d7] px-5 py-4">
          <p className="text-2xl font-semibold">
            Checkout at the counter - [Customer Name: {customerName}]
          </p>
          <p className="mt-1 capitalize text-sm text-gray-500">{storeData?.store_name}</p>
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

          <ClaimPoints
            // checkoutUpdatedPoints={checkoutUpdatedPoints}
            // checkoutUpdatePointsLoading={checkoutUpdatePointsLoading}
            // checkoutUpdatePointsError={checkoutUpdatePointsError}
            // redeemSessionHCS20PointsLoading={redeemSessionHCS20PointsLoading}
            // checkoutUserId={checkoutUserId}
            // checkoutStoreName={checkoutStoreName}
            // userDID={userDID}
            // claimImageUrl={claimImageUrl}
            checkoutPage={true}
          />
        </div>
      </section>
    </main>
  );
};

export default CheckoutClaimPoints;
