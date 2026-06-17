import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification, Typography, Upload } from "antd";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "./ProductCard.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  HeartOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  StarFilled,
  StarOutlined,
  EditFilled,
  CopyTwoTone,
  CopyrightCircleFilled,
  CopyFilled,
  UploadOutlined,
  LoadingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { LuCopy } from "react-icons/lu";
import { FiEdit, FiShoppingCart } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { FaMinus, FaRegBookmark } from "react-icons/fa6";
import sharedPageTracker from "../../helper/webTracker/sharedPageTracker";
import {
  setRemoveFromFavorites,
  openWishlistModal,
  setProductsToAddInWishlist,
  closeWishlistModal,
} from "../../pageComponents/wishlist/redux/actions";
import { GuestPopUpShow } from "../../pageComponents/Auth/redux/actions";
import { RxCross2 } from "react-icons/rx";
import { fetchSimilarProducts } from "../../pageComponents/similarProducts/redux/actions";
import {
  adminUserId,
  current_store_id,
  current_store_name,
  enable_view_similar_products,
  payment_url,
  pdp_page_enabled,
} from "../../constants/config";
import { openProductDetailsCopyModal } from "../../pageComponents/productDetailsCopyModal/redux/actions";
import { addToWishlist } from "../../pageComponents/wishlistActions/addToWishlist/redux/actions";
import { getCurrentUserFavoriteCollection } from "../../pageComponents/Auth/redux/selector";
import { openProductModal } from "../../pageComponents/customProductModal/redux/actions";
import {
  addSidInProductUrl,
  AdminCheck,
  cleanImage,
  collectionQRCodeGenerator,
  getCurrentTheme,
  getFinalImageUrl,
  getPercentage,
  // URLAddParam,
} from "../../helper/utils";
import {
  buildVerifyUrl,
  decryptSigninToken,
  requestSigninWithLink,
} from "../../helper/autoLogin";
import appTracker from "../../helper/webTracker/appTracker";
import {
  defaultFavoriteColl,
  PRODUCT_DUMMY_URL,
  WISHLIST_TITLE,
} from "../../constants/codes";
import camera from "./images/Card/camera.svg";
import heart from "./images/Card/heart.svg";
import more from "./images/Card/more.svg";
import shopping from "./images/Card/shopping-bag3.svg";

import openInNewTabIcon from "../../images/open_in_new_tab.svg";

import Link from "next/link";
import { useNavigate } from "../../helper/useNavigate";
import { setShowChatModal } from "../../hooks/chat/redux/actions";
import useTheme from "../../hooks/chat/useTheme";
import {
  gTagAuraProductClick,
  gTagCollectionProductClick,
} from "../../helper/webTracker/gtag";
import { getTTid } from "../../helper/getTrackerInfo";
import { addToCart } from "../../pageComponents/DeliveryDetails/redux/action";
import axios from "axios";
import Modal from "../modal/Modal";
import {
  customProductsAPIs,
  profileAPIs,
  TryOnVto,
  collectionPageAPIs,
} from "../../helper/serverAPIs";
import { PDPloader } from "../../pageComponents/storePage/redux/action";
import buyicon from "./images/buy1.svg";
import { vtoIconState } from "./redux/actions";
import { fetchProductDetails } from "./ProductRedux/actions";
import { useKioskAccess } from "../kiosk/components/LoggedInInfo";
import GuestUserPopUp from "../../pageComponents/Auth/GuestUserPopUp";
const { Text } = Typography;

export const PRODUCT_CARD_WIDGET_TYPES = {
  DEFAULT: "default",
  ACTION_COVER: "actionCover",
};

const PRODUCT_BUY_BUTTON_CLASS =
  "box-border flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-px py-[5px] text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:!bg-[var(--color-secondary)] md:px-1.5 md:py-3 md:text-base";

const PRODUCT_BUY_BUTTON_SMALL_CLASS =
  "box-border flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-[5px] py-2 text-xs font-semibold text-white transition-all duration-300 ease-in-out hover:bg-[var(--color-secondary)]";
const KIOSKCLASS =
  "group box-border flex cursor-pointer items-center justify-center gap-2 rounded-xl px-px py-[5px] text-sm bg-gradient-to-r from-kiosk-primary to-kiosk-secondary text-black hover:from-hover-primary hover:to-hover-primary hover:text-white font-medium";
const KIOSK_CART_ICON_CLASS =
  "h-4 w-4 md:h-5 md:w-5 filter brightness-0 group-hover:invert";
const getProductBuyButtonClass = (size, hasKioskAccess) =>
  size === "small"
    ? PRODUCT_BUY_BUTTON_SMALL_CLASS
    : hasKioskAccess
      ? KIOSKCLASS
      : PRODUCT_BUY_BUTTON_CLASS;
