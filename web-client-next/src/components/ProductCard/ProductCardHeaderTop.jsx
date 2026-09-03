import React, { useCallback } from "react";
import { EyeOutlined } from "@ant-design/icons";
import WishlistHeartButton from "../../pageComponents/storePage/CardComponents/WishlistHeartButton";
import { getFinalImageUrl } from "../../helper/utils";
import { getTTid } from "../../helper/getTrackerInfo";
import ProductMenuButton from "./ProductMenuButton";
import ProductRemoveAction from "./ProductRemoveAction";
import styles from "../singleCollection/ProductCard.module.css";

export const ProductCardHeaderTop = ({
  product,
  collectionId,
  size,
  isCustomProductsPage,
  storeData,
  enableSelect,
  isSelected,
  isActionCoverWidget,
  isDefaultWidget,
  kiosk = {},
  wishlist = {},
  callbacks = {},
  enableCopyFeature,
  authUserId,
  source,
  enableViewSimilar,
  showRemoveIcon,
  showCustomProductsMenu,
  menuIcon,
  menuRef,
  allowEdit,
  isMyWishlistCollection,
  isUserLogin,
  showStar,
}) => {
  const {
    hasAccess: hasKioskAccess,
    login: kioskLogin,
    enableGuestPopup: enableKioskGuestPopup,
    getLogin: getKioskLogin,
    onGuestPopupOpen,
  } = kiosk;
  const {
    showModal: showWishlistModal,
    hideAddButton: hideAddToWishlist,
    heartRedProduct,
  } = wishlist;
  const {
    onProductClick: handleProductClick,
    onSetSelectValue: setSelectValue,
    onSetMenuIcon: setMenuIcon,
    onEditClick,
    onRemoveIconClick,
    onAddSelectedProductsToCollection,
  } = callbacks;

  const removeFromWishlistClick = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (onRemoveIconClick) {
        onRemoveIconClick(product.mfr_code);
      }
    },
    [onRemoveIconClick, product?.mfr_code],
  );

  const handleSelectProduct = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectValue && setSelectValue(!isSelected);
    },
    [isSelected, setSelectValue],
  );

  return (
    <>
    <div style={{ width: "100%" }}>
      <img
        src={getFinalImageUrl(product.image)}
        alt={product.name || "Product image"}
        width="100%"
        className={`${styles["product-image"]} ${size === "small" ? styles["product-image-small"] : styles["product-image-medium"]}`}
        loading="lazy"
      />
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
            product={product}
            collectionId={collectionId}
            showCustomProductsMenu={showCustomProductsMenu}
            size={size}
            menuIcon={menuIcon}
            setMenuIcon={setMenuIcon}
            menuRef={menuRef}
            isDefaultWidget={isDefaultWidget}
            showRemoveIcon={showRemoveIcon}
            removeFromWishlistClick={removeFromWishlistClick}
            enableCopyFeature={enableCopyFeature}
            isCustomProductsPage={isCustomProductsPage}
            allowEdit={allowEdit}
            onEditClick={onEditClick}
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
              product={product}
              productMfrCode={product?.mfr_code}
              storeData={storeData}
              authUserId={authUserId}
              hasKioskAccess={hasKioskAccess}
              enableKioskGuestPopup={enableKioskGuestPopup}
              getKioskLogin={getKioskLogin}
              onGuestPopupOpen={onGuestPopupOpen}
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
            product={product}
            productMfrCode={product?.mfr_code}
            storeData={storeData}
            authUserId={authUserId}
            getKioskLogin={getKioskLogin}
            onAddSelectedProductsToCollection={onAddSelectedProductsToCollection}
            source={source}
            useGuestWishlistFlow
          />
        </div>
      )}
    </>
  );
};
