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
// const vtf_image = "/images/vtoIcon.svg";
import vtf_image from './images/vtoIcon.svg'
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
import camera from './images/Card/camera.svg'
import heart from './images/Card/heart.svg'
import more from './images/Card/more.svg'
import shopping from './images/Card/shopping-bag3.svg'

import View_similar_icon from "../../images/view_similar_icon.svg?react";
import openInNewTabIcon from "../../images/open_in_new_tab.svg";
import Image from "next/image";

import Link from 'next/link';
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
const image_try = `Using the provided images: product image and person image/person body part or person image, create a photorealistic composite showing the product applied to or held or wore by the person as described below. Positioning and scale: Understand the image of product and also how it will look if used/wore/held by person and understand physics, place or make it like person has wore the product naturally on the appropriate body part or held or wore. Size and perspective should match the body part so the product appears physically plausible and proportional. If there are multiple products, choose only one whichever you like or whichever looks prominent (only one).  few product are not meant to be wore, in that time make sure person is holding naturally Lighting and color match: match the product's color, highlights, reflections, and shadow direction to the person photo. Preserve soft shadows where the product meets skin or clothing. Integration details: ensure natural contact and occlusion - adjust fabric folds, subtle skin indentation, and cast shadows to imply weight and contact. Preserve identity: do not alter the person's face, skin tone, or any identifiable features. Keep hair, tattoos, scars, and jewelry unchanged unless explicitly asked. Preserve product look: do not alter the product look. Camera and realism: produce a high-resolution, photorealistic image consistent with the person photo camera angle. Use photographic terms: camera/lens suggestion e.g., '50mm, shallow depth of field' if you want a particular look. Negative instructions: Do not add any new people or faces. Do not change the person's identity, skin tone, or facial features. Do not show the product floating or misaligned. Do not use body part which is found along with product, ignore it. Do not put product in inappropriate place.`
  const handleVTOclick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const url = window.location.origin;
    // setButtonClick(true);

    const payload = {
      image_urls: [product.image, uploadedImages[0]],
      store: storeData.store_name,
      image_tryon_prompt:image_try  || "",
additional_prompt:descriptionget || '',
      type: "tryon",
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
      console.log('fdfdfdfq', product.url);

      if (product.url === "dummy_url") {

        navigate(`/product/${clickedMfrCode}`);
        fetchProductDetails();
      }
      else {
        window.open(product.url, '_blank')
      }
      // fetchProductDetails();

    }
  }, [clickedMfrCode]);
  return (
    <div style={{ backgroundColor: showWishlistModal ? 'white' : '' }}
      className={`${styles['product-wrapper']} ${getCurrentTheme()} ${widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER ? styles['product-wrapper-action-cover'] : ''} ${size === "small" ? styles['product-wrapper-small'] : styles['product-wrapper-medium']}`}>
      <div
        className={`${styles['product-container']} ${showChinSection ? styles['product-container-top-rounded'] : styles['product-container-all-rounded']}`}
        // onClick={handleProductClick}
        onClick={() => {
          if (enableSelect) {
            handleProductClick();

          } else {
            setClickedMfrCode(product?.mfr_code);
          }
        }}
      >
        {/* add div wrapper for show buy now on hover (exclude product header) */}
        <div
          className={`${size === "small" ? styles['product-image-container-small'] : styles['product-image-container']}`}
        >
          <div style={{ width: '100%' }}>
            <img
              src={getFinalImageUrl(product.image)}
              width='100%'
              className={`${styles['product-image']} ${size === "small" ? styles['product-image-small'] : styles['product-image-medium']}`}
              loading='lazy'
            />
            {!isCustomProductsPage && storeData.is_tryon_enabled && !enableSelect && widgetType !== PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
              <div className={`${size === "small" ? styles['product-vto-item-small'] : styles['product-vto-item']}`} onClick={(e) => {
                setButtonClick(true);
                e.stopPropagation();
              }}>
                <Image height={20} width={20}
                  className={`${styles['product-vto-icon']}`}
                  src={camera}
                />
                <p>Try On</p>
              </div>
            }
          </div>

          <div
            className={styles['product-overlay']}
            style={{ background: themeCodes.productCard.hover_bg }}>
            <>
              {!enableSelect ? (
                <h1
                  className={`${styles['product-buy-now']} ${size === "small" ? styles['product-buy-now-small'] : styles['product-buy-now-medium']} product_buy_now ${styles['product-action-buttons-container']}`}>
                  {isProductUrlAvailable ? buyNowTitle : null}
                  {isProductUrlAvailable ? (
                    <Image src={openInNewTabIcon} alt="open" width={20} height={20} className={styles['product-buy-now-icon']} />
                  ) : null}
                </h1>
              ) : null}
              {product.brand && (
                <h1
                  className={`${styles['product-brand-text']} ${size === "small" ? "" : styles['product-brand-text-base']}`}>
                  {buyNowSubTitle || `From ${product.brand}`} </h1>
              )}
              {(storeData?.pdp_settings?.is_buy_button ||
                storeData?.pdp_settings?.is_add_to_cart_button) && (
                  <>
                    {storeData?.pdp_settings?.is_buy_button ? (
                      <button
                        className={` ${size === "small" ? styles['product-buy-button-small'] : styles['product-buy-button']}`}
                        onClick={checkoutPayment}
                      >
                        Buy Now
                      </button>
                    ) : (
                      <button
                        className={styles['product-add-cart-button-header']}
                      >
                        Add to Cart
                      </button>
                    )}
                  </>
                )}

            </>
            {!enableSelect ? (
              <div className={styles['product-overlay-actions']}>
                {enableHoverShowcase && (
                  <div className={styles['product-action-group']}>
                    <button
                      className={styles['product-star-button']}
                      role={onStarClick ? "button" : "img"}
                      onClick={handleStarClick}>
                      {product.starred ? (
                        <StarFilled className={styles['product-star-icon-filled']} />
                      ) : (
                        <StarOutlined className={styles['product-star-icon']} />
                      )}
                      <span className={styles['product-action-label']}>
                        Showcase
                      </span>
                    </button>
                  </div>
                )}
                <div className={styles['product-button-group']}>
                  {!hideAddToWishlist && (
                    <div
                      className={styles['product-wishlist-button']}
                      onClick={addToWishlistClick}>
                      <HeartOutlined className={styles['product-wishlist-icon']} />
                      <span className={styles['product-wishlist-label']}>
                        Add to {WISHLIST_TITLE}
                      </span>
                    </div>
                  )}
                  {enableCopyFeature && (
                    <CopyOutlined
                      onClick={handleCopyClick}
                      className={styles['product-copy-icon']}
                    />
                  )}
                  {/* <Link to='/cart'> */}
                  {storeData?.pdp_settings?.is_add_to_cart_button &&
                    <p
                      className={styles['product-add-cart-button']}
                      style={{ zIndex: 10000 }}
                      onClick={(e) => handleAddToCart(e)}>
                      Add to Cart
                    </p>}
                  {/* </Link> */}
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          {!enableSelect && (
            <div className={styles['product-showcase-button-main']}>
              <div>
                {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER && showStar ? (
                  <button
                    className={`${styles['product-star-action-button']}`}
                    tabindex='-1'
                    role={onStarClick ? "button" : "img"}
                    onClick={handleStarClick}>
                    {product.starred ? (
                      <StarFilled className={styles['icon-filled']} />
                    ) : (
                      <StarOutlined className={styles['icon-outlined']} />
                    )}
                    <span className={`${styles['showcase-text']} showcase-btn-text`}>
                      Showcase
                    </span>
                  </button>
                ) : null}
                {widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT && showStar ? (
                  <button
                    className={`${styles['product-star-action-button']}`}
                    tabindex='-1'
                    role={onStarClick ? "button" : "img"}
                    onClick={handleStarClick}>
                    {product.starred ? (
                      <StarFilled className={styles['icon-filled']} />
                    ) : (
                      <StarOutlined className={styles['icon-outlined']} />
                    )}
                    <span className={`${styles['showcase-text']} showcase-btn-text`}>
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
        {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER && !enableSelect &&
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
          )}
        {/* product card header */}
        <div
          className={`${styles['header-container']} ${enableViewSimilar ||
            (widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
              showRemoveIcon) ||
            enableSelect
            ? styles['flex-reverse']
            : ""
            } ${size === "small"
              ? styles['header-small']
              : styles['header-medium']
            }`}
        >
          {/* reversed contents for hover css */}

          {enableSelect ? (
            <div
              className={`${styles['product-remove-icon-container']} ${size === "small" ? styles['product-remove-icon-container-small'] : ''}`}>
              <input
                type='checkbox'
                checked={isSelected}
                onClick={handleSelectProduct}
                onChange={() => { }} // fix onchange handler warning
                className={`${styles[size === "small" ? 'product-checkbox-small' : 'product-checkbox-large']}`}
              />
            </div>
          ) : (
            <>
              {enableViewSimilar && (
                <div
                  className={styles['product-view-similar']}
                  onClick={onSimilarClick}>
                  <View_similar_icon className={styles['product-view-similar-icon']} />
                  <span className={styles['product-view-similar-text']}>
                    View Similar
                  </span>
                </div>
              )}
              {
                widgetType !== PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
                <Image src={more} height={20} width={20} onClick={(e) => { setMenuIcon(true); e.stopPropagation() }} className={styles[size === "small" ? 'product-menu-dropdown-small' : 'product-menu-icon']} />
              }

              {menuIcon &&
                <div ref={menuRef} onClick={(e) => e.stopPropagation()} className={styles[size === "small" ? 'product-menu-dropdown-mini' : 'product-menu-dropdown']}>

                  {widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
                    showRemoveIcon && (
                      <div
                        className={`    gap-${size === "small" ? "2" : "3"
                          }`}>
                        <div
                          className={`${styles['remove-icon-wrapper']} ${styles['product-menu-item']}`}
                          onClick={removeFromWishlistClick}>
                          <p
                            className={`${styles['remove-icon-circle']} ${size === "small"
                              ? styles['icon-circle-small']
                              : styles['icon-circle-medium']
                              }`}>
                            <RxCross2 />
                          </p>
                          <p className={styles['text-gray']}>Remove</p>
                        </div>
                      </div>
                    )}
                  {enableCopyFeature && (
                    <div className={styles['product-menu-item']} onClick={handleCopyClick} >

                      <div
                        className={`${styles['menu-item-circle']} ${size === "small"
                          ? styles['icon-circle-small']
                          : styles['icon-circle-medium']
                          }`}
                      >
                        <LuCopy />

                      </div>
                      <p className={styles['text-gray']}>Copy</p>
                    </div>
                  )}

                  {isAdminLoggedIn && isCustomProductsPage && (
                    <div className={styles['product-menu-item']} onClick={(e) => {
                      handleProductClick();
                      e.stopPropagation();
                    }}>
                      <p
                        className={`${styles['product-cart-button']} ${styles['product-cart-icon2']} ${size === "small" ? styles['product-cart-icon-small'] : styles['product-cart-icon-lg']}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: "#f8f6f4" }}>
                        <FiEdit
                          style={{ color: "#9a9b9b", backgroundColor: "#f8f6f4" }}

                          className={styles['product-cart-icon-smalls']}
                        />
                      </p>
                      <p className={styles['text-gray']}>Edit</p>
                    </div>

                  )}




                </div>}
            </>
          )}

          <div
            // ${enableViewSimilar && "w-3/4"} // removed class name
            className={`product-name overflow-hidden product_details_container`}>
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


        {(!hideAddToWishlist || widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT && showStar) && !showWishlistModal && !enableSelect &&
          <div className={styles['product-menu-item']}>
            {!hideAddToWishlist && (
              <div className={styles['product-menu-wishlist']} onClick={addToWishlistClick} >

                <button
                  className={`${styles['product-heart-button']}`}
                >
                  <Image className={styles['add_to_wishlist_icon']} src={heart} height={20} width={20} />
                </button>
              </div>
            )}
          </div>
        }



        {/* product footer */}
        <div className={`${styles['product-footer-main']} ${size === "small" ? styles['product-footer-main-small'] : styles['product-footer-main-medium']}`}>
          {/* Product Name */}
          <div className={styles['product-name-section']}>
            {/* Brand Info */}
            <p className={styles['product-brand-footer-text']}>From <span>{product?.brand || '\u00A0'}</span></p>

            <Text
              ellipsis={{ tooltip: product.name }}
              className={styles['product-name-text']}>
              {product.name || '\u00A0'}
            </Text>



            {/* SOLD Badge */}
            {product?.avlble === 0 && (
              <div
                className={styles['product-sold-badge']}
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
            <div
              className={`${styles.tagscontainer}`}
            >

              {storeData.pdp_settings?.buy_card_attributes?.[0] &&
                product?.size?.length > 0 && (
                  <span
                    className={`${styles.smalltags}`}
                    style={{
                      background: "#F5F5F5",
                      width: "fit-content",

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
                    className={`${styles.smalltags}`}
                    style={{
                      background: "#F5F5F5",
                      width: "fit-content",
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
                    className={`${styles.smalltags}`}
                    style={{
                      background: "#eeeeee",
                      width: "fit-content",
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
          ) :
            <div className={`${styles.tagscontainer}`}> &nbsp;</div>
          }

          {/* Price Section */}
          <div className={`${styles['product-price-container']} ${product?.price || product?.listprice ? styles['product-price-container-height'] : styles['product-price-container-height']}`}>
            <div className={styles['product-price-display']} >

              <span className={`${styles['product-price-text']} ${size === "small" ? styles['product-price-text-small'] : styles['product-price-text-medium']}`}>
                {product?.price || product?.listprice ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${currencySymbol}${product.price || product.listprice}`,
                    }}
                  />
                ) : (
                  null
                )}
              </span>

              {product?.price > 0 &&
                product?.listprice > product?.price &&
                discountPer > 0 && (
                  <>
                    <span className={styles['product-listprice-text']}>
                      <span className={styles['product-listprice-value']}
                        dangerouslySetInnerHTML={{
                          __html: `${currencySymbol}${product.listprice}`,
                        }}
                      />
                    </span>
                    <span className={styles['product-discount-badge-text']}>
                      {(discountPer && `-${discountPer}%`) || null}
                    </span>
                  </>
                )}
            </div>




          </div>
          {(storeData?.pdp_settings?.is_buy_button || storeData?.pdp_settings?.is_add_to_cart_button) && !isCustomProductsPage && (
            <>
              {storeData?.pdp_settings?.is_buy_button ? (
                <button
                  style={{ background: !product?.price && !product?.listprice ? '#F2F1FD' : '#9690F0', color: !product?.price && !product?.listprice ? '#616161' : '' }}
                  className={`${size === "small" ? styles['product-buy-button-small'] : styles['product-buy-button']}`}
                  onClick={checkoutPayment}
                  disabled={!product?.price && !product?.listprice}
                >
                  <Image
                    style={{ filter: !product?.price && !product?.listprice ? 'brightness(0) saturate(100%) invert(38%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(95%)' : '' }}
                    src={shopping} height={20} width={20} className={`${styles[showWishlistModal || size === 'small' ? 'product-cart-icon-small' : 'product-cart-icon-large']}`} />
                  Buy Now
                </button>
              ) : (
                <button
                  className={`${size === "small" ? styles['product-buy-button-small'] : styles['product-buy-button']} ${!product?.price && !product?.listprice ? styles['hidden'] : styles['block']}`}
                  onClick={handleAddToCart}
                  disabled={!product?.price && !product?.listprice}
                >
                  <Image src={shopping} height={20} width={20} className={`${styles[showWishlistModal || size === 'small' ? 'product-cart-icon-small' : 'product-cart-icon-large']}`} />
                  Add to Cart
                </button>
              )}
            </>
          )}


        </div>

      </div>

      {buttonClick ?

        <Modal isOpen={buttonClick}
          headerText={'Virtual Try-On'}
          subText='Upload a photo of yourself .Make sure and expose your face,hands,sholders etc depending on what you want to try on.'
          onClose={() => handleVTOCancel()}
          size='md'>
          {vtoResultImageUrl ? (
            <div className={styles['product-vto-result-container']}>
              <img src={vtoResultImageUrl} alt="VTO Result" className={styles['product-vto-result-image']} />
              <div className={styles['product-vto-buttons-group']}>
                <button
                  onClick={handleVTOCancel}
                  className={styles['product-vto-cancel-button']}>
                  Cancel
                </button>
                <button
                  onClick={handleVTODownload}
                  className={styles['product-vto-submit-button']}>
                  Download
                </button>
              </div>
            </div>
          ) : (
            <>
              {loading ?
                <div className={styles['product-vto-loading-container']}>
                  <LoadingOutlined className={styles['product-vto-loading-spinner']} />
                  <div className={styles['product-vto-loading-text']}>
                    <p className={styles['product-vto-loading-title']}>AI is generating your image</p>
                    <p className={styles['product-vto-loading-subtitle']}>Please wait while we process your request...</p>
                  </div>
                </div> :
                <form onSubmit={handleVTOclick}>
                  <div className={styles['product-vto-upload-container']} >
                    {showLoader ? <LoadingOutlined className={styles['product-vto-loading-spinner']} /> :
                      <>
                        {uploadedImages.length < 1 && (
                          <div className={styles['product-vto-upload-container']}>
                            <h4 className={styles['product-vto-upload-title']}>Upload Your Image </h4>
                            <Upload.Dragger
                              className={styles['product-vto-upload-zone']}
                              {...uploadImageDraggerProps}
                              name='upload_image'
                              showUploadList={false}>
                              <p className={styles['product-vto-upload-icon']}>
                                <UploadOutlined />
                              </p>
                              <p className={styles['product-vto-upload-text']}>
                                Click or drag file(s) to this area
                              </p>
                            </Upload.Dragger>
                          </div>
                        )}
                      </>
                    }
                    {uploadedImages.length > 0 &&
                      <div className={styles['product-vto-uploaded-image-container']}>
                        <img src={uploadedImages[0]} alt="Uploaded" className={styles['product-vto-uploaded-image']} />
                        <CloseCircleOutlined className={styles['product-vto-close-uploaded']} onClick={() => setUploadedImages([])} />
                      </div>
                    }
                  </div>
                  <h4 className={styles['product-vto-prompt-label']}> Add a prompt for AI (optional) </h4>
                  <textarea
                    className={styles['product-vto-prompt-input']}
                    placeholder='Enter description...'
                    name='description'
                    type='text'
                    onChange={(e) => setDescriptionget(e.target.value)}
                    value={descriptionget}
                    rows={5}
                  />

                  <div className={styles['product-vto-submit-container']}>
                    <button></button>
                    <button type="submit" className={`${styles['product-vto-submit-form-button']} ${loading ? styles['product-vto-submit-form-button-loading'] : styles['product-vto-submit-form-button-active']}`}>Submit</button>
                  </div>
                </form>
              }
            </>
          )}
        </Modal>
        : null
      }

      {/* // REMOVE // remove chin section integration and flag // not required */}
      {showChinSection && (
        <div className={styles['product-chin-section']}>
          <StarOutlined
            height='fit-content'
            onClick={handleStarClick}
            role={onStarClick ? "button" : "img"}
            className={`${styles['product-chin-star-icon']} ${size === "small" ? styles['product-chin-star-icon-small'] : styles['product-chin-star-icon-medium']} ${product.starred ? styles['product-chin-star-icon-filled'] : styles['product-chin-star-icon-default']} ${onStarClick ? styles['product-chin-star-icon-clickable'] : styles['product-chin-star-icon-not-clickable']}`}
          />
          {enableCopyFeature && (
            <div
              className={styles['product-chin-copy-button']}
              onClick={handleCopyClick}>
              <CopyOutlined className={styles['product-chin-copy-icon']} />
            </div>
          )}
          <div
            className={styles['product-chin-remove-button']}
            onClick={removeFromWishlistClick}>
            <CloseCircleOutlined className={styles['product-chin-remove-icon']} />
          </div>
        </div>
      )}
      {widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
        (showEdit || showStar || showRemoveIcon) && (
          <div
            className={`${styles['product-action-cover-container']} ${size === "small" ? styles['product-action-cover-container-small'] : styles['product-action-cover-container-medium']}`}>
            <div>
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
            </div>
            <div>
              {showEdit ? (
                <button
                  className={styles['product-action-cover-edit-button']}
                  tabindex='-1'
                  role='button'
                  onClick={handleEditClick}>
                  <EditFilled className={styles['product-action-cover-edit-icon']} />
                  <span className={styles['product-action-cover-edit-text']}>
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
