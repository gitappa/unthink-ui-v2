import React from "react";
import {
  CopyOutlined,
  EyeOutlined,
  HeartOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import AddToCartButton from "../common/AddToCartButton";
import WishlistHeartButton from "../../pageComponents/storePage/CardComponents/WishlistHeartButton";
import { WISHLIST_TITLE } from "../../constants/codes";
import { getFinalImageUrl } from "../../helper/utils";
import { getTTid } from "../../helper/getTrackerInfo";
import { getStaticImageSrc } from "../../helper/product/productCardHelpers";
import ProductMenuButton from "./ProductMenuButton";
import ProductRemoveAction from "./ProductRemoveAction";
import camera from "../singleCollection/images/Card/camera.svg";
import openInNewTabIcon from "../../images/open_in_new_tab.svg";
import styles from "../singleCollection/ProductCard.module.css";

const ProductCardHeader = ({
  product,
  size,
  isCustomProductsPage,
  storeData,
  enableSelect,
  setSelectValue,
  isSelected,
  isActionCoverWidget,
  isDefaultWidget,
  showWishlistModal,
  isMyTryonsCollection,
  hasKioskAccess,
  enableKioskGuestPopup,
  kioskLoginAuth,
  onGuestPopupOpen,
  onKioskTryonClick,
  setOnMfrCode,
  onVtoClick,
  handleProductClick,
  themeCodes,
  productHasUrl,
  buyNowTitle,
  buyNowSubTitle,
  enableHoverShowcase,
  onStarClick,
  handleStarClick,
  hideAddToWishlist,
  addToWishlistClick,
  enableCopyFeature,
  handleCopyClick,
  authUserId,
  getKioskLogin,
  handleCartGuestRequired,
  source,
  cartSourceCollection,
  showProductStarAction,
  enableViewSimilar,
  showRemoveIcon,
  handleSelectProduct,
  onSimilarClick,
  showCustomProductsMenu,
  setMenuIcon,
  menuIcon,
  menuRef,
  removeFromWishlistClick,
  allowEdit,
  handleEditClick,
  isMyWishlistCollection,
  heartRedProduct,
  kioskLogin,
  isUserLogin,
  handleGuestWishlistClick,
  showStar,
}) => (
  <>
    <div
      className={`${size === "small" ? styles["product-image-container-small"] : styles["product-image-container"]}`}
      onClick={(e) => {
        if (setSelectValue) {
          e.stopPropagation();
          setSelectValue(!isSelected);
        }
      }}
    >
      {product?.avlble === 0 && (
        <div className={styles["product-sold-badge"]}>SOLD</div>
      )}
      <div style={{ width: "100%" }}>
        <img
          src={getFinalImageUrl(product.image)}
          alt={product.name || "Product image"}
          width="100%"
          className={`${styles["product-image"]} ${size === "small" ? styles["product-image-small"] : styles["product-image-medium"]}`}
          loading="lazy"
        />
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
        {!enableSelect &&
          !isActionCoverWidget &&
          !hasKioskAccess &&
          !showWishlistModal && (
            <div
              className={`${size === "small" ? styles["product-view-btn-small"] : styles["product-view-btn"]}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleProductClick({ open: true });
              }}
            >
              <EyeOutlined className={styles["product-view-icon-eye"]} />
            </div>
          )}
      </div>

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
    </div>
    <div
      className={`${styles["header-container"]} ${
        enableViewSimilar || (isDefaultWidget && showRemoveIcon) || enableSelect
          ? styles["flex-reverse"]
          : ""
      } ${size === "small" ? styles["header-small"] : styles["header-medium"]}`}
    >
      {enableSelect && product?.custom_product !== false ? (
        <div
          className={`${styles["product-remove-icon-container"]} ${size === "small" ? styles["product-remove-icon-container-small"] : ""}`}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onClick={handleSelectProduct}
            onChange={() => {}}
            className={`${styles[size === "small" ? "product-checkbox-small" : "product-checkbox-large"]}`}
          />
        </div>
      ) : (
        <>
      

          <ProductRemoveAction
            isVisible={isActionCoverWidget}
            size={size}
            onRemove={removeFromWishlistClick}
          />
          <ProductRemoveAction
            isVisible={showWishlistModal && isDefaultWidget}
            size={size}
            onRemove={removeFromWishlistClick}
            hideOnMedium
          />
          <ProductMenuButton
            showCustomProductsMenu={showCustomProductsMenu}
            size={size}
            menuIcon={menuIcon}
            setMenuIcon={setMenuIcon}
            menuRef={menuRef}
            isDefaultWidget={isDefaultWidget}
            showRemoveIcon={showRemoveIcon}
            removeFromWishlistClick={removeFromWishlistClick}
            enableCopyFeature={enableCopyFeature}
            handleCopyClick={handleCopyClick}
            isCustomProductsPage={isCustomProductsPage}
            allowEdit={allowEdit}
            handleEditClick={handleEditClick}
          />
        </>
      )}

      <div className="product-name overflow-hidden product_details_container" />
    </div>

    {(!hideAddToWishlist || (isDefaultWidget && showStar)) &&
      !showWishlistModal &&
      !enableSelect &&
      product?.custom_product !== false &&
      !isMyWishlistCollection && (
        <div className="flex items-center gap-2 cursor-pointer rounded-md transition-all duration-200 ease-in-out max-md:text-sm">
          {!hideAddToWishlist && (
            <WishlistHeartButton
              isActive={!!heartRedProduct}
              containerClassName={` absolute ${hasKioskAccess ? "right-3 top-3.5" : "right-[15px] top-[55px] max-[1024px]:top-[45px]"}  z-[35] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] max-[1024px]:right-[10px]  max-[1024px]:z-[30]`}
              onAdd={addToWishlistClick}
              productMfrCode={product?.mfr_code}
              userId={kioskLogin?.user_id || authUserId || getTTid()}
            />
          )}
        </div>
      )}

    {hideAddToWishlist &&
      !isUserLogin &&
      size === "medium" &&
      !showWishlistModal &&
      !enableSelect && (
        <div className="flex items-center gap-2 cursor-pointer rounded-md transition-all duration-200 ease-in-out max-md:text-sm">
          <WishlistHeartButton
            containerClassName="absolute right-[15px] top-[55px] z-[35] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] max-[1024px]:right-[10px] max-[1024px]:top-[45px] max-[1024px]:z-[30]"
            onAdd={handleGuestWishlistClick}
          />
        </div>
      )}
  </>
);

export default ProductCardHeader;
