import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getStoredKioskLogin } from "../../helper/utils";
import { getTTid } from "../../helper/getTrackerInfo";
import { getNormalizedCartQty } from "../../helper/product/productCardHelpers";
import AddToCartButton, { addProductToCart } from "../common/AddToCartButton";
import BuyNowButton from "../common/BuyNowButton";
import GuestUserPopUp from "../../pageComponents/Auth/GuestUserPopUp";
import { GuestPopUpShow } from "../../pageComponents/Auth/redux/actions";

const ProductActions = ({
  brandsDetails,
  storeData,
  productDetails,
  collection,
  authUserId,
  hasKioskAccess,
  isUserLogin,
  authUser,
  storeId,
}) => {
  const dispatch = useDispatch();
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [pendingCartQty, setPendingCartQty] = useState(null);
  const cardItem = collection?.product_lists?.find(
    (item) => item.mfr_code === productDetails?.mfr_code,
  );

  const openCartGuestPopup = (qty) => {
    setIsCartPopupOpen(true);
    setPendingCartQty(qty);
    dispatch(GuestPopUpShow(true));
  };

  const handleCartAction = (qty = 1, userIdOverride = null) => {
    if (!productDetails?.mfr_code) return;

    const normalizedQty = getNormalizedCartQty(qty);
    const kioskLogin = getStoredKioskLogin();
    const kioskUserId = userIdOverride || kioskLogin?.user_id;

    if (hasKioskAccess && !kioskUserId) {
      openCartGuestPopup(normalizedQty);
      return;
    }

    const cartUserId = kioskUserId || authUserId || getTTid();

    addProductToCart({
      dispatch,
      product: productDetails,
      qty: normalizedQty,
      userId: cartUserId,
    });
  };

  return (
    <>
      {brandsDetails?.paymentMethod ? (
        <div className="lg:mt-8 mt-4">
          <div className="grid gap-2">
            {brandsDetails.paymentMethod.split(",").map((item, idx) => {
              const link = item.trim();
              return (
                <a
                  key={`${link}-${idx}`}
                  style={{ background: "#7c75ec" }}
                  className=" text-white flex justify-center items-center  py-2.5 w-36 font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg   "
                  target="_blank"
                  rel="noreferrer"
                  href={link}
                >
                  Buy Now
                </a>
              );
            })}
          </div>
        </div>
      ) : null}

      {(storeData?.pdp_settings?.is_buy_button ||
        storeData?.pdp_settings?.is_add_to_cart_button) && (
        <div className="my-8 pb-2">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {storeData?.pdp_settings?.is_add_to_cart_button && (
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center w-full">
                <div className="h-12 items-center flex gap-6 sm:gap-8 px-4 border border-support rounded-xl bg-white">
                  <button
                    className="text-xl font-medium text-[#1f2c3b] cursor-pointer"
                    onClick={() => {
                      handleCartAction((cardItem?.qty || 0) - 1);
                    }}
                  >
                    -
                  </button>
                  <button className="text-base sm:text-lg font-semibold text-[#1f2c3b] cursor-pointer">
                    {cardItem?.qty || 0}
                  </button>
                  <button
                    className="text-xl font-medium text-[#1f2c3b] cursor-pointer"
                    onClick={() => {
                      handleCartAction((cardItem?.qty || 0) + 1);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="text-white h-12 sm:h-14 w-full sm:w-auto sm:min-w-[210px]">
                  <AddToCartButton
                    product={productDetails}
                    qty={(cardItem?.qty || 0) + 1}
                    authUserId={authUserId}
                    kiosk={{
                      hasAccess: hasKioskAccess,
                      getLogin: getStoredKioskLogin,
                    }}
                    onGuestPopupOpen={({ qty }) => {
                      openCartGuestPopup(qty);
                    }}
                    disabled={false}
                    className={` h-full px-6 ${hasKioskAccess ? "bg-kiosk-primary  font-medium" : "bg-brand text-white font-semibold"} w-full rounded-xl  text-sm sm:text-base shadow-md hover:shadow-lg transition`}
                  >
                    Add to Cart
                  </AddToCartButton>
                </div>
              </div>
            )}

            {storeData?.pdp_settings?.is_buy_button &&
              (productDetails?.url && productDetails.url !== "dummy_url" ? (
                <a
                  href={productDetails.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-white py-2.5 w-36 font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition flex justify-center items-center"
                  style={{
                    background: "#7c75ec",
                  }}
                >
                  Buy
                </a>
              ) : (
                <BuyNowButton
                  product={productDetails}
                  authUserId={authUserId}
                  authUser={authUser}
                  storeId={storeId}
                  className="inline text-white disabled:opacity-50 disabled:cursor-not-allowed py-2.5 w-36 font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition"
                  disabled={!productDetails?.price && !productDetails?.listprice}
                  style={{
                    background: "#7c75ec",
                    cursor:
                      !productDetails?.price && !productDetails?.listprice
                        ? "not-allowed"
                        : "",
                  }}
                >
                  Buy
                </BuyNowButton>
              ))}
          </div>
        </div>
      )}
      <GuestUserPopUp
        isOpen={isCartPopupOpen}
        setIsOpen={setIsCartPopupOpen}
        storeName={storeData?.store_name}
        isUserLogin={!isUserLogin ? true : false}
        persistKioskLogin
        onSuccess={({ userId }) => {
          handleCartAction(pendingCartQty ?? 1, userId);
          setPendingCartQty(null);
        }}
        onSkip={() => setPendingCartQty(null)}
      />
    </>
  );
};

export default ProductActions;