const getStaticImageSrc = (image) => image?.src || image;
const getWishlistCollectionId = (response) =>
  response?.data?.data?._id ||
  response?.data?.data?.collection_id ||
  response?.data?.data?.data?._id ||
  response?.data?.data?.data?.collection_id ||
  response?.data?._id ||
  response?.data?.collection_id ||
  response?._id ||
  response?.collection_id;

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
  hideBuyNow = false,
  showRemoveIcon = false,
  enableCopyFeature = true,
  size = "medium", // small, medium
  height = "h-340", // need to send tailwind class for height,
  wishlist,
  onRemoveIconClick,
  buyNowTitle = "Buy Now",
  buyNowSubTitle,
  enableSelect,
  isSelected,
  setSelectValue,
  showEdit = false,
  showStar = false,
  showChinSection = false, // REMOVE
  widgetType = PRODUCT_CARD_WIDGET_TYPES.DEFAULT, // default | actionCover
  onEditClick,
  onStarClick,
  openProductDetails = true,
  allowEdit = false,
  wishlistGeneratedBy,
  collection_name,
  collection_path,
  collection_status,
  localChatMessage,
  blogCollectionPage,
  collectionCards,
  onAddSelectedProductsToCollection,
  isSingleCollectionSharedPage,
  auramodel,
  bannerImage,
  enableKioskGuestPopup = false,
  onGuestPopupOpen,

}) => {
  const navigate = useNavigate();
  // console.log("hideAddToWishlist", hideAddToWishlist);
  // console.log('qzssddsdsds',product);
  const [showLoader, setShowLoader] = useState(false);
  const [descriptionget, setDescriptionget] = useState("");
  const [vtoResultImageUrl, setVtoResultImageUrl] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedMfrCode, setClickedMfrCode] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [qrTargetUrl, setQrTargetUrl] = useState("");
  const dispatch = useDispatch();
  const { themeCodes } = useTheme();
  const [menuIcon, setMenuIcon] = useState(false);
  const [pendingWishlistAction, setPendingWishlistAction] = useState(false);
  const isGuestPopUpShow = useSelector(
    (state) => state.GuestPopUpReducer.isGuestPopUpShow,
  );
  const menuRef = useRef(null);
  // console.log('collectionCards',product);

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
    customProductsData,
    ButtonClick,
    isUserLogin,
    collections,
    singleCollections,
  ] = useSelector((state) => [
    state.auth.user.data.user_id,
    state.auth.user.data.user_name,
    state.chatV2.showChatModal,
    state.appState.wishlist.showWishlistModal,
    state.store.data.store_id,
    state.auth.user.data,
    state.auth.customProducts.data.data || [],
    state.VtoIconReducer.ButtonClick,
    state?.auth?.user?.isUserLogin,
    state.auth.user.collections.data,
    state.auth.user.singleCollections.data,
  ]);

  // console.log('collectionsSSW', ButtonClick);
  const [storeData] = useSelector((state) => [state.store.data]);
  const [Collection_tryonStatement, setCollectionTryonStatement] =
    useState(null);
  // console.log('Collection_tryonStatement',Collection_tryonStatement);
  const getKioskLogin = useCallback(() => {
    if (typeof window === "undefined") return null;

    try {
      return JSON.parse(window.sessionStorage.getItem("Kiosk-login") || "null");
    } catch (error) {
      return null;
    }
  }, []);
  const hasKioskAccess = useKioskAccess({
    isUserLogin,
    storeData,
    authUser,
  });
  const { admin_list: admin_list } = storeData;
  // pdp_settings
  const isAdminLoggedIn = AdminCheck(
    authUser,
    current_store_name,
    adminUserId,
    admin_list,
  );
  const mycartcollectionpath = `my_cart_${authUserId || getTTid()}`;

  // console.log('storeData',storeData.pdp_settings.is_add_to_cart_button);
  const favoriteColl =
    useSelector(getCurrentUserFavoriteCollection) || defaultFavoriteColl;
  const [count, setCount] = useState(1);
  // console.log("counttttt",count);

  const enableViewSimilar = useMemo(() => {
    return enable_view_similar_products === "false" ? false : !hideViewSimilar;
  }, [enable_view_similar_products, hideViewSimilar]);

  const isProductUrlAvailable =
    product.url && product.url !== PRODUCT_DUMMY_URL;

  const currencySymbol = useMemo(
    () => (product?.currency_symbol ? product.currency_symbol : "&#36;"),
    [product?.currency_symbol],
  );

  const handleOpenProductModal = useCallback(
    (allowEdit) => {
      dispatch(
        openProductModal({
          payload: product,
          collectionId: collection_id,
          allowEdit,
        }),
      );
    },
    [product, collection_id, allowEdit],
  );
  // console.log(product);



  const handleProductClick = async () => {
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

      // console.log(blogCollectionPage);

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
      // END
    }


    navigate(`/product/${product.mfr_code}`); // new: redirect on productDetails page on product click
    if (showChatModal) {
      dispatch(setShowChatModal(false));
    }
    if (showWishlistModal) {
      dispatch(closeWishlistModal());
    }
  };

  const discountPer =
    product?.price &&
    product?.listprice &&
    +product?.listprice > +product?.price &&
    getPercentage(product.listprice, product.price);

  const callHandpickedAPI = async (userId) => {
    const payload = {
      collection_type: "my_wishlist_collection",
      status: "published",
      collection_name: "my wishlist",
      user_id: userId,
      store: storeData?.store_name || "dothelook",
      Event_id: "dothelookwebpage_447990",
      product_lists: [
        {
          mfr_code: product.mfr_code,
          name: product.name,
          image: product.image,
        },
      ],
    };

    try {
      const response =
        await collectionPageAPIs.createWishlistHandpickedAPICall(payload);
      notification.success({ message: "Added to wishlist!" });
      return response;
    } catch (err) {
      notification.error({ message: "Failed to add to wishlist" });
      return null;
    }
  };

  const openWishlistQr = useCallback(
    async ({ kioskLogin, wishlistResponse }) => {
      const kioskEmail = kioskLogin?.email || kioskLogin?.emailId;
      const collectionId = getWishlistCollectionId(wishlistResponse);

      if (!kioskEmail || !collectionId) return;

      try {
        const resp = await requestSigninWithLink(kioskEmail);
        const signinToken = resp?.signin_token || resp?.data?.signin_token;
        const userName =
          resp?.data?.user_name ||
          resp?.user_name ||
          kioskLogin?.user_name ||
          authUserName;

        if (!signinToken || !userName) return;

        const decrypted = decryptSigninToken(signinToken);
        if (!decrypted) return;

        const verifyLink = buildVerifyUrl(
          decrypted,
          `?page=influencer/${userName}/${collectionId}`,
        );
        const fullVerifyUrl = `${window.location.origin}${verifyLink}`;

        setQrTargetUrl(fullVerifyUrl);
        setQrImageUrl(collectionQRCodeGenerator(fullVerifyUrl));
        setQrModalOpen(true);
      } catch (error) {
        console.error("Wishlist QR build failed", error);
      }
    },
    [authUserName],
  );

  // useEffect(() => {
  //   if (pendingWishlistAction && isUserLogin) {
  //     callHandpickedAPI(authUserId || getTTid());
  //     setPendingWishlistAction(false);
  //   }
  // }, [isUserLogin, pendingWishlistAction, authUserId]);

  useEffect(() => {
    if (!pendingWishlistAction || isGuestPopUpShow) return;

    const kioskLogin = getKioskLogin();
    if (!kioskLogin?.user_id) {
      setPendingWishlistAction(false);
      return;
    }

    let cancelled = false;
    setPendingWishlistAction(false);

    const addPendingWishlistAndOpenQr = async () => {
      const wishlistResponse = await callHandpickedAPI(kioskLogin.user_id);
      if (!cancelled) {
        openWishlistQr({ kioskLogin, wishlistResponse });
      }
    };

    addPendingWishlistAndOpenQr();

    return () => {
      cancelled = true;
    };
  }, [
    getKioskLogin,
    isGuestPopUpShow,
    openWishlistQr,
    pendingWishlistAction,
  ]);

  const addToWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const kioskLogin = getKioskLogin();

    if ((hasKioskAccess || enableKioskGuestPopup) && !kioskLogin) {
      setPendingWishlistAction(true);
      onGuestPopupOpen?.();
      dispatch(GuestPopUpShow(true));
      return;
    }

    const wishlistResponse = await callHandpickedAPI(
      kioskLogin?.user_id || authUserId || getTTid(),
    );

    if (kioskLogin?.user_id) {
      openWishlistQr({ kioskLogin, wishlistResponse });
    }
  };

  const checkoutPayment = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const location = window.location.origin;

    const payload = {
      amount: product?.price || product?.listprice || 0, // MANDATORY
      currency: "USD", // MANDATORY
      thumbnail: product.image,
      user_id: authUserId || getTTid(),
      store_id: store_id,
      service_id: `Product_${product.mfr_code}`,
      emailId: authUser.emailId || null,
      successUrl: `${location}/successpayment`,
      failureUrl: `${location}/failedpayment`,
      additional_details: {
        mfr_code: product.mfr_code,
      },
      title: product.name,
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
      // console.log("Checkout response:", res.data.redirectUrl);
      // 🔁 If API returns payment URL
      if (res?.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // alert("Payment initiation failed. Please try again.");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!product?.mfr_code) return;

    const payload = {
      products: [
        {
          mfr_code: product.mfr_code,
          tagged_by: product.tagged_by || [],
          qty: Number(count),
        },
      ],
      product_lists: [],
      collection_name: "my cart",
      type: "system",
      user_id: authUserId || getTTid(),
      // collection_id: mycartcollectionid,
      path: mycartcollectionpath,
    };
    dispatch(addToCart(payload));
  };

  const onSimilarClick = (event) => {
    event.stopPropagation();
    dispatch(
      fetchSimilarProducts({
        mfr_code: product.mfr_code,
        name: product.name,
        errorMessage: "Unable to fetch similar products",
      }),
    );
  };

  const removeFromWishlistClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (onRemoveIconClick) {
      onRemoveIconClick(product.mfr_code);
    }
  };

  const handleSelectProduct = (e) => {
    e.stopPropagation();
    setSelectValue && setSelectValue(!isSelected);
  };

  const handleCopyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    product && dispatch(openProductDetailsCopyModal(product));
  };

  const handleEditClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (onEditClick) {
        onEditClick();
      } else {
        handleOpenProductModal(true);
      }
    },
    [onEditClick, handleOpenProductModal],
  );

  const handleStarClick = useCallback(
    (e) => {
      e.stopPropagation();
      onStarClick && onStarClick();
    },
    [onStarClick],
  );
  const handleUploadImage = async ({ file }) => {
    try {
      setShowLoader(true);

      const response = await profileAPIs.uploadImage({ file });
      const data = response?.data;

      if (data?.status_code === 400 || data?.status === "failure") {
        notification.error({
          message: "Image Upload Failed",
          description:
            data?.status_desc || "Something went wrong. Please try again.",
        });
        return;
      }
      const url = data?.data?.[0]?.url;
      setUploadedImages((prev) => prev.concat(url));
      if (url) {
        // setUploadedImages((prev) => [...prev, url]);
        // additional_images.push(url)
        notification.success({
          message: "Image Uploaded Successfully",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      notification.error({
        message: "Image Upload Failed",
        description:
          error?.response?.data?.message || "Unexpected error occurred",
      });
    } finally {
      setShowLoader(false);
    }
  };

  const uploadImageDraggerProps = {
    accept: "image/*",
    multiple: true,
    showUploadList: false,
    customRequest: ({ file, onSuccess }) => {
      handleUploadImage({ file });
      setTimeout(() => onSuccess("ok"), 0);
    },
  };
  useEffect(() => {
    const currentCollection =
      singleCollections?._id === collection_id
        ? singleCollections
        : collections?.find((item) => item._id === collection_id);

    setCollectionTryonStatement(
      currentCollection?.tryon_statement ? currentCollection : null,
    );
  }, [singleCollections, collections, collection_id]);

  const currentVtoCollection =
    singleCollections?._id === collection_id
      ? singleCollections
      : collections?.find((item) => item._id === collection_id);

  const Collection_vto = currentVtoCollection?.tryon_type
    ? currentVtoCollection
    : null;
  // console.log('Collection_vto',Collection_vto );

  // const image_try = `Using the provided images: product image and person image/person body part or person image, create a photorealistic composite showing the product applied to or held or wore by the person as described below. Positioning and scale: Understand the image of product and also how it will look if used/wore/held by person and understand physics, place or make it like person has wore the product naturally on the appropriate body part or held or wore. Size and perspective should match the body part so the product appears physically plausible and proportional. If there are multiple products, choose only one whichever you like or whichever looks prominent (only one).  few product are not meant to be wore, in that time make sure person is holding naturally Lighting and color match: match the product's color, highlights, reflections, and shadow direction to the person photo. Preserve soft shadows where the product meets skin or clothing. Integration details: ensure natural contact and occlusion - adjust fabric folds, subtle skin indentation, and cast shadows to imply weight and contact. Preserve identity: do not alter the person's face, skin tone, or any identifiable features. Keep hair, tattoos, scars, and jewelry unchanged unless explicitly asked. Preserve product look: do not alter the product look. Camera and realism: produce a high-resolution, photorealistic image consistent with the person photo camera angle. Use photographic terms: camera/lens suggestion e.g., '50mm, shallow depth of field' if you want a particular look. Negative instructions: Do not add any new people or faces. Do not change the person's identity, skin tone, or facial features. Do not show the product floating or misaligned. Do not use body part which is found along with product, ignore it. Do not put product in inappropriate place.`;
  const handleVTOclick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const url = window.location.origin;
    // setButtonClick(true);

    const payload = {
      image_urls: [product.image, uploadedImages[0]],
      store: storeData.store_name,
      image_tryon_prompt:
        storeData?.templates?.[Collection_vto?.tryon_type] ||
        storeData?.templates?.[storeData?.default_tryon_type] ||  // default tyeon type
        "",
      additional_prompt: descriptionget || "",
      type: Collection_vto?.tryon_type || "tryon",
    };
    try {
      setLoading(true);
      const res = await TryOnVto(payload);
      setVtoResultImageUrl(res.data.data.image_url);
      setLoading(false);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Virtual Try-On Failed",
        description:
          error?.response?.data?.message ||
          "Failed to process image. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleVTODownload = async () => {
    if (vtoResultImageUrl) {
      try {
        const response = await fetch(vtoResultImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `vto-result-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        notification.success({
          message: "Download Successful",
          description: "Your virtual try-on image has been downloaded.",
        });
        handleVTOCancel();
      } catch (error) {
        console.error("Download failed:", error);
        notification.error({
          message: "Download Failed",
          description: "Failed to download the image. Please try again.",
        });
      }
    }
  };

  const handleVTOCancel = () => {
    dispatch(vtoIconState(false));
    setVtoResultImageUrl(null);
    setUploadedImages([]);
    setDescriptionget("");
  };
  // const fetchProductDetails = async () => {
  //   dispatch(PDPloader(true));
  //   console.log(product?.image);

  //   try {
  //     const products =
  //       await customProductsAPIs.fetchProductDetailsAPICall(clickedMfrCode,product?.image);

  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     dispatch(PDPloader(false));
  //   }
  // };

  const savedProduct = (p) => {
    return customProductsData.find((item) => item.mfr_code === p);
  };

  useEffect(() => {
    if (!clickedMfrCode) return;

    const result = savedProduct(clickedMfrCode);
    if (clickedMfrCode) {
      const cleaned = cleanImage(product?.image);
      if (cleaned) {
        localStorage.setItem(`pdp_image_${clickedMfrCode}`, cleaned);
      }
      // saveProductDetailsReturnPath();
      if (bannerImage) {
        navigate(`/product/${clickedMfrCode}?from=kioskcollection`);
      } else {
        navigate(`/product/${clickedMfrCode}`);
      }
      // fetchProductDetails();
      setClickedMfrCode(null);
    }
  }, [clickedMfrCode]);
  // console.log(widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER);
  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const productCardAttributes = useMemo(() => {
    const attributes = storeData?.pdp_settings?.product_page_attributes || [];
    console.log('attributes',attributes);
    
    const normalizeKey = (value) =>
      String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");

    const getAttributeConfig = (attribute) => {
      if (typeof attribute === "string") {
        return {
          key: attribute,
          label: attribute.replace(/_/g, " ").trim(),
        };
      }

      if (!attribute || typeof attribute !== "object") return null;

      const key =
        attribute.key ||
        attribute.value ||
        attribute.name ||
        attribute.field ||
        attribute.attribute ||
        attribute.attribute_name;

      if (!key) return null;

      return {
        key,
        label:
          attribute.label ||
          attribute.title ||
          attribute.display_name ||
          String(key).replace(/_/g, " ").trim(),
      };
    };

    const getProductValue = (attributeKey) => {
      if (!product || !attributeKey) return undefined;
      if (Object.prototype.hasOwnProperty.call(product, attributeKey)) {
        return product[attributeKey];
      }

      const normalizedAttributeKey = normalizeKey(attributeKey);
      const productKey = Object.keys(product).find(
        (key) => normalizeKey(key) === normalizedAttributeKey,
      );

      return productKey ? product[productKey] : undefined;
    };

    const formatValue = (value) => {
      if (Array.isArray(value)) {
        return value
          .map((item) => String(item ?? "").replace(/,+$/, "").trim())
          .filter(Boolean)
          .join(", ");
      }

      return String(value ?? "").replace(/,+$/, "").trim();
    };

    return attributes
      .map(getAttributeConfig)
      .filter(Boolean)
      .map((attribute) => ({
        ...attribute,
        value: formatValue(getProductValue(attribute.key)),
      }))
      .filter((attribute) => attribute.value.length > 0);
  }, [product, storeData?.pdp_settings?.product_card_attributes]);

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
  // const useloginPopup =(e)=>{
  //   e.preventDefault()
  //   e.stopPropagation()
  //    if (hideAddToWishlist ) {
  //     console.log('hwllo ');

  //         // setIsPopupShow(true);
  //         dispatch(GuestPopUpShow(true));
  //         return;
  //       }
  //     console.log('hwllo');
  // }
  //  const onAddSelectedProductsToCollection =(e)=>{
  //   e?.preventDefault()
  //   e?.stopPropagation()
  //    if (hideAddToWishlist ) {
  //     console.log('hwllo ');

  //         // setIsPopupShow(true);
  //         dispatch(GuestPopUpShow(true));
  //         return;
  //       }
  //     console.log('hwllo');
  // }
  // const {
  //   handleGuestSubmit,
  //   errors,
  //   handleGuestSkip,
  //   guestChange,
  //   guestData,
  //   setIsPopupShow
  // } = useGuestPopUtils(dispatch, hideAddToWishlist, onAddSelectedProductsToCollection);
  // console.log('isAuraModelPage',isAuraModelPage);

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

  return (
    <div
      style={{ backgroundColor: showWishlistModal ? "white" : "" }}
      className={`${styles["product-wrapper"]} ${getCurrentTheme()} ${widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER ? styles["product-wrapper-action-cover"] : ""} ${productWrapperSizeClass}`}
    >
      <div
        className={`${styles["product-container"]} ${showChinSection ? styles["product-container-top-rounded"] : styles["product-container-all-rounded"]}`}
        style={{ cursor: enableSelect ? "pointer" : "default" }}
        onClick={handleProductClick}
      >
        {/* add div wrapper for show buy now on hover (exclude product header) */}
        <div
          className={`${size === "small" ? styles["product-image-container-small"] : styles["product-image-container"]}`}
          onClick={(e) => {
            if (setSelectValue) {
              e.stopPropagation();
              setSelectValue(!isSelected);
            }
          }}
        >
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
              widgetType !== PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
              !showWishlistModal &&  product?.custom_product !== false &&(
                <div
                  className={`${size === "small" ? styles["product-vto-item-small"] : styles["product-vto-item"]}`}
                  onClick={(e) => {
                    dispatch(vtoIconState(product?.mfr_code || true));
                    e.stopPropagation();
                  }}
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
              widgetType !== PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
              !showWishlistModal && (
                <div
                  className={`${size === "small" ? styles["product-view-btn-small"] : styles["product-view-btn"]}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setClickedMfrCode(product?.mfr_code);
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
            <>
              {!enableSelect ? (
                <h1
                  className={`${styles["product-buy-now"]} ${size === "small" ? styles["product-buy-now-small"] : styles["product-buy-now-medium"]} product_buy_now ${styles["product-action-buttons-container"]}`}
                >
                  {isProductUrlAvailable ? buyNowTitle : null}
                  {isProductUrlAvailable ? (
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
              {product.brand && (
                <h1
                  className={`${styles["product-brand-text"]} ${size === "small" ? "" : styles["product-brand-text-base"]}`}
                >
                  {buyNowSubTitle || `From ${product.brand}`}{" "}
                </h1>
              )}
              {(storeData?.pdp_settings?.is_buy_button ||
                storeData?.pdp_settings?.is_add_to_cart_button) && (
                <>
                  {storeData?.pdp_settings?.is_buy_button ? (
                    <button
                      className={getProductBuyButtonClass(size, hasKioskAccess)}
                      onClick={checkoutPayment}
                    >
                      Buy Now
                    </button>
                  ) : (
                    <button
                      className={styles["product-add-cart-button-header"]}
                    >
                      Add to Cart
                    </button>
                  )}
                </>
              )}
            </>
            {!enableSelect ? (
              <div className={styles["product-overlay-actions"]}>
                {enableHoverShowcase && (
                  <div className={styles["product-action-group"]}>
                    <button
                      className={styles["product-star-button"]}
                      role={onStarClick ? "button" : "img"}
                      onClick={handleStarClick}
                    >
                      {product.starred ? (
                        <StarFilled
                          className={styles["product-star-icon-filled"]}
                        />
                      ) : (
                        <StarOutlined className={styles["product-star-icon"]} />
                      )}
                      <span className={styles["product-action-label"]}>
                        Showcase
                      </span>
                    </button>
                  </div>
                )}
                <div className={styles["product-button-group"]}>
                  {!hideAddToWishlist && (
                    <div
                      className={styles["product-wishlist-button"]}
                      onClick={addToWishlistClick}
                    >
                      <HeartOutlined
                        className={styles["product-wishlist-icon"]}
                      />
                      <span className={styles["product-wishlist-label"]}>
                        Add to {WISHLIST_TITLE}
                      </span>
                    </div>
                  )}
                  {enableCopyFeature && (
                    <CopyOutlined
                      onClick={handleCopyClick}
                      className={styles["product-copy-icon"]}
                    />
                  )}
                  {/* <Link to='/cart'> */}
                  {storeData?.pdp_settings?.is_add_to_cart_button && (
                    <p
                      className={styles["product-add-cart-button"]}
                      style={{ zIndex: 10000 }}
                      onClick={(e) => handleAddToCart(e)}
                    >
                      Add to Cart
                    </p>
                  )}
                  {/* </Link> */}
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          {!enableSelect && (
            <div className={styles["product-showcase-button-main"]}>
              <div>
                {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
                showStar ? (
                  <button
                    className={`${styles["product-star-action-button"]}`}
                    tabindex="-1"
                    role={onStarClick ? "button" : "img"}
                    onClick={handleStarClick}
                  >
                    {product.starred ? (
                      <StarFilled className={styles["icon-filled"]} />
                    ) : (
                      <StarOutlined className={styles["icon-outlined"]} />
                    )}
                    <span
                      className={`${styles["showcase-text"]} showcase-btn-text`}
                    >
                      Showcase
                    </span>
                  </button>
                ) : null}
                {widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                showStar ? (
                  <button
                    className={`${styles["product-star-action-button"]}`}
                    tabindex="-1"
                    role={onStarClick ? "button" : "img"}
                    onClick={handleStarClick}
                  >
                    {product.starred ? (
                      <StarFilled className={styles["icon-filled"]} />
                    ) : (
                      <StarOutlined className={styles["icon-outlined"]} />
                    )}
                    <span
                      className={`${styles["showcase-text"]} showcase-btn-text`}
                    >
                      Showcase
                    </span>
                  </button>
                ) : null}
                {/* {widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT && showStar && (
										<button
											onClick={handleStarClick}
											role={onStarClick ? "button" : "img"}
											className={`${styles['product-star-default-button']} ${product.starred ? "" : "border-gray-300"} ${onStarClick ? "cursor-pointer" : "cursor-default"}`}>
											{product.starred ? (

												<StarFilled className='text-lg text-yellow-500' />
											) : (
												<StarOutlined className='text-lg text-gray-600' />
											)}
							
										</button>
									)} */}
              </div>
            </div>
          )}
        </div>
        {/* {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER && !enableSelect &&
          showRemoveIcon && (
            <div
              className={`   gap-${size === "small" ? "2" : "3"
                }`}>
              <div
                className={`${styles['remove-icon-wrapper']} flex product_remove_icon`}
                onClick={removeFromWishlistClick}>
                <p style={{color:'#f8f6f4'}}
                  className={`${styles['remove-icon-circle']} ${size === "small"
                    ? styles['icon-circle-small']
                    : styles['icon-circle-medium']
                    }`}>
                  <RxCross2 style={{color:'#f8f6f4'}}/>
                </p>

              </div>
            </div>
          )} */}
        {/* product card header */}
        <div
          className={`${styles["header-container"]} ${
            enableViewSimilar ||
            (widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
              showRemoveIcon) ||
            enableSelect
              ? styles["flex-reverse"]
              : ""
          } ${
            size === "small" ? styles["header-small"] : styles["header-medium"]
          }`}
        >
          {/* reversed contents for hover css */}

          {enableSelect ? (
            <div
              className={`${styles["product-remove-icon-container"]} ${size === "small" ? styles["product-remove-icon-container-small"] : ""}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onClick={handleSelectProduct}
                onChange={() => {}} // fix onchange handler warning
                className={`${styles[size === "small" ? "product-checkbox-small" : "product-checkbox-large"]}`}
              />
            </div>
          ) : (
            <>
              {enableViewSimilar && (
                <div
                  className={styles["product-view-similar"]}
                  onClick={onSimilarClick}
                >
                  <img
                    src="/images/view_similar_icon.svg"
                    alt="view similar"
                    width={24}
                    height={24}
                    className={styles["product-view-similar-icon"]}
                  />
                  <span className={styles["product-view-similar-text"]}>
                    View Similar
                  </span>
                </div>
              )}
              {/* {widgetType !== PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
                !showWishlistModal && (
                  <Image
                    src={more}
                    alt="More options"
                    height={20}
                    width={20}
                    onClick={(e) => {
                      setMenuIcon(true);
                      e.stopPropagation();
                    }}
                    className={
                      styles[
                        size === "small"
                          ? "product-menu-dropdown-small"
                          : (!hideAddToWishlist ||
                                (widgetType ===
                                  PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                                  showStar)) &&
                              !showWishlistModal
                            ? "product-menu-icon"
                            : "product-menu-icon"
                      ]
                    }
                  />
                )} */}
              {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER && (
                <div
                  className={` ${styles["remove-icon"]}`}
                  onClick={removeFromWishlistClick}
                >
                  <p
                    className={`${styles["remove-icon-circle"]} ${
                      size === "small"
                        ? styles["icon-circle-small"]
                        : styles["icon-circle-medium"]
                    }`}
                  >
                    <RxCross2 />
                  </p>
                  {/* <p className={styles['text-gray']}>Remove</p> */}
                </div>
              )}
              {showWishlistModal &&
                widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT && (
                  <div
                    className={` ${styles["remove-icon"]}`}
                    onClick={removeFromWishlistClick}
                  >
                    <p
                      className={`${styles["remove-icon-circle"]} ${
                        size === "small"
                          ? styles["icon-circle-small"]
                          : "hidden"
                      }`}
                    >
                      <RxCross2 />
                    </p>
                  </div>
                )}
              {menuIcon && (
                <div
                  ref={menuRef}
                  onClick={(e) => e.stopPropagation()}
                  className={
                    styles[
                      size === "small"
                        ? "product-menu-dropdown-mini"
                        : (!hideAddToWishlist ||
                              (widgetType ===
                                PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                                showStar)) &&
                            !showWishlistModal
                          ? "product-menu-dropdown"
                          : "product-menu-dropdown" ///use dropdown2
                    ]
                  }
                >
                  {widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                    showRemoveIcon && (
                      <div
                        className={`    gap-${size === "small" ? "2" : "3"}`}
                      >
                        <div
                          className={`${styles["remove-icon-wrapper"]} ${styles["product-menu-item"]}`}
                          onClick={removeFromWishlistClick}
                        >
                          <p
                            className={`${styles["remove-icon-circle"]} ${
                              size === "small"
                                ? styles["icon-circle-small"]
                                : styles["icon-circle-medium"]
                            }`}
                          >
                            <RxCross2 />
                          </p>
                          <p className={styles["text-gray"]}>Remove</p>
                        </div>
                      </div>
                    )}
                  {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
                    showRemoveIcon && (
                      <div
                        className={`    gap-${size === "small" ? "2" : "3"}`}
                      >
                        <div
                          className={`${styles["remove-icon-wrapper"]} ${styles["product-menu-item"]}`}
                          onClick={removeFromWishlistClick}
                        >
                          <p
                            className={`${styles["remove-icon-circle"]} ${
                              size === "small"
                                ? styles["icon-circle-small"]
                                : styles["icon-circle-medium"]
                            }`}
                          >
                            <RxCross2 />
                          </p>
                          <p className={styles["text-gray"]}>Remove</p>
                        </div>
                      </div>
                    )}
                  {enableCopyFeature && (
                    <div
                      className={styles["product-menu-item"]}
                      onClick={handleCopyClick}
                    >
                      <div
                        className={`${styles["menu-item-circle"]} ${
                          size === "small"
                            ? styles["icon-circle-small"]
                            : styles["icon-circle-medium"]
                        }`}
                      >
                        <LuCopy className={styles.copyIcon} />
                      </div>
                      <p className={styles["text-gray"]}>Copy</p>
                    </div>
                  )}
                  {isAdminLoggedIn && isCustomProductsPage && (
                    <div
                      className={styles["product-menu-item"]}
                      onClick={(e) => {
                        handleProductClick();
                        e.stopPropagation();
                      }}
                    >
                      <p
                        className={`${styles["product-cart-button"]} ${styles["product-cart-icon2"]} ${size === "small" ? styles["product-cart-icon-small"] : styles["product-cart-icon-lg"]}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: "#f8f6f4" }}
                      >
                        <FiEdit
                          style={{
                            color: "#9a9b9b",
                            backgroundColor: "#f8f6f4",
                          }}
                          className={styles["product-cart-icon-smalls"]}
                        />
                      </p>
                      <p className={styles["text-gray"]}>Edit</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div
            // ${enableViewSimilar && "w-3/4"} // removed class name
            className={`product-name overflow-hidden product_details_container`}
          >
            {/* <div className='flex'>
							<Text
								ellipsis={{ tooltip: product.name }}
								className={`m-0 text-sm ${size === "small" ? "lg:text-sm" : "lg:text-xl"
									} overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2`}>
								{product.name}
							</Text>
						</div> */}
            {/* REMOVE */}
            {/* <h1 className='m-0 text-xs lg:text-sm overflow-hidden overflow-ellipsis whitespace-nowrap capitalize product_attribute'>
							{(product.color?.length &&
								(typeof product.color === "string"
									? product.color
									: product.color[0])) ||
								null}
						</h1> */}
          </div>
        </div>

        {(!hideAddToWishlist ||
          (widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT && showStar)) &&
          !showWishlistModal &&
          !enableSelect && (
            <div className={styles["product-menu-item"]}>
              {!hideAddToWishlist && (
                <div
                  className={styles["product-menu-wishlist"]}
                  onClick={addToWishlistClick}
                >
                  <button className={`${styles["product-heart-button"]}`}>
                    <img
                      alt="Add to wishlist"
                      className={styles["add_to_wishlist_icon"]}
                      src={getStaticImageSrc(heart)}
                      height={20}
                      width={20}
                    />
                  </button>
                </div>
              )}
            </div>
          )}

        {/* without login  */}

        {hideAddToWishlist &&
          !isUserLogin &&
          size === "medium" &&
          !showWishlistModal &&
          !enableSelect && (
            <div className={styles["product-menu-item"]}>
              {/* {!hideAddToWishlist && ( */}
              <div
                className={styles["product-menu-wishlist"]}
                onClick={(e) => onAddSelectedProductsToCollection(e, product)}
              >
                <button className={`${styles["product-heart-button"]}`}>
                  <img
                    alt="Add to collection"
                    className={styles["add_to_wishlist_icon"]}
                    src={getStaticImageSrc(heart)}
                    height={20}
                    width={20}
                  />
                </button>
              </div>
              {/* )} */}
            </div>
          )}
        {/* { isGuestPopUpShow && (
              <GuestPopUp
                handleGuestSubmit={handleGuestSubmit}
                errors={errors}
                handleGuestSkip={handleGuestSkip}
                guestChange={guestChange}
                guestData={guestData}
                setIsPopupShow={setIsPopupShow}
              />
            )} */}

        {/* product footer */}
        <div
          className={`${styles["product-footer-main"]} ${size === "small" ? styles["product-footer-main-small"] : styles["product-footer-main-medium"]}`}
        >
          {/* Product Name */}
          <div className={styles["product-name-section"]}>
            {/* Brand Info */}
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

            {/* SOLD Badge */}
            {product?.avlble === 0 && (
              <div className={styles["product-sold-badge"]}>SOLD</div>
            )}
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
                  <SwiperSlide
                    key={attribute.key}
                    style={{ width: "auto" }}
                  >
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

          {/* Price Section */}
          <div
            className={`${styles["product-price-container"]} ${product?.price || product?.listprice ? styles["product-price-container-height"] : styles["product-price-container-height"]}`}
          >
            <div className={styles["product-price-display"]}>
              <span
                className={`${styles["product-price-text"]} ${size === "small" ? styles["product-price-text-small"] : styles["product-price-text-medium"]}`}
              >
                {product?.price || product?.listprice ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${currencySymbol}${product.price || product.listprice}`,
                    }}
                  />
                ) : null}
              </span>

              {product?.price > 0 &&
                product?.listprice > product?.price &&
                discountPer > 0 && (
                  <>
                    <span className={styles["product-listprice-text"]}>
                      <span
                        className={styles["product-listprice-value"]}
                        dangerouslySetInnerHTML={{
                          __html: `${currencySymbol}${product.listprice}`,
                        }}
                      />
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
                  <button
                    style={{
                      background:
                        !product?.price && !product?.listprice
                          ? "#F2F1FD"
                          : "#9690F0",
                      cursor:
                        !product?.price && !product?.listprice
                          ? "not-allowed"
                          : "pointer",
                      color:
                        !product?.price && !product?.listprice ? "#616161" : "",
                    }}
                    className={getProductBuyButtonClass(size, hasKioskAccess)}
                    onClick={checkoutPayment}
                    disabled={!product?.price && !product?.listprice}
                  >
                    <img
                      style={{
                        filter:
                          !product?.price && !product?.listprice
                            ? "brightness(0) saturate(100%) invert(38%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(95%)"
                            : "",
                      }}
                      src={getStaticImageSrc(shopping)}
                      alt="Buy now"
                      height={20}
                      width={20}
                      className={
                        showWishlistModal || size === "small"
                          ? styles["product-cart-icon-small"]
                          : hasKioskAccess
                            ? KIOSK_CART_ICON_CLASS
                            : "h-4 w-4 md:h-5 md:w-5"
                      }
                    />
                    Buy Now
                  </button>
                ) : (
                  <button
                    className={`${getProductBuyButtonClass(size, hasKioskAccess)} ${!product?.price && !product?.listprice ? "hidden" : ""}`}
                    onClick={handleAddToCart}
                    disabled={!product?.price && !product?.listprice}
                  >
                    <img
                      src={getStaticImageSrc(shopping)}
                      alt="Add to cart"
                      height={20}
                      width={20}
                      className={
                        showWishlistModal || size === "small"
                          ? styles["product-cart-icon-small"]
                          : hasKioskAccess
                            ? KIOSK_CART_ICON_CLASS
                            : "h-4 w-4 md:h-5 md:w-5"
                      }
                    />
                    Add to Cart
                  </button>
                )}
              </>
            )}
        </div>
      </div>

      <Modal
        headerText="Scan to open wishlist"
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4">
          {qrImageUrl ? (
            <img
              src={qrImageUrl}
              alt="Wishlist QR code"
              className="h-48 w-48 object-contain"
            />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center bg-gray-100 text-sm text-gray-500">
              QR
            </div>
          )}
          {qrTargetUrl ? (
            <a
              href={qrTargetUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-center text-sm text-indigo-600 hover:underline"
            >
              {qrTargetUrl}
            </a>
          ) : null}
        </div>
      </Modal>

      {ButtonClick === product?.mfr_code ? (
        <Modal
          isOpen={!!ButtonClick}
          headerText={"Virtual Try-On"}
          subText={
            Collection_tryonStatement?.tryon_statement
              ? Collection_tryonStatement?.tryon_statement
              : storeData?.defult_tryon_statement
          }
          onClose={() => handleVTOCancel()}
          size="md"
        >
          {vtoResultImageUrl ? (
            <div className={styles["product-vto-result-container"]}>
              <img
                src={vtoResultImageUrl}
                alt="VTO Result"
                className={styles["product-vto-result-image"]}
              />
              <div className={styles["product-vto-buttons-group"]}>
                <button
                  onClick={handleVTOCancel}
                  className={styles["product-vto-cancel-button"]}
                >
                  Cancel
                </button>
                <button
                  onClick={handleVTODownload}
                  className={styles["product-vto-submit-button"]}
                >
                  Download
                </button>
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className={styles["product-vto-loading-container"]}>
                  <LoadingOutlined
                    className={styles["product-vto-loading-spinner"]}
                  />
                  <div className={styles["product-vto-loading-text"]}>
                    <p className={styles["product-vto-loading-title"]}>
                      AI is generating your image
                    </p>
                    <p className={styles["product-vto-loading-subtitle"]}>
                      Please wait while we process your request...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVTOclick}>
                  <div className={styles["product-vto-upload-container"]}>
                    {showLoader ? (
                      <LoadingOutlined
                        className={styles["product-vto-loading-spinner"]}
                      />
                    ) : (
                      <>
                        {uploadedImages.length < 1 && (
                          <div
                            className={styles["product-vto-upload-container"]}
                          >
                            <h4 className={styles["product-vto-upload-title"]}>
                              Upload Your Image{" "}
                            </h4>
                            <Upload.Dragger
                              className={styles["product-vto-upload-zone"]}
                              {...uploadImageDraggerProps}
                              name="upload_image"
                              showUploadList={false}
                            >
                              <p className={styles["product-vto-upload-icon"]}>
                                <UploadOutlined />
                              </p>
                              <p className={styles["product-vto-upload-text"]}>
                                Click or drag file(s) to this area
                              </p>
                            </Upload.Dragger>
                          </div>
                        )}
                      </>
                    )}
                    {uploadedImages.length > 0 && (
                      <div
                        className={
                          styles["product-vto-uploaded-image-container"]
                        }
                      >
                        <img
                          src={uploadedImages[0]}
                          alt="Uploaded"
                          className={styles["product-vto-uploaded-image"]}
                        />
                        <CloseCircleOutlined
                          className={styles["product-vto-close-uploaded"]}
                          onClick={() => setUploadedImages([])}
                        />
                      </div>
                    )}
                  </div>
                  <h4 className={styles["product-vto-prompt-label"]}>
                    {" "}
                    Add a prompt for AI (optional){" "}
                  </h4>
                  <textarea
                    className={styles["product-vto-prompt-input"]}
                    placeholder="Enter description..."
                    name="description"
                    type="text"
                    onChange={(e) => setDescriptionget(e.target.value)}
                    value={descriptionget}
                    rows={5}
                  />

                  <div className={styles["product-vto-submit-container"]}>
                    <button></button>
                    <button
                      type="submit"
                      className={`${styles["product-vto-submit-form-button"]} ${loading ? styles["product-vto-submit-form-button-loading"] : styles["product-vto-submit-form-button-active"]}`}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </Modal>
      ) : null}

      {/* // REMOVE // remove chin section integration and flag // not required */}
      {showChinSection && (
        <div className={styles["product-chin-section"]}>
          <StarOutlined
            height="fit-content"
            onClick={handleStarClick}
            role={onStarClick ? "button" : "img"}
            className={`${styles["product-chin-star-icon"]} ${size === "small" ? styles["product-chin-star-icon-small"] : styles["product-chin-star-icon-medium"]} ${product.starred ? styles["product-chin-star-icon-filled"] : styles["product-chin-star-icon-default"]} ${onStarClick ? styles["product-chin-star-icon-clickable"] : styles["product-chin-star-icon-not-clickable"]}`}
          />
          {enableCopyFeature && (
            <div
              className={styles["product-chin-copy-button"]}
              onClick={handleCopyClick}
            >
              <CopyOutlined className={styles["product-chin-copy-icon"]} />
            </div>
          )}
          <div
            className={styles["product-chin-remove-button"]}
            onClick={removeFromWishlistClick}
          >
            <CloseCircleOutlined
              className={styles["product-chin-remove-icon"]}
            />
          </div>
        </div>
      )}
      {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
        (showEdit || showStar || showRemoveIcon) && (
          <div
            className={`${styles["product-action-cover-container"]} ${size === "small" ? styles["product-action-cover-container-small"] : styles["product-action-cover-container-medium"]}`}
          >
            {/* <div>
              {showRemoveIcon ? (
                <button
                  className={styles['product-action-cover-remove-button']}
                  onClick={(e) => removeFromWishlistClick(e)}>
                  <RxCross2 className={`${styles['product-action-cover-remove-icon']} ${size === "small" ? styles['product-action-cover-remove-icon-small'] : styles['product-action-cover-remove-icon-medium']}`} />
                  <span className={styles['product-action-cover-remove-text']}>
                    Remove
                  </span>
                </button>
              ) : null}
            </div> */}
            <div>
              {showEdit ? (
                <button
                  className={styles["product-action-cover-edit-button"]}
                  tabindex="-1"
                  role="button"
                  onClick={handleEditClick}
                >
                  <EditFilled
                    className={styles["product-action-cover-edit-icon"]}
                  />
                  <span className={styles["product-action-cover-edit-text"]}>
                    Edit
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductCard;
