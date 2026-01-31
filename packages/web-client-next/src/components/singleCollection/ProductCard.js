import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification, Typography, Upload } from "antd";
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
} from "@ant-design/icons";
import { LuCopy } from "react-icons/lu";
import { FiEdit, FiShoppingCart } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
const vtf_image = "/images/CamAI_2.svg";
import { FaMinus } from "react-icons/fa6";
import sharedPageTracker from "../../helper/webTracker/sharedPageTracker";
import {
  setRemoveFromFavorites,
  openWishlistModal,
  setProductsToAddInWishlist,
  closeWishlistModal,
} from "../../pageComponents/wishlist/redux/actions";
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
// import { addToWishlist } from "../../pageComponents/wishlistActions/addToWishlist/redux/actions";
import { getCurrentUserFavoriteCollection } from "../../pageComponents/Auth/redux/selector";
import { openProductModal } from "../../pageComponents/customProductModal/redux/actions";
import {
  addSidInProductUrl,
  AdminCheck,
  getCurrentTheme,
  getFinalImageUrl,
  getPercentage,
  // URLAddParam,
} from "../../helper/utils";
import appTracker from "../../helper/webTracker/appTracker";
import {
  defaultFavoriteColl,
  PRODUCT_DUMMY_URL,
  WISHLIST_TITLE,
} from "../../constants/codes";

import View_similar_icon from "../../images/view_similar_icon.svg?react";
import openInNewTabIcon from "../../images/open_in_new_tab.svg";
import Image from "next/image";

