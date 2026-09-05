import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProductCard.module.css";

import {
  CloseCircleOutlined,
  CopyOutlined,
  StarOutlined,
  EditFilled,
} from "@ant-design/icons";
import sharedPageTracker from "../../helper/webTracker/sharedPageTracker";
import { closeWishlistModal } from "../../pageComponents/wishlist/redux/actions";
import {
  GuestPopUpShow,
} from "../../pageComponents/Auth/redux/actions";
import {
  addSidInProductUrl,
  cleanImage,
  getCurrentTheme,
} from "../../helper/utils";
import { KIOSK_LOGIN_CHANGE_EVENT } from "../../constants/codes";

import { setShowChatModal } from "../../hooks/chat/redux/actions";
import useTheme from "../../hooks/chat/useTheme";
import {
  gTagAuraProductClick,
  gTagCollectionProductClick,
} from "../../helper/webTracker/gtag";
import { getTTid } from "../../helper/getTrackerInfo";
import { vtoIconState } from "./redux/actions";
import { useKioskAccess } from "../kiosk/components/LoggedInInfo";
import { useRouter } from "next/router";
import {
  getCollectionFlags,
  getCurrentCollectionForCard,
} from "../../helper/product/productCardHelpers";
import ProductCardFooter from "../ProductCard/ProductCardFooter";
import { ProductCardHeaderTop } from "../ProductCard/ProductCardHeaderTop";
import ProductCardHeaderBottom from "../ProductCard/ProductCardHeaderBottom";

export const PRODUCT_CARD_WIDGET_TYPES = {
  DEFAULT: "default",
  ACTION_COVER: "actionCover",
};

const ProductCard = ({
  product,
  isCustomProductsPage,
  enableClickTracking = false,
  selectedSearchOption,
  collection_id,
  onProductClick,
  productClickParam = {},
  hideAddToWishlist = false,
  enableHoverShowcase = false,
  showRemoveIcon = false,
  enableCopyFeature = true,
  size = "medium", // small, medium
  onRemoveIconClick,
  buyNowTitle = "Buy Now",
  buyNowSubTitle,
  enableSelect,
  isSelected,
  setSelectValue,
  showEdit = false,
  showStar = false,
  widgetType = PRODUCT_CARD_WIDGET_TYPES.DEFAULT, // default | actionCover
  onEditClick,
  onStarClick,
  allowEdit = false,
  collection_name,
  collection_path,
  localChatMessage,
  blogCollectionPage,
  collectionCards,
  onAddSelectedProductsToCollection,
  isSingleCollectionSharedPage,
  auramodel,
  enableKioskGuestPopup = false,
  setOnMfrCode,
  onGuestPopupOpen = () => {},
  onKioskTryonClick,
  source,
}) => {
  const dispatch = useDispatch();
  const [menuIcon, setMenuIcon] = useState(false);

  const menuRef = useRef(null);
  const router = useRouter();

 

  const [
    authUserId,
    authUserName,
    showChatModal,
    showWishlistModal,
    store_id,
    authUser,
    isUserLogin,
    collections,
    singleCollections,
    wishlistCollections,
    storeData,
  ] = useSelector((state) => [
    state.auth.user.data.user_id,
    state.auth.user.data.user_name,
    state.chatV2.showChatModal,
    state.appState.wishlist.showWishlistModal,
    state.store.data.store_id,
    state.auth.user.data,
    state?.auth?.user?.isUserLogin,
    state.auth.user.collections.data,
    state.auth.user.singleCollections.data,
    state.auth.user.wishlistCollections,
    state.store.data,
  ]);
  const hasKioskAccess = useKioskAccess({
    isUserLogin,
    storeData,
    authUser,
  });


  const [Collection_tryonStatement, setCollectionTryonStatement] =  useState(null);
  const [KioskLoginAuth, setKioskLoginAuth] = useState(null);
  const currentCollectionForCard = useMemo(
    () =>
      getCurrentCollectionForCard({
        blogCollectionPage,
        collectionId: collection_id,
        collectionName: collection_name,
        collections,
        singleCollections,
      }),
    [
      blogCollectionPage,
      collection_id,
      collection_name,
      collections,
      singleCollections,
    ],
  );
  const { isMyWishlistCollection, isMyTryonsCollection } = getCollectionFlags(
    currentCollectionForCard,
  );
 useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuIcon(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  

  const getKioskLogin = useCallback(() => {
    if (typeof window === "undefined") return null;

    try {
      return JSON.parse(window.sessionStorage.getItem("Kiosk-login") || "null");
    } catch (error) {
      return null;
    }
  }, []);

  const syncKioskLogin = useCallback(() => {
    const login = getKioskLogin();
    setKioskLoginAuth(login);
  }, [getKioskLogin]);

  useEffect(() => {
    syncKioskLogin();
    window.addEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);

    return () => {
      window.removeEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);
    };
  }, [syncKioskLogin]);
