import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, notification, Upload } from "antd";
import Image from "next/image";
import {
  CopyOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useNavigate } from "../../helper/useNavigate";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { openProductModal } from "../customProductModal/redux/actions";
import {
  getPercentage,
  collectionQRCodeGenerator,
  getProductDetailsPagePath,
  isEmpty,
  cleanImage,
} from "../../helper/utils";
import {
  customProductsAPIs,
  profileAPIs,
  TryOnVto,
} from "../../helper/serverAPIs";

import ShareOptions from "../shared/shareOptions";

import facebookIcon from "../../images/staticpageimages/facebookIcon.png";
import instagramIcon from "../../images/staticpageimages/instagramIcon.png";
import share_icon from "../../images/profilePage/share_icon.svg";
import {
  CURRENCY_SYMBOLS,
  CURRENCY_USD,
  PATH_ROOT,
  STORE_USER_NAME_SAMSKARA,
} from "../../constants/codes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import Addmore from "../../images/addmore2.svg";
import SwiperCore, { FreeMode } from "swiper";
import { addToCart, fetchCart } from "../DeliveryDetails/redux/action";
import { getTTid } from "../../helper/getTrackerInfo";
import axios from "axios";
import { payment_url } from "../../constants/config";
import { PDPPageSkeleton } from "./ProductDetailsSkeleton";
import { PDPloader } from "./redux/action";
import { RESET_PRODUCT_DETAILS } from "../../components/singleCollection/ProductRedux/constants";
import { fetchProductDetails } from "../../components/singleCollection/ProductRedux/actions";
import { vtoIconState } from "../../components/singleCollection/redux/actions";
import camera from "../../components/singleCollection/images/Card/Aiicon.svg";
import Modal from "../../components/modal/Modal";
import styles from "../../components/singleCollection/ProductCard.module.css";
import pdpLayoutStyles from "./ProductDetails.module.scss";
import { RiArrowDropDownLine } from "react-icons/ri";