import styles from "./product.module.scss";
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
import { customProductsAPIs, profileAPIs } from "../../helper/serverAPIs";
import { PDPloader } from "../../pageComponents/storePage/redux/action";
import buyicon from "./images/buy1.svg";
const { Text } = Typography;

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
}) => {
  const navigate = useNavigate();
  console.log("hideAddToWishlist", widgetType);
  // console.log('qzssddsdsds',product);
  const [buttonClick, setButtonClick] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [descriptionget, setDescriptionget] = useState("");
  const [vtoResultImageUrl, setVtoResultImageUrl] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedMfrCode, setClickedMfrCode] = useState(null);
  const dispatch = useDispatch();
  const { themeCodes } = useTheme();
  const [menuIcon, setMenuIcon] = useState(false);
  const menuRef = useRef(null);
  console.log(menuIcon);

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
  ] = useSelector((state) => [
    state.auth.user.data.user_id,
    state.auth.user.data.user_name,
    state.chatV2.showChatModal,
    state.appState.wishlist.showWishlistModal,
    state.store.data.store_id,
    state.auth.user.data,
    state.auth.customProducts.data.data || [],
    // state.wishlist.showWishlistModal
  ]);
  console.log(showWishlistModal);

  // console.log('authUser', authUser);
  const [storeData] = useSelector((state) => [state.store.data]);
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
  // const favoriteColl =
  // 	useSelector(getCurrentUserFavoriteCollection) || defaultFavoriteColl;
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
  console.log(product);

  const handleProductClick = async () => {
    if (enableSelect) {
      setSelectValue && setSelectValue(!isSelected);
    } else {
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
        console.log(selectedSearchOption);

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

      if (isProductUrlAvailable) {
        // redirect user with a extra query param sid=userId in the opening url (requirement for tracking user details after redirection)
        const redirectionUrl = authUserId
          ? addSidInProductUrl(
              product.url,
              authUserId,
              blogCollectionPage?.collection_id,
            )
          : product.url;
        window.open(redirectionUrl, "_blank");
      } else if (
        (storeData?.pdp_settings?.is_buy_popup == false &&
          !isCustomProductsPage) ||
        pdp_page_enabled
      ) {
        navigate(`/product/${product.mfr_code}`); // new: redirect on productDetails page on product click
        if (showChatModal) {
          dispatch(setShowChatModal(false));
        }
        if (showWishlistModal) {
          dispatch(closeWishlistModal());
        }
      } else {
        handleOpenProductModal(allowEdit); // old: show update product modal on product click
      }
    }
  };

  const discountPer =
    product?.price &&
    product?.listprice &&
    +product?.listprice > +product?.price &&
    getPercentage(product.listprice, product.price);

  const addToWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // DISABLED this feature of adding item to favorites on click on add to collection
    // NEED TO REMOVE THIS FEATURE CODE FROM REDUX/ACTION/SAGA
    // NEED TO REMOVE remove from favorites handling as well

    // add product in favorites if it is not there
    // const isProductExistsInFavorites = favoriteColl.product_lists.some(
    // 	(p) => p.mfr_code === product.mfr_code
    // );

    // if (!isProductExistsInFavorites) {
    // 	// adding item to favorites (system collection)
    // 	// const user = {};
    // 	// const item = { product_id: product.mfr_code };
    // 	// if (window?.cemantika?.ecommerce)
    // 	// 	window.cemantika.ecommerce.addItemToWishlist(user, item);

    // 	// not calling it for add to favorites for now
    // 	// const event = {
    // 	// 	mfrCode: product.mfr_code,
    // 	// 	product_brand: product.product_brand,
    // 	// 	brand: product.brand,
    // 	// 	collectionId: productClickParam.collectionId,
    // 	// 	iCode: productClickParam.iCode,
    // 	// 	campCode: productClickParam.campCode,
    // 	// 	collectionName: productClickParam.collectionName,
    // 	// };
    // 	// appTracker.onAddItemToWishlist(event);

    // 	const payload = {
    // 		_id: favoriteColl._id,
    // 		user_id: authUserId,
    // 		collection_name: defaultFavoriteColl.collection_name,
    // 		type: defaultFavoriteColl.type,
    // 		products: [
    // 			{
    // 				mfr_code: product.mfr_code,
    // 				tagged_by: product.tagged_by,
    // 			},
    // 		],
    // 		fetchRecommendations: true,
    // 		fetchUserCollections: true,
    // 	};

    // 	dispatch(addToWishlist(payload));
    // 	dispatch(setRemoveFromFavorites(true));
    // } else {
    dispatch(setRemoveFromFavorites(false));
    // }

    let createWishlistData = {};

    if (wishlistGeneratedBy) {
      createWishlistData.generated_by = wishlistGeneratedBy;
    }

    dispatch(setProductsToAddInWishlist([product], createWishlistData));
    dispatch(openWishlistModal());
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

  const handleVTOclick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const url = window.location.origin;
    // setButtonClick(true);

    const payload = {
      image_urls: [product.image, uploadedImages[0]],
      store: storeData.store_name,
      image_tryon_prompt: descriptionget || "",
    };
    try {
      setLoading(true);
      const res = await axios.post(
        `https://auraprod.unthink.ai/cs/image_tryon/`,
        payload,
      );
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
    setButtonClick(false);
    setVtoResultImageUrl(null);
    setUploadedImages([]);
    setDescriptionget("");
  };
  const fetchProductDetails = async () => {
    dispatch(PDPloader(true));
    try {
      const products =
        await customProductsAPIs.fetchProductDetailsAPICall(clickedMfrCode);
      if (products && products.status === 200 && products.data) {
        let data = products.data.data[0];
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(PDPloader(false));
    }
  };
  const savedProduct = (p) => {
    return customProductsData.find((item) => item.mfr_code === p);
  };

  useEffect(() => {
    if (!clickedMfrCode) return;

    const result = savedProduct(clickedMfrCode);
    if (clickedMfrCode) {
      console.log("fdfdfdfq", product.url);

      if (product.url === "dummy_url") {
        navigate(`/product/${clickedMfrCode}`);
        fetchProductDetails();
      } else {
        window.open(product.url, "_blank");
      }
      // fetchProductDetails();
    }
  }, [clickedMfrCode]);
  return (
    <div
      className={`box-content overflow-y-hidden ${getCurrentTheme()} ${
        widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER
          ? "flex flex-col bg-slate-100 rounded-xl   shadow-m"
          : ""
      } ${size === "small" ? "w-40 lg:w-180" : "w-40 sm:w-180 lg:w-80"} h-full`}
    >
      <div
        className={`overflow-hidden relative cursor-pointer product_card_container    ${
          showChinSection ? "rounded-t-xl" : "rounded-t-xl rounded-b-xl"
        } flex flex-col h-full`}
        // onClick={handleProductClick}
        onClick={() => {
          setClickedMfrCode(product?.mfr_code);
        }}
      >
        {/* add div wrapper for show buy now on hover (exclude product header) */}
        <div
          className={`product_image_footer_container flex-shrink-0 shadow-md m-1`}
        >
          <div>
            <img
              src={getFinalImageUrl(product.image)}
              width="100%"
              className={`h-180 p-2 object-contain ${
                size === "small" ? "lg:h-180" : "lg:h-60"
              }`}
              loading="lazy"
            />
          </div>

          <div
            className="absolute flex-col top-0 h-full w-full items-center justify-center z-10 hidden buyNow_addWishlist_container"
            style={{ background: themeCodes.productCard.hover_bg }}
          >
            <>
              {!enableSelect ? (
                <h1
                  className={`m-0 ${
                    size === "small" ? "text-base" : "text-2xl"
                  } font-semibold text-white top-1/2 product_buy_now flex items-center`}
                >
                  {isProductUrlAvailable ? buyNowTitle : null}
                  {isProductUrlAvailable ? (
                    <Image
                      src={openInNewTabIcon}
                      alt="open"
                      width={20}
                      height={20}
                      className="text-white ml-2.5 w-5 h-5"
                    />
                  ) : null}
                </h1>
              ) : null}
              {product.brand && (
                <h1
                  className={`box-border text-white opacity-80 ${
                    size === "small" ? "text-sm" : "text-base"
                  } text-center px-0.75`}
                >
                  {buyNowSubTitle || `From ${product.brand}`}{" "}
                </h1>
              )}
              {(storeData?.pdp_settings?.is_buy_button ||
                storeData?.pdp_settings?.is_add_to_cart_button) && (
                <>
                  {storeData?.pdp_settings?.is_buy_button ? (
                    <button
                      className="box-border border flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container mt-3"
                      onClick={checkoutPayment}
                    >
                      Buy Now
                    </button>
                  ) : (
                    <button className="box-border border whitespace-nowrap flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container">
                      Add to Cart
                    </button>
                  )}
                </>
              )}
            </>
            {!enableSelect ? (
              <div className="absolute bottom-2">
                {enableHoverShowcase && (
                  <div className="box-border flex items-center justify-center px-2 py-1 mb-1">
                    <button
                      className={`flex items-center text-black-200 ${
                        onStarClick ? "cursor-pointer" : "cursor-default"
                      }`}
                      role={onStarClick ? "button" : "img"}
                      onClick={handleStarClick}
                    >
                      {product.starred ? (
                        <StarFilled className="flex text-xl text-secondary" />
                      ) : (
                        <StarOutlined className="flex text-xl text-white" />
                      )}
                      <span className="box-border text-base font-semibold text-white pl-2">
                        Showcase
                      </span>
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center">
                  {!hideAddToWishlist && (
                    <div
                      className="box-border border flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container"
                      onClick={addToWishlistClick}
                    >
                      <HeartOutlined className="text-white text-xl flex add_to_wishlist_icon" />
                      <span className="box-border text-base font-semibold text-white pl-2 add_to_wishlist_text">
                        Add to {WISHLIST_TITLE}
                      </span>
                    </div>
                  )}
                  {enableCopyFeature && (
                    <CopyOutlined
                      onClick={handleCopyClick}
                      className="text-white text-xl flex ml-2"
                    />
                  )}
                  {/* <Link to='/cart'> */}
                  {storeData?.pdp_settings?.is_add_to_cart_button && (
                    <p
                      className="box-border border whitespace-nowrap flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container ml-2"
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
        </div>

        {/* product card header */}
        <div
          className={`box-border absolute top-0 w-full flex ${
            enableViewSimilar ||
            (widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
              showRemoveIcon) ||
            enableSelect
              ? "flex-row-reverse"
              : ""
          } justify-between ${
            size === "small"
              ? "px-2 lg:px-2.5 h-12"
              : "px-2 lg:p-2.5 h-12 lg:h-20"
          } z-20`}
        >
          {/* reversed contents for hover css */}

          {enableSelect ? (
            <div
              className={`box-border flex items-center self-baseline product_remove_icon ${
                size === "small" ? "pl-1 pt-1" : "pl-1 pt-1 lg:pl-0 lg:pt-0"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onClick={handleSelectProduct}
                onChange={() => {}} // fix onchange handler warning
                className={size === "small" ? "lg:h-4 w-4" : "lg:h-6 w-6"}
              />
            </div>
          ) : (
            <>
              {enableViewSimilar && (
                <div
                  className="mt-0.75 lg:mt-0.5 flex items-center self-baseline view_similar_container view-similar-icon"
                  onClick={onSimilarClick}
                >
                  <View_similar_icon className="w-5 h-5 lg:w-8 lg:h-8 cursor-pointer text-xl lg:text-3xl-1 view_similar_icon" />
                  <span className="box-border text-xl font-bold pl-2 hidden transition-all view_similar_text">
                    View Similar
                  </span>
                </div>
              )}

              <BsThreeDots
                onClick={(e) => {
                  setMenuIcon(true);
                  e.stopPropagation();
                }}
                className="hover-fancy hover:shadow  mt-3 text-2xl absolute top-2 right-2 bg-gray-100 rounded-full p-1"
              />
              {menuIcon && (
                <div
                  ref={menuRef}
                  onClick={(e) => e.stopPropagation()}
                  className="menu-animate bg-white absolute top-11 right-3 shadow-md rounded-10 p-3 flex flex-col gap-3 h-fit w-36 "
                >
                  {widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                    showRemoveIcon &&  (
                      <div
                        className={`    gap-${size === "small" ? "2" : "3"}`}
                      >
                        <div
                          className={`flex gap-2 items-center self-baseline product_remove_icon`}
                          onClick={removeFromWishlistClick}
                        >
                          <p
                            className={`rounded-full flex mb-0 justify-center items-center  text-gray-101 bg-gray-100  ${
                              size === "small"
                                ? "lg:text-base h-5 w-5 p-1"
                                : "lg:text-2xl h-6 w-6 p-1"
                            }`}
                          >
                            <RxCross2 />
                          </p>
                          <p className="text-gray-101 mb-0">Remove</p>
                        </div>
                      </div>
                    )}
					 {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
                    showRemoveIcon &&  (
                      <div
                        className={`    gap-${size === "small" ? "2" : "3"}`}
                      >
                        <div
                          className={`flex gap-2 items-center self-baseline product_remove_icon`}
                          onClick={removeFromWishlistClick}
                        >
                          <p
                            className={`rounded-full flex mb-0 justify-center items-center  text-gray-101 bg-gray-100  ${
                              size === "small"
                                ? "lg:text-base h-5 w-5 p-1"
                                : "lg:text-2xl h-6 w-6 p-1"
                            }`}
                          >
                            <RxCross2 />
                          </p>
                          <p className="text-gray-101 mb-0">Remove</p>
                        </div>
                      </div>
                    )}
                  {enableCopyFeature && (
                    <div
                      className="flex gap-2 items-center"
                      onClick={handleCopyClick}
                    >
                      <div
                        className={` text-gray-101 mb-0 bg-gray-100 rounded-full  flex justify-center items-center  ${
                          size === "small"
                            ? "lg:text-base  h-5 w-5 p-1"
                            : "lg:text-2xl h-6 w-6 p-1"
                        }`}
                      >
                        <LuCopy className="  " />
                      </div>
                      <p className="text-gray-101 m-0">Copy</p>
                    </div>
                  )}
                  {(!hideAddToWishlist ||
                    (widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                      showStar)) &&
                    !showWishlistModal && (
                      <div className="flex gap-1">
                        {!hideAddToWishlist && (
                          <div
                            className="flex gap-2 items-center"
                            onClick={addToWishlistClick}
                          >
                            <button
                              className={`    h-6 w-6   rounded-full flex items-center justify-center transition z-30 `}
                              //  ${isCustomProductsPage
                              // 	? "right-1 top-20 mt-5"
                              // 	: "top-2 mt-0 right-1"}

                              style={{ background: "#f8f6f4" }}
                            >
                              <HeartOutlined className="text-lg z-40 flex add_to_wishlist_icon text-gray-101" />
                            </button>
                            <p className="text-gray-101 m-0">Wishlist</p>
                          </div>
                        )}
                      </div>
                    )}
                  {isAdminLoggedIn && isCustomProductsPage && (
                    <div
                      className="flex gap-2 items-center"
                      onClick={(e) => {
                        handleProductClick();
                        e.stopPropagation();
                      }}
                    >
                      <p
                        className={`  z-30 h-6 w-6 mb-0  flex items-center  justify-center  rounded-full `}
                        // ${showRemoveIcon
                        // 	? "lg:top-20  top-16 lg:-mt-3  mt-2 right-1"
                        // 	: "top-2 right-2"
                        // }
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: "#f8f6f4" }}
                      >
                        <FiEdit
                          style={{
                            color: "#9a9b9b",
                            backgroundColor: "#f8f6f4",
                          }}
                          className="h-4 w-4 z-30 rounded"
                        />
                      </p>
                      <p className=" text-gray-101 m-0">Edit</p>
                    </div>
                  )}

                  {!isCustomProductsPage && storeData.is_tryon_enabled && (
                    <div
                      className="flex gap-2 items-center "
                      onClick={(e) => {
                        setButtonClick(true);
                        e.stopPropagation();
                      }}
                    >
                      <img
                        className={` flex items-center justify-center   z-30  ${
                          size === "small" ? "h-6 w-6" : "h-7 w-7"
                        } ${
                          enableCopyFeature && showRemoveIcon
                            ? "lg:top-16 lg:-mt-2  mt-0 top-14  right-1 lg:right-1"
                            : "top-9 right-1 "
                        }`}
                        src={vtf_image}
                      />
                      <p className=" text-gray-101 m-0">Try On</p>
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

        {/* product footer */}
        <div
          className={`box-border w-full flex flex-col px-3 py-3 bg-white h-full   ${size === "small" ? "gap-2" : "gap-3"}`}
        >
          {/* Product Name */}
          <div className="flex flex-col gap-1 ">
            <Text
              ellipsis={{ tooltip: product.name }}
              className="m-0 text-sm font-semibold text-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap product_name"
            >
              {product.name || "\u00A0"}
            </Text>

            {/* Brand Info */}
            {product?.brand ? (
              <p className="m-0 text-xs text-gray-600">
                From <span className="font-medium">{product.brand}</span>
              </p>
            ) : null}

            {/* SOLD Badge */}
            {product?.avlble === 0 && (
              <div
                className="p-1 leading-none text-red-500 text-xs product_card_footer_item"
                style={{
                  backgroundColor: "#fff2f0",
                  border: "1px solid #ffccc7",
                  width: "fit-content",
                }}
              >
                SOLD
              </div>
            )}
          </div>

          {(storeData.pdp_settings?.buy_card_attributes?.[0] &&
            product?.size?.length > 0) ||
          (storeData.pdp_settings?.buy_card_attributes?.[1] &&
            product?.sleeve?.length > 0) ||
          (storeData.pdp_settings?.buy_card_attributes?.[2] &&
            product?.fit?.length > 0) ? (
            <div>
              {storeData.pdp_settings?.buy_card_attributes?.[0] &&
                product?.size?.length > 0 && (
                  <span
                    className="mx-1  lg:inline-block block px-1   rounded-md "
                    style={{
                      background: "#eeeeee",
                      width: "fit-content",
                      fontSize: 10,
                    }}
                  >
                    size:
                    {Array.isArray(product?.size)
                      ? product.size
                          .map((f) => f.replace(/,+$/, "").trim())
                          .join(", ")
                      : product?.size?.replace(/,+$/, "").trim()}
                  </span>
                )}
              {storeData.pdp_settings?.buy_card_attributes?.[1] &&
                product?.sleeve?.length > 0 && (
                  <span
                    className="mx-1 px-1 mt-1 lg:mt-0  lg:inline-block block  rounded-md"
                    style={{
                      background: "#eeeeee",
                      width: "fit-content",
                      fontSize: 10,
                    }}
                  >
                    sleeve :{" "}
                    {Array.isArray(product?.sleeve)
                      ? product.sleeve
                          .map((f) => f.replace(/,+$/, "").trim())
                          .join(", ")
                      : product?.sleeve?.replace(/,+$/, "").trim()}
                  </span>
                )}
              {storeData.pdp_settings?.buy_card_attributes?.[2] &&
                product?.fit?.length > 0 && (
                  <span
                    className="mx-1 px-1  mt-1 lg:mt-0  lg:inline-block block  rounded-md"
                    style={{
                      background: "#eeeeee",
                      width: "fit-content",
                      fontSize: 10,
                    }}
                  >
                    fit:{" "}
                    {Array.isArray(product?.fit)
                      ? product.fit
                          .map((f) => f.replace(/,+$/, "").trim())
                          .join(", ")
                      : product?.fit?.replace(/,+$/, "").trim()}
                  </span>
                )}
            </div>
          ) : null}

          {/* Price Section */}
          {}
          <div
            className={`flex justify-between items-center gap-2  ${product?.price || product?.listprice ? "min-h-[32px]" : ""}`}
          >
            <div className="flex gap-2 items-center ">
              <span
                className={` text-gray-900 font-bold product_price ${size === "small" ? "lg:text-sm  " : "lg:text-xl text-lg"}`}
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
                    <span className="text-sm line-through text-gray-101 product_listprice">
                      <span
                        className="text-black"
                        style={{ color: "gray" }}
                        dangerouslySetInnerHTML={{
                          __html: `${currencySymbol}${product.listprice}`,
                        }}
                      />
                    </span>
                    <span className="text-xs font-bold text-red-500 product_discount">
                      {(discountPer && `-${discountPer}%`) || null}
                    </span>
                  </>
                )}
            </div>

            {(storeData?.pdp_settings?.is_buy_button ||
              storeData?.pdp_settings?.is_add_to_cart_button) &&
              !isCustomProductsPage && (
                <>
                  {storeData?.pdp_settings?.is_buy_button ? (
                    <button
                      className="flex-1 whitespace-nowrap text-white font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center text-sm z-10 transition-colors product_buy_button disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={checkoutPayment}
                    //   style={{ background: "#7c75ec" }}
                      disabled={!product?.price && !product?.listprice}
                    >
                      <Image src={buyicon} height={30} width={30} />
                    </button>
                  ) : (
                    <button
                      className={` text-white font-semibold   rounded-lg flex items-center justify-center text-sm z-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${!product?.price && !product?.listprice ? "hidden" : "block"}`}
                      onClick={handleAddToCart}
                      disabled={!product?.price && !product?.listprice}
                    >
                      <FiShoppingCart
                        className={`text-black-100  cursor-pointer  ${showWishlistModal || size === "small" ? "h-5 w-5" : "lg:h-6 lg:w-6 h-5 w-5"}    `}
                      />
                    </button>
                  )}
                </>
              )}
          </div>

          {/* Action Buttons */}
          {!enableSelect && (
            <div className="flex gap-1 lg:gap-2 items-center justify-between">
              <div>
                {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
                showStar ? (
                  <button
                    className={` absolute top-3 left-2  rounded-lg p-2 flex items-center justify-center z-20 transition border-gray-300 cursor-pointer ${
                      onStarClick ? "cursor-pointer" : "cursor-default"
                    }`}
                    tabindex="-1"
                    role={onStarClick ? "button" : "img"}
                    onClick={handleStarClick}
                  >
                    {product.starred ? (
                      <StarFilled className="flex text-secondary" />
                    ) : (
                      <StarOutlined className="flex text-black-200" />
                    )}
                    <span className="box-border leading-none font-bold pl-2 hidden transition-all showcase-btn-text">
                      Showcase
                    </span>
                  </button>
                ) : null}
                {widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                  showStar && (
                    <button
                      onClick={handleStarClick}
                      role={onStarClick ? "button" : "img"}
                      className={`border rounded-lg absolute top-3 left-2 flex items-center justify-center z-20 border-none transition ${product.starred ? "" : "border-gray-300"} ${onStarClick ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {product.starred ? (
                        <StarFilled className="text-lg text-yellow-500" />
                      ) : (
                        <StarOutlined className="text-lg text-gray-600" />
                      )}
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {buttonClick ? (
        <Modal
          isOpen={buttonClick}
          headerText={"Virtual Try-On"}
          subText="Upload a photo of yourself .Make sure and expose your face,hands,sholders etc depending on what you want to try on."
          onClose={() => handleVTOCancel()}
          size="md"
        >
          {vtoResultImageUrl ? (
            <div className="flex flex-col items-center justify-center">
              <img
                src={vtoResultImageUrl}
                alt="VTO Result"
                className="max-h-96 rounded-xl mb-5"
              />
              <div className="flex gap-3 justify-end w-full">
                <button
                  onClick={handleVTOCancel}
                  className="rounded-xl text-indigo-600 font-bold text-xs md:text-sm py-2 px-4.5 border border-indigo-600 transition-colors hover:bg-indigo-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVTODownload}
                  className="rounded-xl text-white font-bold text-xs md:text-sm py-2 px-4.5 bg-indigo-600 transition-colors hover:bg-indigo-700"
                >
                  Download
                </button>
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <LoadingOutlined className="text-5xl text-indigo-600 animate-spin" />
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-semibold text-gray-800">
                      AI is generating your image
                    </p>
                    <p className="text-sm text-gray-500">
                      Please wait while we process your request...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVTOclick}>
                  <div className="flex flex-col items-center justify-center relative">
                    {showLoader ? (
                      <LoadingOutlined className="text-2xl text-gray-600 mb-2" />
                    ) : (
                      <>
                        {uploadedImages.length < 1 && (
                          // <Dragger
                          // 	className='bg-transparent h-20 w-20 border border-dashed border-gray-400 rounded-xl hover:border-brown-100 transition-all'
                          // 	{...uploadImageDraggerProps}
                          // 	name='upload_image'>
                          // 	<p className='text-gray-600'>+</p>
                          // </Dragger>

                          <div className="flex flex-col items-center justify-center">
                            <h4 className="text-xl font-semibold text-start mb-3">
                              Upload Your Image{" "}
                            </h4>
                            <Upload.Dragger
                              className="bg-transparent h-56 w-56"
                              {...uploadImageDraggerProps}
                              name="upload_image"
                              showUploadList={false}
                            >
                              <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                              </p>
                              <p className="w-4/6 mx-auto">
                                Click or drag file(s) to this area
                              </p>
                            </Upload.Dragger>
                          </div>
                        )}
                      </>
                    )}
                    {uploadedImages.length > 0 && (
                      <div className="relative ">
                        <img
                          src={uploadedImages[0]}
                          alt="Uploaded"
                          className="mt-2 max-h-40"
                        />
                        <CloseCircleOutlined
                          className="text-white text-xl absolute right-0 top-2"
                          onClick={() => setUploadedImages([])}
                        />
                      </div>
                    )}
                  </div>
                  <h4 className="mt-5 "> Add a prompt for AI (optional) </h4>
                  <textarea
                    className="text-left placeholder-gray-101 mt-2 outline-none rounded-xl w-full px-3 py-2 resize-none"
                    placeholder="Enter description..."
                    name="description"
                    type="text"
                    onChange={(e) => setDescriptionget(e.target.value)}
                    value={descriptionget}
                    // value={product.description}
                    // onChange={(e) => handleProductInputChange(e, product.mfr_code)}
                    rows={5}
                  />

                  <div className="flex justify-end">
                    <button></button>
                    <button
                      type="submit"
                      className={`rounded-xl mt-5 text-indigo-100 font-bold text-xs md:text-sm py-2 px-4.5 flex justify-end  ${loading ? "bg-indigo-400" : "bg-indigo-600"}    mb-2`}
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
        <div className="box-border bg-white rounded-b-xl flex gap-2 p-1 justify-end">
          <StarOutlined
            height="fit-content"
            onClick={handleStarClick}
            role={onStarClick ? "button" : "img"}
            className={`flex my-auto z-20 ${
              size === "small" ? "lg:text-sm" : "lg:text-xl"
            } ${product.starred ? "text-secondary" : "text-black-200"} ${
              onStarClick ? "cursor-pointer" : "cursor-default"
            }`}
          />
          {enableCopyFeature && (
            <div
              className="flex items-center self-baseline text-black-200 my-auto cursor-pointer"
              onClick={handleCopyClick}
            >
              <CopyOutlined className="text-base flex" />
            </div>
          )}
          <div
            className="flex items-center self-baseline product_remove_icon   text-black-200 my-auto"
            onClick={removeFromWishlistClick}
          >
            <CloseCircleOutlined className="text-base flex  " />
          </div>
        </div>
      )}
      {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
        (showEdit || showStar || showRemoveIcon) && (
          <div
            className={`flex gap-2  justify-between items-center product-card-action-container ${
              size === "small" ? "lg:text-base" : "lg:text-xl"
            }`}
          >
            <div>
              {showRemoveIcon ? (
                <button
                  className="flex text-black-200 product-remove-btn absolute top-4 right-2 z-50"
                  tabindex="-1"
                  onClick={(e) => removeFromWishlistClick(e)}
                >
                  <CloseCircleOutlined className="flex z-50" />
                  <span className="box-border leading-none font-bold pl-2 hidden transition-all remove-btn-text">
                    Remove
                  </span>
                </button>
              ) : null}
            </div>
            <div>
              {showEdit ? (
                <button
                  className="flex text-black-200 product-showcase-btn cursor-pointer  "
                  tabindex="-1"
                  role="button"
                  onClick={handleEditClick}
                >
                  <EditFilled className="flex text-black-200" />
                  <span className="box-border leading-none font-bold pl-2 hidden transition-all showcase-btn-text">
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