const kioskLogin = getKioskLogin();
  

  const handleProductClick = async ({ open }) => {
    // tracking event happens from here by prop enableClickTracking
    if (enableClickTracking) {
      await sharedPageTracker.onCollectionProductClick({
        mfrCode: product.mfr_code,
        redirectionUrl: product.url,
        product_brand: product.product_brand,
        brand: product.brand,
        sponsored: product.sponsored,
        collectionId: collection_id,
        ...productClickParam,
      });
    }
    // prop function to fetch recommendation on shared page
    if (onProductClick) onProductClick();

    if (selectedSearchOption?.title) {
      // GTAG CONFIGURATION AURA
      // START

      gTagAuraProductClick({
        mft_code: product?.mfr_code,
        aura_widget: selectedSearchOption?.id,
        user_id: getTTid(),
        user_name: authUserName,
        term: localChatMessage || "",
      });
      // END
    } else {
      // GTAG CONFIGURATION
      // START
      // I commented this code for causing some trubles in the navigation
      gTagCollectionProductClick({
        mft_code: product?.mfr_code,
        collection_path: authUserId
          ? addSidInProductUrl(
              product.url,
              authUserId,
              blogCollectionPage?.collection_id,
            )
          : product.url,
        user_id: getTTid(),
        user_name: authUserName,
        collection_id: blogCollectionPage?.collection_id || "",
        collection_name: blogCollectionPage?.collection_name,
      });
    }

    const cleaned = cleanImage(product?.image);
    if (cleaned) {
      localStorage.setItem(`pdp_image`, cleaned);
    }
    if (open && !hasKioskAccess) {
      window.open(`/product/${product.mfr_code}`, "_blank");
    } else {
      router.push(`/product/${product.mfr_code}`);
    }
    if (showChatModal) {
      dispatch(setShowChatModal(false));
    }
    if (showWishlistModal) {
      dispatch(closeWishlistModal());
    }
  };

  

  useEffect(() => {
    setCollectionTryonStatement(
      currentCollectionForCard?.tryon_statement
        ? currentCollectionForCard
        : null,
    );
  }, [currentCollectionForCard]);

  const Collection_vto = currentCollectionForCard?.tryon_type
    ? currentCollectionForCard
    : null;

  const productWrapperSizeClass =
    size === "small"
      ? styles["product-wrapper-small"]
      : collectionCards
        ? styles["product-wrapper-medium2"]
        : isSingleCollectionSharedPage
          ? styles["product-wrapper-medium-single"]
          : auramodel
            ? `${styles["product-wrapper-medium-single"]} ml-0`
            : styles["product-wrapper-medium-single"];
  const showCustomProductsMenu =
    isCustomProductsPage &&
    widgetType !== PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
    !showWishlistModal &&
    !enableSelect;
  const showProductStarAction =
    showStar &&
    (widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT ||
      widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER);
  const cartSourceCollection =
    source === "COLLECTION"
      ? {
          id: collection_id,
          name: collection_name,
          path: collection_path,
        }
      : undefined;

  const handleVtoClick = (mfrCode) => {
    if (mfrCode) {
      dispatch(vtoIconState(mfrCode));
      return;
    }
    dispatch(GuestPopUpShow(true));
  };

  const kioskConfig = {
    hasAccess: hasKioskAccess,
    login: kioskLogin,
    loginAuth: KioskLoginAuth,
    enableGuestPopup: enableKioskGuestPopup,
    getLogin: getKioskLogin,
    onGuestPopupOpen,
    onTryonClick: onKioskTryonClick,
  };
  const wishlistConfig = {
    showModal: showWishlistModal,
    hideAddButton: hideAddToWishlist,
    collections: wishlistCollections,
  };
  const productCardConfig = {
    product,
    size,
    isCustomProductsPage,
    storeData,
    enableSelect,
    tryonConfig: Collection_vto || Collection_tryonStatement,
    saveUserId: KioskLoginAuth?.user_id || authUser?.user_id || null,
  };
  const userConfig = {
    authUserId,
    authUser,
    storeId: store_id,
    source,
    isLoggedIn: isUserLogin,
  };
  const cartConfig = {
    onGuestPopupOpen,
    sourceCollection: cartSourceCollection,
  };
  const headerTopCallbacks = {
    onSetSelectValue: setSelectValue,
    onSetMenuIcon: setMenuIcon,
    onEditClick,
    onRemoveIconClick,
    onAddSelectedProductsToCollection,
  };
  const headerBottomCallbacks = {
    onSetMfrCode: setOnMfrCode,
    onVtoClick: handleVtoClick,
    onStarClick,
  };
  const handleCardClick = (event) => {
    if (enableSelect) return;

    const interactiveElement = event.target?.closest?.(
      "a, button, input, select, textarea, [role='button'], div.swiper-wrapper",
    );
    if (interactiveElement) return;
    if(hasKioskAccess){
    sessionStorage.setItem("plp-scroll", String(window.scrollY));
    sessionStorage.setItem("plp-collection", singleCollections?.path);
    handleProductClick({ open: false });
    }

    const openInNewTab =
      !hasKioskAccess && window.matchMedia("(min-width: 1024px)").matches;
    handleProductClick({ open: openInNewTab });
  };

  return (
    <div
      // style={{ backgroundColor: showWishlistModal ? "white" : "" }}
      className={`${styles["product-wrapper"]} ${getCurrentTheme()} ${widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER ? styles["product-wrapper-action-cover"] : ""} ${productWrapperSizeClass}`}
    >
      <div
        className={`${styles["product-container"]} ${  styles["product-container-all-rounded"]}`}
        style={{ cursor: "pointer" }}
        onClick={handleCardClick}
      >
        <div
          className={`${size === "small" ? styles["product-image-container-small"] : styles["product-image-container"]}`}
          onClick={(e) => {
            if (isSelected) {
              e.stopPropagation();
              setSelectValue(!isSelected);
            }
          }}
        >
          <ProductCardHeaderTop
            productCard={productCardConfig}
            collectionId={collection_id}
            isSelected={isSelected}
            isActionCoverWidget={
              widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER
            }
            isDefaultWidget={widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT}
            kiosk={kioskConfig}
            wishlist={wishlistConfig}
            callbacks={headerTopCallbacks}
            enableCopyFeature={enableCopyFeature}
            user={userConfig}
            source={source}
            showRemoveIcon={showRemoveIcon}
            showCustomProductsMenu={showCustomProductsMenu}
            menuIcon={menuIcon}
            menuRef={menuRef}
            allowEdit={allowEdit}
            isMyWishlistCollection={isMyWishlistCollection}
            showStar={showStar}
          />
          <ProductCardHeaderBottom
            productCard={productCardConfig}
            isActionCoverWidget={
              widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER
            }
            kiosk={kioskConfig}
            wishlist={wishlistConfig}
            isMyTryonsCollection={isMyTryonsCollection}
            callbacks={headerBottomCallbacks}
            buyNowTitle={buyNowTitle}
            showProductStarAction={showProductStarAction}
          />
        </div>
        <ProductCardFooter
          productCard={productCardConfig}
          user={userConfig}
          kiosk={kioskConfig}
          wishlist={wishlistConfig}
          cart={cartConfig}
        />
      </div>

    </div>
  );
};

export default React.memo(ProductCard);
