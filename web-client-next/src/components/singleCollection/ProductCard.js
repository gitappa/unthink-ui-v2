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
import VirtualTryOnModal from "./VirtualTryOnModal";
import { vtoIconState } from "./redux/actions";
import { useKioskAccess } from "../kiosk/components/LoggedInInfo";
import { useRouter } from "next/router";
import {
  getCollectionFlags,
  getCurrentCollectionForCard,
  shouldEnableViewSimilar,
} from "../../helper/product/productCardHelpers";
import { isProductUrlAvailable } from "../../helper/product/productDisplayHelpers";
import ProductCardHeader from "../ProductCard/ProductCardHeader";
import ProductCardFooter from "../ProductCard/ProductCardFooter";

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
  hideViewSimilar = false,
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
  const { themeCodes } = useTheme();
  const [menuIcon, setMenuIcon] = useState(false);

  const menuRef = useRef(null);
  const router = useRouter();

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

  const [
    authUserId,
    authUserName,
    showChatModal,
    showWishlistModal,
    store_id,
    authUser,
    ButtonClick,
    isUserLogin,
    collections,
    singleCollections,
    wishlistCollections,
  ] = useSelector((state) => [
    state.auth.user.data.user_id,
    state.auth.user.data.user_name,
    state.chatV2.showChatModal,
    state.appState.wishlist.showWishlistModal,
    state.store.data.store_id,
    state.auth.user.data,
    state.VtoIconReducer.ButtonClick,
    state?.auth?.user?.isUserLogin,
    state.auth.user.collections.data,
    state.auth.user.singleCollections.data,
    state.auth.user.wishlistCollections,
  ]);
  const { collection } = useSelector((state) => state.cart);
  const cartCollection = collection?.product_lists
    ?.map((arr) => arr?.mfr_code)
    .find((arr) => arr === product.mfr_code);
  const [storeData] = useSelector((state) => [state.store.data]);
  const [Collection_tryonStatement, setCollectionTryonStatement] =
    useState(null);
  const [KioskLoginAuth, setKioskLoginAuth] = useState(null);
  const heartRedProduct = wishlistCollections?.product_lists?.find(
    (x) => x.mfr_code === product.mfr_code,
  );

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

  const hasKioskAccess = useKioskAccess({
    isUserLogin,
    storeData,
    authUser,
  });
  const enableViewSimilar = useMemo(() => {
    return shouldEnableViewSimilar(hideViewSimilar);
  }, [hideViewSimilar]);

  const productHasUrl = isProductUrlAvailable(product);

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
    } else if (hasKioskAccess) {
      router.push(`/product/${product.mfr_code}`);
    }
    if (showChatModal) {
      dispatch(setShowChatModal(false));
    }
    if (showWishlistModal) {
      dispatch(closeWishlistModal());
    }
  };

  const kioskLogin = getKioskLogin();

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
  const handleCartGuestRequired = ({ product: cartProduct, qty }) => {
    onGuestPopupOpen?.({
      type: "cart",
      product: {
        mfr_code: cartProduct.mfr_code,
        tagged_by: cartProduct.tagged_by || [],
      },
      qty,
    });
    dispatch(GuestPopUpShow(true));
  };

  return (
    <div
      style={{ backgroundColor: showWishlistModal ? "white" : "" }}
      className={`${styles["product-wrapper"]} ${getCurrentTheme()} ${widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER ? styles["product-wrapper-action-cover"] : ""} ${productWrapperSizeClass}`}
    >
      <div
        className={`${styles["product-container"]} ${  styles["product-container-all-rounded"]}`}
        style={{ cursor: enableSelect ? "pointer" : "default" }}
        onClick={() =>
          hasKioskAccess
            ? (sessionStorage.setItem("plp-scroll", String(window.scrollY)),
              sessionStorage.setItem("plp-collection", singleCollections?.path),
              router.push(`/product/${product.mfr_code}`))
            : null
        }
      >
        <ProductCardHeader
          product={product}
          collectionId={collection_id}
          size={size}
          isCustomProductsPage={isCustomProductsPage}
          storeData={storeData}
          enableSelect={enableSelect}
          setSelectValue={setSelectValue}
          isSelected={isSelected}
          isActionCoverWidget={
            widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER
          }
          isDefaultWidget={widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT}
          showWishlistModal={showWishlistModal}
          isMyTryonsCollection={isMyTryonsCollection}
          hasKioskAccess={hasKioskAccess}
          enableKioskGuestPopup={enableKioskGuestPopup}
          kioskLoginAuth={KioskLoginAuth}
          onGuestPopupOpen={onGuestPopupOpen}
          onKioskTryonClick={onKioskTryonClick}
          setOnMfrCode={setOnMfrCode}
          onVtoClick={(mfrCode) => {
            if (mfrCode) {
              dispatch(vtoIconState(mfrCode));
              return;
            }
            dispatch(GuestPopUpShow(true));
          }}
          handleProductClick={handleProductClick}
          themeCodes={themeCodes}
          productHasUrl={productHasUrl}
          buyNowTitle={buyNowTitle}
          buyNowSubTitle={buyNowSubTitle}
          enableHoverShowcase={enableHoverShowcase}
          onStarClick={onStarClick}
          hideAddToWishlist={hideAddToWishlist}
          enableCopyFeature={enableCopyFeature}
          authUserId={authUserId}
          getKioskLogin={getKioskLogin}
          handleCartGuestRequired={handleCartGuestRequired}
          source={source}
          onAddSelectedProductsToCollection={onAddSelectedProductsToCollection}
          cartSourceCollection={cartSourceCollection}
          showProductStarAction={showProductStarAction}
          enableViewSimilar={enableViewSimilar}
          showRemoveIcon={showRemoveIcon}
          showCustomProductsMenu={showCustomProductsMenu}
          setMenuIcon={setMenuIcon}
          menuIcon={menuIcon}
          menuRef={menuRef}
          onRemoveIconClick={onRemoveIconClick}
          allowEdit={allowEdit}
          onEditClick={onEditClick}
          isMyWishlistCollection={isMyWishlistCollection}
          heartRedProduct={heartRedProduct}
          kioskLogin={kioskLogin}
          isUserLogin={isUserLogin}
          showStar={showStar}
        />
        <ProductCardFooter
          product={product}
          size={size}
          storeData={storeData}
          isCustomProductsPage={isCustomProductsPage}
          authUserId={authUserId}
          authUser={authUser}
          storeId={store_id}
          hasKioskAccess={hasKioskAccess}
          showWishlistModal={showWishlistModal}
          getKioskLogin={getKioskLogin}
          enableKioskGuestPopup={enableKioskGuestPopup}
          onCartGuestRequired={handleCartGuestRequired}
          source={source}
          cartSourceCollection={cartSourceCollection}
          cartCollection={cartCollection}
          
        />
      </div>

      <VirtualTryOnModal
        isOpen={ButtonClick === product?.mfr_code}
        subText={
          Collection_tryonStatement?.tryon_statement
            ? Collection_tryonStatement?.tryon_statement
            : storeData?.defult_tryon_statement
        }
        hasKioskAccess={hasKioskAccess}
        productImage={product?.image}
        storeName={storeData?.store_name}
        imageTryonPrompt={
          storeData?.templates?.[Collection_vto?.tryon_type] ||
          storeData?.templates?.[storeData?.default_tryon_type] ||
          ""
        }
        tryonType={Collection_vto?.tryon_type || "tryon"}
        saveProduct={
          product
            ? {
                mfr_code: product?.mfr_code,
                name: product?.name,
                image: product?.image || "",
              }
            : null
        }
        eventId={storeData?.event_id || null}
        saveUserId={KioskLoginAuth?.user_id || authUser?.user_id || null}
      />
    </div>
  );
};

export default React.memo(ProductCard);
