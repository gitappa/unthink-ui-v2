import React, { useCallback } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { getStaticImageSrc } from "../../helper/product/productCardHelpers";
import camera from "../singleCollection/images/Card/camera.svg";
import openInNewTabIcon from "../../images/open_in_new_tab.svg";
import styles from "../singleCollection/ProductCard.module.css";

 const ProductCardHeaderBottom = ({
  product,
  size,
  isCustomProductsPage,
  storeData,
  enableSelect,
  isActionCoverWidget,
  kiosk = {},
  wishlist = {},
  callbacks = {},
  isMyTryonsCollection,
  themeCodes,
  productHasUrl,
  buyNowTitle,
  showProductStarAction,
}) => {
  const {
    hasAccess: hasKioskAccess,
    loginAuth: kioskLoginAuth,
    enableGuestPopup: enableKioskGuestPopup,
    onGuestPopupOpen,
    onTryonClick: onKioskTryonClick,
  } = kiosk;
  const { showModal: showWishlistModal } = wishlist;
  const { onSetMfrCode: setOnMfrCode, onVtoClick, onStarClick } = callbacks;

  const handleStarClick = useCallback(
    (e) => {
      e.stopPropagation();
      onStarClick && onStarClick();
    },
    [onStarClick],
  );

  return (
    <>
    {product?.avlble === 0 && (
      <div className={styles["product-sold-badge"]}>SOLD</div>
    )}

    {!isCustomProductsPage &&
      storeData.is_tryon_enabled &&
      !enableSelect &&
      !isActionCoverWidget &&
      !showWishlistModal &&
      product?.custom_product !== false &&
      !isMyTryonsCollection && (
        <div
          className={`${size === "small" ? styles["product-vto-item-small"] : styles["product-vto-item"]}`}
          onClick={(e) => {
            e.stopPropagation();
            const mfrCode = product?.mfr_code;
            setOnMfrCode?.(product);
            if (hasKioskAccess && enableKioskGuestPopup) {
              if (!kioskLoginAuth) {
                onGuestPopupOpen?.({
                  type: "vto",
                  mfrCode,
                  product,
                });
                onVtoClick?.();
                return;
              }

              if (mfrCode && onKioskTryonClick) {
                onKioskTryonClick(product);
                return;
              }
            }
            if (mfrCode) {
              onVtoClick?.(mfrCode);
            }
          }}
          title="Try on with virtual camera"
        >
          <img
            height={20}
            width={20}
            alt="Try on with camera"
            className={`${styles["product-vto-icon"]}`}
            src={getStaticImageSrc(camera)}
          />
          <p>Try On</p>
        </div>
      )}

    <div
      className={styles["product-overlay"]}
      style={{ background: themeCodes.productCard.hover_bg }}
    >
      {!enableSelect ? (
        <h1
          className={`${styles["product-buy-now"]} ${size === "small" ? styles["product-buy-now-small"] : styles["product-buy-now-medium"]} product_buy_now ${styles["product-action-buttons-container"]}`}
        >
          {productHasUrl ? buyNowTitle : null}
          {productHasUrl ? (
            <img
              src={getStaticImageSrc(openInNewTabIcon)}
              alt="open"
              width={20}
              height={20}
              className={styles["product-buy-now-icon"]}
            />
          ) : null}
        </h1>
      ) : null}
    </div>

    {!enableSelect && (
      <div className={styles["product-showcase-button-main"]}>
        <div>
          {showProductStarAction ? (
            <button
              className={`${styles["product-star-action-button"]}`}
              tabIndex="-1"
              role={onStarClick ? "button" : "img"}
              onClick={handleStarClick}
            >
              {product.starred ? (
                <StarFilled className={styles["icon-filled"]} />
              ) : (
                <StarOutlined className={styles["icon-outlined"]} />
              )}
            </button>
          ) : null}
        </div>
      </div>
    )}
    </>
  );
};

export default ProductCardHeaderBottom;
