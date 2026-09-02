import React from "react";
import axios from "axios";
import { payment_url } from "../../constants/config";
import { getTTid } from "../../helper/getTrackerInfo";
import {
  getStaticImageSrc,
  KIOSK_CART_ICON_CLASS,
} from "../../helper/product/productCardHelpers";
import shopping from "../singleCollection/images/Card/shopping-bag3.svg";
import productCardStyles from "../singleCollection/ProductCard.module.css";

const BuyNowButton = ({
  product,
  authUserId,
  authUser,
  storeId,
  children = "Buy Now",
  className,
  disabled,
  hasKioskAccess = false,
  showStartIcon = false,
  showWishlistModal = false,
  size = "medium",
  style,
  type = "button",
}) => {
  const isDisabled = disabled ?? (!product?.price && !product?.listprice);
  const checkoutProductPayment = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    const location =
      typeof window !== "undefined" ? window.location.origin : "";
    const payload = {
      amount: product?.price || product?.listprice || 0,
      currency: "USD",
      thumbnail: product?.image,
      user_id: authUserId || getTTid(),
      store_id: storeId,
      service_id: `Product_${product?.mfr_code}`,
      emailId: authUser?.emailId || null,
      successUrl: `${location}/successpayment`,
      failureUrl: `${location}/failedpayment`,
      additional_details: {
        mfr_code: product?.mfr_code,
      },
      title: product?.name,
    };

    try {
      const res = await axios.post(
        `${payment_url}/api/payments/checkout`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res?.data?.redirectUrl && typeof window !== "undefined") {
        window.location.href = res.data.redirectUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled}
      style={style}
      onClick={checkoutProductPayment}
    >
      {showStartIcon ? (
        <img
          style={{
            filter: isDisabled
              ? "brightness(0) saturate(100%) invert(38%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(95%)"
              : "",
          }}
          src={getStaticImageSrc(shopping)}
          alt="Buy now"
          height={20}
          width={20}
          className={
            showWishlistModal || size === "small"
              ? productCardStyles["product-cart-icon-small"]
              : hasKioskAccess
                ? KIOSK_CART_ICON_CLASS
                : "h-4 w-4 md:h-5 md:w-5"
          }
        />
      ) : null}
      {children}
    </button>
  );
};

export default BuyNowButton;