const ProductDetails = ({ params, ...props }) => {
  const router = useRouter();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mfr_code = params?.mfr_code || router?.query?.mfr_code;
  const { collection, loading } = useSelector((state) => state.cart);
  // console.log('collectionsuii', collection);
  const [isloading, setIsLoading] = useState(true);
  const [
    sellerDetails,
    customProductsData,
    authUser,
    pdploader,
    fetchProductImage,
    fetchProductLoading,
    productDetail,
    ButtonClick,

  ] = useSelector((state) => [
    state.store.data.sellerDetails || {},
    state.auth.customProducts.data.data || [],
    state.auth.user.data,
    state.PDP_LoaderReducer.pdpLoader,
    state.auth.fetchProduct.image,
    state.auth.fetchProduct.isLoading,
    state.auth.fetchProduct.productDetails.data,
    state.VtoIconReducer.ButtonClick,


  ]);

  const [store_id] = useSelector((state) => [state.store.data.store_id]);

  const imageFromQuery = cleanImage(router.query.image);
  const [showLoader, setShowLoader] = useState(false);
  const [dropDown, setDropDown] = useState(false)

  //   useEffect(() => {
  //     return () => {
  //       dispatch({ type: RESET_PRODUCT_DETAILS });
  //     };
  //   }, []);

  // console.log('customProductsData', customProductsData);
  const [storeData] = useSelector((state) => [state.store.data]);
  const ProductTags = storeData?.catalog_attributes?.find(att => att.key === "product_tag")?.is_display
  // console.log('onMyDev',ProductTags);
  // console.log('storeData',storeData.pdp_settings.is_add_to_cart_button);
  const [authUserId] = useSelector((state) => [state.auth.user.data.user_id]);
  const mycartcollectionpath = `my_cart_${authUserId || getTTid()}`;
  const [fetchedProductDetails, setFetchedProductDetails] = useState();
  const [showShareProductDetails, setShowShareProductDetails] = useState(false);

  //   const fetchProductDetails = async () => {
  //     try {
  //       const products = await customProductsAPIs.fetchProductDetailsAPICall(
  //         mfr_code,
  //         productDetails?.image,
  //       );
  //       if (products && products.status === 200 && products.data) {
  //         setFetchedProductDetails(products.data.data[0]);
  //       }
  //     } catch {
  //       setFetchedProductDetails({});
  //     } finally {
  //       dispatch(PDPloader(false));
  //     }
  //   };

  useEffect(() => {
    if (!mfr_code) return;
    const storedImage = localStorage.getItem(`pdp_image_${mfr_code}`) || "";
    dispatch(fetchProductDetails({ mfr_code, image: storedImage }));
  }, [mfr_code, dispatch]);
  const savedProductDetails = useMemo(
    () => productDetail?.find((item) => item.mfr_code === mfr_code), // find selected product details from redux
    [productDetail],
  );
  useEffect(() => {
    if (!mfr_code) return;

    return () => {
      localStorage.removeItem(`pdp_image_${mfr_code}`);
    };
  }, [mfr_code]);
  //   useEffect(() => {
  //     if (!mfr_code) return;
  //     if (!savedProductDetails) {
  //       fetchProductDetails(); // fetch product details if not available in redux
  //     }
  //   }, [mfr_code, savedProductDetails]);

  const productDetails = useMemo(() => {
    if (savedProductDetails) {
      return savedProductDetails;
    } else {
      return fetchedProductDetails;
    }
  }, [savedProductDetails, fetchedProductDetails]);
  // console.log("productDetails", productDetails);

  const cardItem = useMemo(() => {
    return collection?.product_lists?.find(
      (item) => item.mfr_code === productDetails?.mfr_code,
    );
  }, [collection, productDetails]);
  // console.log('cardItem',productDetails);

  useEffect(() => {
    if (mycartcollectionpath) {
      dispatch(fetchCart(mycartcollectionpath));
    }
  }, [dispatch, mycartcollectionpath]);

  const updateCartQuantity = (newQty) => {
    const payload = {
      products: [
        {
          mfr_code: productDetails.mfr_code,
          tagged_by: productDetails?.tagged_by || [],
          qty: newQty,
        },
      ],
      product_lists: [],
      collection_name: "my cart",
      type: "system",
      user_id: authUserId || getTTid(),
      path: mycartcollectionpath,
    };
    dispatch(addToCart(payload));
  };

  const brandsDetails = useMemo(
    () => sellerDetails[productDetails?.brand],
    [sellerDetails, productDetails?.brand],
  );

  const discountPer = useMemo(
    () =>
      productDetails?.price &&
      productDetails?.listprice &&
      +productDetails?.listprice > +productDetails?.price &&
      getPercentage(productDetails.listprice, productDetails.price),
    [productDetails?.listprice, productDetails?.price],
  );

  const currency = useMemo(
    () =>
      productDetails?.currency
        ? productDetails.currency
        : brandsDetails?.currency || CURRENCY_USD,
    [productDetails?.currency, brandsDetails?.currency],
  );

  const currencySymbol = useMemo(
    () =>
      productDetails?.currency_symbol
        ? productDetails.currency_symbol
        : CURRENCY_SYMBOLS[currency],
    [productDetails?.currency_symbol, currency],
  );

  const linkifyText = (description) => {
    const urlRegex = /(?<=\s|^)(https?:\/\/[^\s]+)/g;
    return description.split(urlRegex).map((text) => {
      if (urlRegex.test(text)) {
        return (
          <a href={text} target="_blank" className="px-0 text-blue-109">
            {text}
          </a>
        );
      } else {
        return <span>{text}</span>;
      }
    });
  };

  const handleOpenProductModal = useCallback(
    (allowEdit) => {
      dispatch(
        openProductModal({
          payload: productDetails,
          allowEdit: allowEdit,
        }),
      );
    },
    [productDetails],
  );

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window?.history?.length > 2) {
      window.history.back();
    } else {
      navigate(PATH_ROOT);
    }
  };

  const productDetailsPagePath = useMemo(
    () => getProductDetailsPagePath(productDetails?.mfr_code),
    [productDetails?.mfr_code],
  );

  const qrCodeGeneratorURL = useMemo(
    () => collectionQRCodeGenerator(productDetailsPagePath),
    [productDetailsPagePath],
  );

  const [sharePageUrl, setSharePageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSharePageUrl(`${window.location?.origin}${productDetailsPagePath}`);
    }
  }, [productDetailsPagePath]);

  // const fieldsToDisplay = [
  //   // "age_group",
  //   // "gemstone",
  //   "color",
  //   "gender",
  //   "material",
  //   // "occasion",
  //   "pattern",
  //   // "shape",
  //   // "style",
  //   // "room",
  //   // "size",
  //   "sleeve",
  //   "fit",
  //   "category",
  //   // 'product_tag'
  // ];
  const fieldsToDisplay = storeData?.pdp_settings?.product_page_attributes
  // console.log('fieldsToDisplay',fieldsToDisplay);

  // scroll for tags

  const swiperRef = useRef(null); // To store Swiper instance
  const thumbnailSwiperRef = useRef(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isThumbnailOverflowing, setIsThumbnailOverflowing] = useState(false);

  const checkOverflow = () => {
    if (swiperRef.current && swiperRef.current.wrapperEl) {
      const { scrollWidth, clientWidth } = swiperRef.current.wrapperEl;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  const checkThumbnailOverflow = () => {
    if (thumbnailSwiperRef.current && thumbnailSwiperRef.current.wrapperEl) {
      const { scrollWidth, clientWidth } = thumbnailSwiperRef.current.wrapperEl;
      setIsThumbnailOverflowing(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    checkThumbnailOverflow();

    if (typeof window !== "undefined") {
      const handleResize = () => {
        checkOverflow();
        checkThumbnailOverflow();
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [productDetails, pdploader]);

  // console.log('productDetails',productDetails);

  const handleAddToCart = () => {
    // e.stopPropagation();
    if (!productDetails?.mfr_code) return;

    const payload = {
      products: [
        {
          mfr_code: productDetails.mfr_code,
          tagged_by: productDetails.tagged_by || [],
          qty: cardItem?.qty + 1 || 1,
        },
      ],
      product_lists: [],
      collection_name: "my cart",
      type: "system",
      user_id: authUserId || getTTid(),
      // collection_id: mycartcollectionid,
      // path: mycartcollectionpath,
    };
    dispatch(addToCart(payload));
  };

  const checkoutPayment = async (e) => {
    e.preventDefault();
    const location =
      typeof window !== "undefined" ? window.location.origin : "";

    e.stopPropagation();
    const payload = {
      amount: productDetails?.price || productDetails?.listprice || 0, // MANDATORY
      currency: "USD", // MANDATORY
      thumbnail: productDetails.image,
      user_id: authUserId || getTTid(),
      store_id: store_id,
      service_id: `Product_${productDetails.mfr_code}`,
      emailId: authUser.emailId || null,
      successUrl: `${location}/successpayment`,
      failureUrl: `${location}/failedpayment`,
      additional_details: {
        mfr_code: productDetails.mfr_code,
      },
      title: productDetails.name,
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

      // 🔁 If API returns payment URL
      if (res?.data?.redirectUrl) {
        if (typeof window !== "undefined") {
          window.location.href = res.data.redirectUrl;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // alert("Payment initiation failed. Please try again.");
    }
  };

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
      console.log(error);

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
  const [additionalimg, setAdditionalImg] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [vtoResultImageUrl, setVtoResultImageUrl] = useState(null);
  const [descriptionget, setDescriptionget] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showAllFields, setShowAllFields] = useState(false);
  const handleVTOclick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const url = window.location.origin;
    // setButtonClick(true);
    const payload = {
      image_urls: [productDetails.image, uploadedImages[0]],
      store: storeData.store_name,
      image_tryon_prompt: storeData?.templates?.[collection?.tryon_type] || storeData?.templates?.image_try_on || "",
      additional_prompt: descriptionget || "",
      type: collection?.tryon_type || "tryon",
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

  if (fetchProductLoading) {
    return <PDPPageSkeleton />;
  }

  const hasContactDetails =
    brandsDetails?.title ||
    brandsDetails?.email ||
    brandsDetails?.contact ||
    brandsDetails?.instagramUrl ||
    brandsDetails?.facebookUrl ||
    brandsDetails?.info ||
    brandsDetails?.couponCode ||
    brandsDetails?.paymentDetails ||
    brandsDetails?.shippingDetails;

  return (
    <div className="relative w-full overflow-hidden pb-20 lg:pb-14 ">
      <div className=" " />
      <div className={`${pdpLayoutStyles.pageWidthContainer} relative`}>
        <div className="flex flex-col w-full self-center my-8 lg:my-10 gap-6 lg:gap-8">
          <button
            className="group flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm sm:text-base lg:text-lg font-medium text-[#222f44]   transition "
            onClick={handleGoBack}
          >
            <span className="text-lg leading-none flex transition group-hover:-translate-x-0.5">
              <ArrowLeftOutlined />
            </span>
            <span className="capitalize">Go back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-6  lg:gap-8 items-start">
            <div className="flex flex-col gap-4 xl:sticky xl:top-6">
              <div className="w-full  lg:w-full   mx-auto border border-[#f2f2f2] rounded-3xl   p-3 sm:p-4  ">
                {/* <div className="h-[300px] sm:h-[420px] lg:h-[500px]  rounded-2xl bg-white/70   overflow-hidden"> */}
                <div className="h-auto rounded-2xl bg-white/70   overflow-hidden max-h-590">
                  {!isEmpty(productDetails?.image || fetchProductImage) ? (
                    <div className="relative">
                      <img
                        className="w-full h-full object-contain rounded-2xl max-h-590 max-w-640 min-h-[590px]"
                        src={
                          additionalimg ||
                          productDetails?.image ||
                          fetchProductImage
                        }
                        alt="Product Image"
                      />
                      {discountPer ? (
                        <span className="text-[12px] font-bold text-white absolute top-[18px] left-[15px] bg-red-500 px-[8px] py-[3px] rounded-[25px]">
                          {discountPer}% OFF
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {productDetails?.additional_image &&
                  productDetails?.additional_image.length > 0 ? (
                  <div className="relative mt-4">
                    <Swiper
                      modules={[FreeMode]}
                      freeMode={true}
                      slidesPerView={"auto"}
                      spaceBetween={10}
                      onSwiper={(swiper) => {
                        thumbnailSwiperRef.current = swiper;
                        if (swiper?.wrapperEl) {
                          const { scrollWidth, clientWidth } = swiper.wrapperEl;
                          setIsThumbnailOverflowing(scrollWidth > clientWidth);
                        }
                      }}
                      className="w-full cursor-pointer"
                    >
                      {[
                        productDetails.image,
                        ...productDetails.additional_image,
                      ].map((img, i) => (
                        <SwiperSlide key={i} style={{ width: "auto" }}>
                          <div className="flex">
                            <Image
                              src={img}
                              height={50}
                              width={50}
                              className={`  w-[110px] h-[120px] rounded-xl border transition ${additionalimg === img
                                ? "border-[#7c74ec] shadow-md ring-2 ring-[#e4e9ff]"
                                : "border-[#e8e2ff] hover:border-[#b8a9ff]"
                                }`}
                              onClick={() => setAdditionalImg(img)}
                              alt="product"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {isThumbnailOverflowing && (
                      <>
                        <button
                          type="button"
                          className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 h-8 w-8 lg:h-10 lg:w-10 hover:shadow-lg bg-white border border-[#ddd6ff] rounded-full flex justify-center items-center z-10"
                          onClick={() => {
                            if (thumbnailSwiperRef.current) {
                              thumbnailSwiperRef.current.slidePrev();
                            }
                          }}
                        >
                          <MdOutlineKeyboardArrowLeft className="text-xl text-[#1f2c3b]" />
                        </button>
                        <button
                          type="button"
                          className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 h-8 w-8 lg:h-10 lg:w-10 hover:shadow-lg bg-white border border-[#ddd6ff] rounded-full flex justify-center items-center z-10"
                          onClick={() => {
                            if (thumbnailSwiperRef.current) {
                              thumbnailSwiperRef.current.slideNext();
                            }
                          }}
                        >
                          <MdOutlineKeyboardArrowLeft className="transform rotate-180 text-xl text-[#1f2c3b]" />
                        </button>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {ButtonClick === productDetails?.mfr_code ? (
              <Modal
                isOpen={!!ButtonClick}
                headerText={"Virtual Try-On"}
                subText="Upload a photo of yourself .Make sure and expose your face,hands,sholders etc depending on what you want to try on."
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
                    {Loading ? (
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
                                  className={
                                    styles["product-vto-upload-container"]
                                  }
                                >
                                  <h4
                                    className={
                                      styles["product-vto-upload-title"]
                                    }
                                  >
                                    Upload Your Image{" "}
                                  </h4>
                                  <Upload.Dragger
                                    className={
                                      styles["product-vto-upload-zone"]
                                    }
                                    {...uploadImageDraggerProps}
                                    name="upload_image"
                                    showUploadList={false}
                                  >
                                    <p
                                      className={
                                        styles["product-vto-upload-icon"]
                                      }
                                    >
                                      <UploadOutlined />
                                    </p>
                                    <p
                                      className={
                                        styles["product-vto-upload-text"]
                                      }
                                    >
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

            {productDetails && (
              <div className="flex flex-col  w-full   bg-white/95 ">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h1 className="text-xl sm:text-2xl lg:text-[34px] leading-tight font-semibold  text-[#1f2c3b]">
                      {productDetails?.name}
                    </h1>
                    <div className="flex justify-between items-center gap-3 shrink-0">
                      <div className="flex gap-3 justify-end items-start">
                        {productDetails?.user_id === authUser?.user_id ||
                          productDetails?.brand === authUser?.user_name ? (
                          <button
                            className="h-10 w-10 rounded-full border border-[#e0d9ff] text-[#1f2c3b] bg-white hover:bg-[#f2eeff]"
                            title="Edit product details"
                            onClick={() => handleOpenProductModal(true)}
                          >
                            <EditOutlined className="text-xl" />
                          </button>
                        ) : null}
                      </div>
                      <div className="relative flex justify-between w-10 h-10">
                        {showShareProductDetails && (
                          <ShareOptions
                            url={sharePageUrl}
                            setShow={setShowShareProductDetails}
                            onClose={() => setShowShareProductDetails(false)}
                            isOpen={showShareProductDetails}
                            qrCodeGeneratorURL={qrCodeGeneratorURL}
                            true
                          />
                        )}
                        {sharePageUrl && (
                          <button
                            className="flex w-10 h-10 items-center justify-center rounded-full border border-[#e0d9ff] bg-white hover:bg-[#f2eeff]"
                            onClick={() =>
                              setShowShareProductDetails(
                                !showShareProductDetails,
                              )
                            }
                          >
                            <Image
                              width={28}
                              height={28}
                              className="cursor-pointer h-6 w-6"
                              src={share_icon}
                              preview={false}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
                      {productDetails?.price || productDetails?.listprice ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: `${currencySymbol}${productDetails.price || productDetails.listprice
                              }`,
                          }}
                          className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#101828]"
                        />
                      ) : null}
                      {productDetails?.price &&
                        +productDetails.listprice > +productDetails?.price ? (
                        <span className="text-sm sm:text-base text-[#6b7280]">
                          {/* MRP{" "} */}
                          <span
                            className="line-through"
                            dangerouslySetInnerHTML={{
                              __html: `${currencySymbol}${productDetails.listprice}`,
                            }}
                          />
                        </span>
                      ) : null}
                    </div>

                    {productDetails?.availability ? (
                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs sm:text-sm font-semibold uppercase tracking-wide ${productDetails.availability === "out stock"
                          ? "bg-red-100 text-white"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        {productDetails.avlbl === 0
                          ? "SOLD"
                          : productDetails.availability}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* {brandsDetails?.brandName && brandsDetails.brandDescription ? (
                  <div className="">
                    <span className="text-base sm:text-lg font-semibold leading-loose text-[#182438]">
                      About {brandsDetails.brandName}
                    </span>
                    <p className="text-sm sm:text-[15px] lg:text-base text-[#364152] leading-7">
                      {brandsDetails.brandDescription}
                    </p>
                  </div>
                ) : null} */}

                {!brandsDetails && productDetails?.brand ? (
                  <div className=" mt-5">
                    <span className="text-base sm:text-lg font-semibold leading-loose text-[#182438]">
                      Brand :
                    </span>
                    <span className="ml-1 text-slat-103 text-sm sm:text-[15px] lg:text-base">
                      {productDetails?.brand}
                    </span>
                  </div>
                ) : null}

                {brandsDetails?.paymentMethod ? (
                  <div className="lg:mt-8 mt-4">
                    {/* <div className="text-base sm:text-lg font-semibold leading-loose mb-2 text-[#182438]">
                      Payment Link
                    </div> */}
                    <div className="grid gap-2">
                      {brandsDetails.paymentMethod
                        .split(",")
                        .map((item, idx) => {
                          const link = item.trim();
                          return (
                            <a
                              key={`${link}-${idx}`}
                              style={{ background: '#7c75ec' }}
                              className=" text-white flex justify-center items-center  py-2.5 w-36 font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg   "
                              target="_blank"
                              rel="noreferrer"
                              href={link}
                            >
                              Buy Now
                            </a>
                          );
                        })}
                    </div>
                  </div>
                ) : null}
                {(storeData?.pdp_settings?.is_buy_button || storeData?.pdp_settings?.is_add_to_cart_button) &&
                  <div className="mt-8 ">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      {storeData?.pdp_settings?.is_add_to_cart_button && (
                        <div className="flex flex-wrap gap-3 sm:gap-4 items-center w-full">
                          <div className="h-12 items-center flex gap-6 sm:gap-8 px-4 border border-[#ddd1ff] rounded-xl bg-white">
                            <button
                              className="text-xl font-medium text-[#1f2c3b] cursor-pointer"
                              onClick={() => {
                                updateCartQuantity(cardItem?.qty - 1);
                              }}
                            >
                              -
                            </button>
                            <button className="text-base sm:text-lg font-semibold text-[#1f2c3b] cursor-pointer">
                              {cardItem?.qty || 0}
                            </button>
                            <button
                              className="text-xl font-medium text-[#1f2c3b] cursor-pointer"
                              onClick={() => {
                                updateCartQuantity(cardItem?.qty + 1 || 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-white h-12 sm:h-14 w-full sm:w-auto sm:min-w-[210px]">
                            <button
                              onClick={handleAddToCart}
                              className="text-white h-full px-6 bg-violet-100 w-full rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition"
                              style={{
                                backgroundColor: "#7c75ec",
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      )}

                      {storeData?.pdp_settings?.is_buy_button && (
                        <button
                          className="inline text-white disabled:opacity-50 disabled:cursor-not-allowed py-2.5 w-36 font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition"
                          disabled={
                            !productDetails?.price && !productDetails?.listprice
                          }
                          style={{
                            background: "#7c75ec",
                            cursor:
                              !productDetails?.price && !productDetails?.listprice
                                ? "not-allowed"
                                : "",
                          }}
                          onClick={checkoutPayment}
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  </div>
                }

                {productDetails?.description && (
                  <div className="">
                    {/* <div className="text-base sm:text-lg font-semibold leading-loose border-b border-solid border-[#e3dcff] text-[#182438]">
                      Product Description
                    </div> */}
                    <div className="lg:mt-8 mt-4 mb-6 text-sm sm:text-[15px] md:text-base lg:text-lg  leading-7 text-[#334155]">
                      {productDetails.description}
                    </div>
                  </div>
                )}
                {/* {productDetails?.product_tag?.length > 0 && (
                  <div className="flex items-center gap-4 justify-between border-b-1.5 border-[hsl(240,5%,96%)] pb-3 mt-2">
                    <p className="text-[#9F9FA9] text-base lg:text-lg font-semibold uppercase ">
                      Products Tag
                    </p>
                    <p>{productDetails?.product_tag.join(",")}</p>
                  </div>
                )} */}

                {fieldsToDisplay.map((field, index) => {
                  const fieldsWithData = fieldsToDisplay.filter(f => productDetails?.[f]?.length > 0 && ProductTags);
                  const fieldIndexInFiltered = fieldsWithData.indexOf(field);
                  return productDetails?.[field]?.length > 0 && ProductTags ? (
                    (showAllFields || fieldIndexInFiltered < 4) && (
                      <div className="mt-2 " key={field}>
                        <div className="flex justify-between items-center gap-7 mb-3 border-b-1.5 border-[hsl(240,5%,96%)] pb-3">
                          <p className="text-[#9F9FA9] text-sm  md:text-base lg:text-lg font-semibold uppercase ">
                            {field}
                          </p>
                          <p className="font-normal text-sm  md:text-base text-end">
                            {Array.isArray(productDetails?.[field])
                              ? productDetails?.[field]?.join(",")
                              : productDetails?.[field]}
                          </p>
                        </div>
                      </div>
                    )
                  ) : null;
                })}
                {fieldsToDisplay.filter(field => productDetails?.[field]?.length > 0)?.length > 4 && (
                  <button
                    onClick={() => setShowAllFields(!showAllFields)}
                    className="mt-4 text-start text-[#7c74ec] font-semibold text-sm md:text-base hover:text-[#6b63d5] transition"
                  >
                    {showAllFields ? 'Show Less' : 'Show More'}
                  </button>
                )}
                {/* {productDetails?.product_tag?.length > 0 && (
                  <div className="flex items-center gap-4 justify-between ">
                    <p className="text-[#9F9FA9] text-base lg:text-lg font-semibold uppercase">
                      Products Tag
                    </p>
                    <p>{productDetails?.product_tag.join(",")}</p>
                  </div>
                )} */}
                {storeData?.is_tryon_enabled &&
                  <div
                    className=" py-6 px-6 font-medium text-sm sm:text-base rounded-xl shadow-sm   bg-[#FAFAFA] cursor-pointer hover:shadow-md transition mt-6 lg:mt-7 mb-8"
                    onClick={(e) => {
                      dispatch(vtoIconState(productDetails?.mfr_code || true));
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3 lg:mb-4">
                      <Image
                        height={24}
                        width={24}
                        alt="Try on with camera"
                        className="cursor-pointer"
                        src={camera}
                      />
                      <p className="font-semibold text-lg lg:text-xl-1">Virtual Try On</p>
                    </div>
                    <p>
                      Scan the QR code with your phone to try this piece on
                      virtually.
                    </p>
                  </div>
                }
                {/* <div className="">
                  <div className="text-base sm:text-lg font-semibold mb-1 leading-loose border-b border-solid border-[#e3dcff] text-[#182438]">
                    keywords
                  </div>
                  <div className="flex flex-wrap gap-2 my-5">
                    {productDetails?.product_tag &&
                      productDetails?.product_tag.length > 0 &&
                      productDetails?.product_tag.map((tag, index) => (
                        <div
                          key={`${tag}-${index}`}
                          className="rounded-full flex items-center whitespace-nowrap border border-[#ddd6ff] h-8 px-3 sm:px-4 font-medium text-xs md:text-sm leading-none text-[#374151] bg-white"
                        >
                          {tag}
                        </div>
                      ))}
                  </div> */}

                {/* <div className="relative w-full">
                    <Swiper
                      slidesPerView="auto"
                      spaceBetween={10}
                      preventClicks={false}
                      preventClicksPropagation={false}
                      freeMode={true}
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      className="pb-1 pr-10 mr-5 pl-4 lg:pl-6"
                    >
                      {fieldsToDisplay.map((field) =>
                        productDetails?.[field]?.length > 0 ? (
                          <SwiperSlide key={field} style={{ width: "auto" }}>
                            <div
                              className="rounded-full flex items-center whitespace-nowrap border border-[#ddd6ff] h-8 px-3 sm:px-4 font-medium text-xs md:text-sm leading-none text-[#334155] bg-white"
                              title={field}
                            >
                              <span className="font-semibold">{field} : </span>{" "}
                              {Array.isArray(productDetails?.[field])
                                ? productDetails?.[field]?.join(", ")
                                : productDetails?.[field]}
                            </div>
                          </SwiperSlide>
                        ) : null,
                      )}
                    </Swiper>
                    {isOverflowing && (
                      <>
                        <div
                          className="absolute right-0 h-8 w-8 lg:h-10 lg:w-10 top-0 lg:-top-1 hover:shadow-lg bg-white border border-[#ddd6ff] rounded-full flex justify-center items-center"
                          style={{ cursor: "pointer", zIndex: 10 }}
                          onClick={() => {
                            if (swiperRef.current) {
                              swiperRef.current.slideNext();
                            }
                          }}
                        >
                          <MdOutlineKeyboardArrowLeft className="transform rotate-180 text-xl text-[#1f2c3b]" />
                        </div>
                        <div
                          className="absolute h-8 w-8 lg:h-10 lg:w-10 top-0 lg:-top-1 -left-4 lg:-left-3.5 hover:shadow-lg bg-white border border-[#ddd6ff] rounded-full flex justify-center items-center"
                          style={{ cursor: "pointer", zIndex: 10 }}
                          onClick={() => {
                            if (swiperRef.current) {
                              swiperRef.current.slidePrev();
                            }
                          }}
                        >
                          <MdOutlineKeyboardArrowLeft className="text-xl text-[#1f2c3b]" />
                        </div>
                      </>
                    )}
                  </div> */}
                {/* </div> */}
                {brandsDetails?.couponCode ? (
                  <div className="">
                    <div className="flex flex-col sm:flex-row sm:items-center my-1.5 gap-2 sm:gap-0 text-sm sm:text-base">
                      <div className="sm:w-1/4 font-semibold text-[#1f2c3b]">
                        Coupon Code
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-[#dccfff] px-3 py-1.5 bg-white">
                        <p className="text-sm sm:text-base text-[#1f2c3b]">
                          {brandsDetails.couponCode}
                        </p>
                        <CopyToClipboard
                          text={brandsDetails.couponCode}
                          onCopy={() => message.success("Copied", 1)}
                        >
                          <CopyOutlined
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="text-lg cursor-pointer"
                          />
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                ) : null}

                {hasContactDetails && (
                  <div className="mt-6 border-t border-[#e7edf5] pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7edf5] pb-3">
                      <div className="flex items-center gap-2">
                        {/* <span className="h-2 w-2 rounded-full bg-[#2b3d56]" /> */}
                        <p className="text-base sm:text-lg font-semibold cursor-pointer  text-[#182438]" onClick={() => setDropDown(!dropDown)}>
                          Contact Details
                        </p>
                        {/* <p >kughbiuhb</p> */}
                        {brandsDetails?.shippingDetails || brandsDetails?.paymentDetails || brandsDetails?.info || brandsDetails?.contact || brandsDetails?.email || brandsDetails?.title &&
                          <RiArrowDropDownLine onClick={() => setDropDown(!dropDown)} className={`h-6 w-6 cursor-pointer text-xl transition-transform ${dropDown ? 'rotate-180' : ''}`} />
                        }
                      </div>

                      {brandsDetails?.instagramUrl || brandsDetails?.facebookUrl ? (
                        <div className="flex items-center gap-2">
                          {brandsDetails?.instagramUrl && (
                            <a
                              href={brandsDetails.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6e0eb] bg-white transition-transform hover:scale-105"
                            >
                              <Image
                                src={instagramIcon}
                                width={18}
                                height={18}
                                alt="Instagram"
                              />
                            </a>
                          )}
                          {brandsDetails?.facebookUrl && (
                            <a
                              href={brandsDetails.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6e0eb] bg-white transition-transform hover:scale-105"
                            >
                              <Image
                                src={facebookIcon}
                                width={18}
                                height={18}
                                alt="Facebook"
                              />
                            </a>
                          )}
                        </div>
                      ) : null}
                    </div>
                    {dropDown &&
                      <div className="mt-4 divide-y divide-[#edf2f7]">
                        {brandsDetails?.title && (
                          <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-1 sm:gap-4 py-3 text-sm sm:text-base">
                            <p className="text-[11px] sm:text-base font-semibold uppercase tracking-wide text-[#9F9FA9]">
                              Brand Name
                            </p>
                            <p className="font-medium text-[#1f2c3b] break-words">
                              {brandsDetails.title}
                            </p>
                          </div>
                        )}

                        {brandsDetails?.email && (
                          <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-1 sm:gap-4 py-3 text-sm sm:text-base">
                            <p className="text-[11px] sm:text-base font-semibold uppercase tracking-wide text-[#9F9FA9]">
                              Brand Email
                            </p>
                            <a
                              className="block p-0 font-medium text-[#334155] break-all hover:underline"
                              href={`mailto:${brandsDetails.email}`}
                            >
                              {brandsDetails.email}
                            </a>
                          </div>
                        )}

                        {brandsDetails?.contact && (
                          <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-1 sm:gap-4 py-3 text-sm sm:text-base">
                            <p className="text-[11px] sm:text-base font-semibold uppercase tracking-wide text-[#9F9FA9]">
                              Contact
                            </p>
                            <a
                              className="block p-0 font-medium text-[#334155] hover:underline"
                              href={`tel:${brandsDetails.contact}`}
                            >
                              {brandsDetails.contact}
                            </a>
                          </div>
                        )}
                      </div>
                    }

                    {brandsDetails?.info && dropDown ? (
                      <p className="mt-3 text-sm sm:text-base font-semibold text-[#1f2c3b]">
                        {brandsDetails.info}
                      </p>
                    ) : null}
                  </div>
                )}



                {brandsDetails?.paymentDetails && dropDown && (
                  <div className="mt-5 lg:mt-8">
                    <div className="text-base sm:text-lg font-semibold leading-loose border-b border-solid border-[#e3dcff] text-[#182438]">
                      Payment Details
                    </div>
                    <div className="mt-2 text-sm sm:text-[15px] lg:text-base leading-7 text-[#334155]">
                      {linkifyText(brandsDetails.paymentDetails)}
                    </div>
                  </div>
                )}

                {brandsDetails?.shippingDetails && dropDown && (
                  <div className="mt-5 lg:mt-8">
                    <div className="text-base sm:text-lg font-semibold leading-loose border-b border-solid border-[#e3dcff] text-[#182438]">
                      Shipping Details
                    </div>
                    <div className="mt-2 text-sm sm:text-[15px] lg:text-base leading-7 text-[#334155]">
                      {linkifyText(brandsDetails.shippingDetails)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
