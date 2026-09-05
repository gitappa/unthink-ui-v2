import React, { useCallback } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import camera from "../singleCollection/images/Card/camera.svg";
import openInNewTabIcon from "../../images/open_in_new_tab.svg";
import useTheme from "../../hooks/chat/useTheme";
import { isProductUrlAvailable } from "../../helper/product/productDisplayHelpers";

const ProductCardHeaderBottom = ({
  productCard = {},
  isActionCoverWidget,
  kiosk = {},
  wishlist = {},
  callbacks = {},
  isMyTryonsCollection,
  buyNowTitle,
  showProductStarAction,
}) => {
  const { product, size, isCustomProductsPage, storeData, enableSelect } =
    productCard;
  const {
    hasAccess: hasKioskAccess,
    loginAuth: kioskLoginAuth,
    enableGuestPopup: enableKioskGuestPopup,
    onGuestPopupOpen,
    onTryonClick: onKioskTryonClick,
  } = kiosk;
  const { showModal: showWishlistModal } = wishlist;
  const { onSetMfrCode: setOnMfrCode, onVtoClick, onStarClick } = callbacks;
  const { themeCodes } = useTheme();
  const productHasUrl = isProductUrlAvailable(product);
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
        <div className="absolute bottom-4 left-3.5 rounded-3xl bg-red px-2 py-1 text-[10px] font-medium text-white">
          SOLD
        </div>
      )}

      {!isCustomProductsPage &&
        storeData.is_tryon_enabled &&
        !enableSelect &&
        !isActionCoverWidget &&
        !showWishlistModal &&
        product?.custom_product !== false &&
        !isMyTryonsCollection && (
          <div
            className={`absolute flex w-fit cursor-pointer flex-row-reverse items-center rounded-3xl bg-white shadow-md transition-all duration-300 ease-in-out lg:hover:bg-hover-light lg:hover:shadow-lg ${
              size === "small"
                ? "bottom-2.5 left-2.5 gap-1 px-2 py-1"
                : "bottom-3 right-3 gap-1 px-2 py-1 md:bottom-5 md:right-4"
            }`}
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
              className="z-10 h-5 w-5 md:h-5 md:w-5"
              src={camera}
            />
            <p
              className={`text-xs text-black font-semibold`}
            >
              Try On
            </p>
          </div>
        )}

        {/* now now this funciton future we need  */}

      {/* <div
        className="absolute top-0 z-10 hidden h-full w-full flex-col items-center justify-center rounded-lg"
        style={{ background: themeCodes.productCard.hover_bg }}
      >
        {!enableSelect ? (
          <h1
            className={`product_buy_now m-0 flex items-center justify-between gap-1 text-center font-semibold text-white lg:gap-2 ${
              size === "small" ? "text-base" : "text-2xl"
            }`}
          >
            {productHasUrl ? buyNowTitle : null}
            {productHasUrl ? (
              <img
                src={openInNewTabIcon}
                alt="open"
                width={20}
                height={20}
                className="ml-2.5 h-5 w-5 text-white"
              />
            ) : null}
          </h1>
        ) : null}
      </div> */}

      {!enableSelect && (
        <div className="flex items-center justify-between gap-1 lg:gap-2">
          <div>
            {showProductStarAction ? (
              <button
                className="absolute bottom-2.5 right-2.5 z-20 flex cursor-pointer items-center justify-center rounded-full bg-white p-1.5 shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-50"
                tabIndex="-1"
                role={onStarClick ? "button" : "img"}
                onClick={handleStarClick}
              >
                {product.starred ? (
                  <StarFilled className="flex text-star" />
                ) : (
                  <StarOutlined className="flex text-black" />
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
