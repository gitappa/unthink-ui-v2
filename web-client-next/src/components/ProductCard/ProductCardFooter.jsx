import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import AddToCartButton from "../common/AddToCartButton";
import BuyNowButton from "../common/BuyNowButton";
import {
  getDisabledProductBuyButtonClass,
  getProductBuyButtonClass,
  getProductCardAttributes,
  KIOSK_CART_ICON_CLASS,
} from "../../helper/product/productCardHelpers";
import {
  getProductCurrencySymbol,
  getProductDiscountPercentage,
  isProductOutOfStock,
} from "../../helper/product/productDisplayHelpers";
import styles from "../singleCollection/ProductCard.module.css";

const { Text } = Typography;

const ProductCardFooter = ({
  productCard = {},
  user = {},
  kiosk = {},
  wishlist = {},
  cart = {},
}) => {
  const { product, size, storeData, isCustomProductsPage } = productCard;
  const { authUserId, authUser, storeId, source } = user;
  const {
    hasAccess: hasKioskAccess,
    getLogin: getKioskLogin,
    enableGuestPopup: enableKioskGuestPopup,
  } = kiosk;
  const { showModal: showWishlistModal } = wishlist;
  const {
    onGuestPopupOpen,
    sourceCollection: cartSourceCollection,

  } = cart;


  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const productCardAttributes = useMemo(() => {
    const attributes = storeData?.pdp_settings?.product_card_attributes || [];
    return getProductCardAttributes(product, attributes);
  }, [product, storeData?.pdp_settings?.product_card_attributes]);

  const currencySymbol = useMemo(
    () => getProductCurrencySymbol(product),
    [product],
  );
  const discountPer = getProductDiscountPercentage(product);
  const isOutOfStock = isProductOutOfStock(product);
  const hasProductPrice = (product?.price ?? product?.listprice) != null;

  const cartIconClassName =
    showWishlistModal || size === "small"
      ? styles["product-cart-icon-small"]
      : hasKioskAccess
        ? KIOSK_CART_ICON_CLASS
        : "h-4 w-4 md:h-5 md:w-5";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div
      className={`${styles["product-footer-main"]} ${size === "small" ? styles["product-footer-main-small"] : styles["product-footer-main-medium"]}`}
    >
      <div className={styles["product-name-section"]}>
        <p className={styles["product-brand-footer-text"]}>
          {" "}
          <span>{product?.brand || "\u00A0"}</span>
        </p>

        <Text
          ellipsis={{ tooltip: product.name }}
          className={styles["product-name-text"]}
        >
          {product.name || "\u00A0"}
        </Text>
      </div>

      {productCardAttributes.length > 0 ? (
        <div
          className={`${styles.tagsContainerWrapper} ${
            isOverflowing ? styles.isOverflowing : ""
          }`}
        >
          <Swiper
            ref={containerRef}
            spaceBetween={8}
            slidesPerView={"auto"}
            freeMode={true}
            className={styles.tagscontainer}
          >
            {productCardAttributes.map((attribute) => (
              <SwiperSlide key={attribute.key} style={{ width: "auto" }}>
                <span className={styles.smalltags}>
                  {attribute.label}: {attribute.value}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className={`${styles.tagscontainer} p-1`}> &nbsp;</div>
      )}

      <div
        className={`${styles["product-price-container"]} ${hasProductPrice ? styles["product-price-container-height"] : styles["product-price-container-height"]}`}
      >
        <div
          className={`${styles["product-price-display"]} ${isOutOfStock ? "hidden" : ""}`}
        >
          <span
            className={`${styles["product-price-text"]} ${size === "small" ? styles["product-price-text-small"] : styles["product-price-text-medium"]}`}
          >
            {hasProductPrice ? (
              <span>
                {currencySymbol}
                {(product.price ?? product.listprice)?.toLocaleString()}
              </span>
            ) : null}
          </span>

          {product?.price > 0 &&
            product?.listprice > product?.price &&
            discountPer > 0 && (
              <>
                <span className={styles["product-listprice-text"]}>
                  <span className={styles["product-listprice-value"]}>
                    {currencySymbol}
                    {product?.listprice}
                  </span>
                </span>
                <span className={styles["product-discount-badge-text"]}>
                  {(discountPer && `${discountPer}% OFF`) || null}
                </span>
              </>
            )}
        </div>
      </div>

      {(storeData?.pdp_settings?.is_buy_button ||
        storeData?.pdp_settings?.is_add_to_cart_button) &&
        !isCustomProductsPage && (
          <>
            {storeData?.pdp_settings?.is_buy_button ? (
              <BuyNowButton
                product={product}
                authUserId={authUserId}
                authUser={authUser}
                storeId={storeId}
                style={{
                  background: !hasProductPrice ? "#F2F1FD" : "#9690F0",
                  cursor: !hasProductPrice ? "not-allowed" : "pointer",
                  color: !hasProductPrice ? "#616161" : "",
                }}
                className={getProductBuyButtonClass(size, hasKioskAccess)}
                disabled={!hasProductPrice}
                hasKioskAccess={hasKioskAccess}
                showStartIcon
                showWishlistModal={showWishlistModal}
                size={size}
              >
                Buy Now
              </BuyNowButton>
            ) : (
              <AddToCartButton
                product={product}
                authUserId={authUserId}
                getKioskLogin={getKioskLogin}
                hasKioskAccess={hasKioskAccess}
                enableKioskGuestPopup={enableKioskGuestPopup}
                onGuestPopupOpen={onGuestPopupOpen}
                source={source}
                collection={cartSourceCollection}
                eventId={storeData?.event_id}
                isOutOfStock={isOutOfStock}
                className={`${isOutOfStock ? getDisabledProductBuyButtonClass(size, hasKioskAccess) : getProductBuyButtonClass(size, hasKioskAccess)} ${isOutOfStock ? "bg-secondary product-out-of-stock-button" : ""} ${!hasProductPrice ? "hidden" : ""}`}
                disabled={!hasProductPrice}
                iconClassName={cartIconClassName}
                showIcon
              />            
            )}
          </>
        )}
    </div>
  );
};

export default ProductCardFooter;
