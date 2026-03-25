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
import camera from "../../components/singleCollection/images/Card/camera.svg";
import Modal from "../../components/modal/Modal";
import styles from "../../components/singleCollection/ProductCard.module.css";

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

  //   useEffect(() => {
  //     return () => {
  //       dispatch({ type: RESET_PRODUCT_DETAILS });
  //     };
  //   }, []);

  // console.log('customProductsData', customProductsData);
  const [storeData] = useSelector((state) => [state.store.data]);
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

  const fieldsToDisplay = [
    "age_group",
    "gemstone",
    "color",
    "gender",
    "material",
    "occasion",
    "pattern",
    "shape",
    "style",
    "room",
    "size",
    "sleeve",
    "fit",
  ];

  // scroll for tags

  const swiperRef = useRef(null); // To store Swiper instance

  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = () => {
    if (swiperRef.current && swiperRef.current.wrapperEl) {
      const { scrollWidth, clientWidth } = swiperRef.current.wrapperEl;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    // Initial check
    checkOverflow();
    // Recheck on resize
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkOverflow);
      return () => {
        window.removeEventListener("resize", checkOverflow);
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
  const image_try = `Using the provided images: product image and person image/person body part or person image, create a photorealistic composite showing the product applied to or held or wore by the person as described below. Positioning and scale: Understand the image of product and also how it will look if used/wore/held by person and understand physics, place or make it like person has wore the product naturally on the appropriate body part or held or wore. Size and perspective should match the body part so the product appears physically plausible and proportional. If there are multiple products, choose only one whichever you like or whichever looks prominent (only one).  few product are not meant to be wore, in that time make sure person is holding naturally Lighting and color match: match the product's color, highlights, reflections, and shadow direction to the person photo. Preserve soft shadows where the product meets skin or clothing. Integration details: ensure natural contact and occlusion - adjust fabric folds, subtle skin indentation, and cast shadows to imply weight and contact. Preserve identity: do not alter the person's face, skin tone, or any identifiable features. Keep hair, tattoos, scars, and jewelry unchanged unless explicitly asked. Preserve product look: do not alter the product look. Camera and realism: produce a high-resolution, photorealistic image consistent with the person photo camera angle. Use photographic terms: camera/lens suggestion e.g., '50mm, shallow depth of field' if you want a particular look. Negative instructions: Do not add any new people or faces. Do not change the person's identity, skin tone, or facial features. Do not show the product floating or misaligned. Do not use body part which is found along with product, ignore it. Do not put product in inappropriate place.`;
  const handleVTOclick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const url = window.location.origin;
    // setButtonClick(true);
    const payload = {
      image_urls: [productDetails.image, uploadedImages[0]],
      store: storeData.store_name,
      image_tryon_prompt: image_try || "",
      additional_prompt: descriptionget || "",
      type: "tryon",
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
  return (
    <>
      <div
        className={`w-full max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto lg:pb-12 pb-20`}
      >
        <div className="flex flex-col w-full self-center my-12 gap-5">
          <div
            className="flex items-center cursor-pointer px-0"
            onClick={handleGoBack}
          >
            <span className="text-xl leading-none flex mr-2">
              <ArrowLeftOutlined />
            </span>
            <span className="text-xl font-medium capitalize">Go back</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <div
              className={`w-full lg:min-w-439  h-auto lg:h-456 ${fetchProductImage ? "" : "mx-auto"}  border border-solid border-gray-107 rounded-xl`}
              style={{ height: "480px" }}
            >
              {!isEmpty(productDetails?.image || fetchProductImage) ? (
                <img
                  className="w-full h-full object-contain rounded-xl"
                  src={
                    additionalimg || productDetails?.image || fetchProductImage
                  }
                  alt="Product Image"
                />
              ) : null}
              {productDetails?.additional_image &&
              productDetails?.additional_image.length > 0 ? (
                <Swiper
                  modules={[FreeMode]}
                  freeMode={true}
                  // grabCursor={true}
                  slidesPerView={"auto"}
                  spaceBetween={8}
                  className="mt-4 w-full h-32 cursor-pointer"
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
                          className={`w-[110px] h-[120px] rounded-[10px] ${
                            additionalimg === img
                              ? "border bg-purple-300 p-0.5"
                              : ""
                          }`}
                          onClick={() => setAdditionalImg(img)}
                          alt="product"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : null}
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
              <div className="flex flex-col gap-4 w-full lg:w-65%">
                <div className="flex justify-between items-center gap-2">
                  <div className="text-xl-1 font-semibold">
                    {productDetails?.name}
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex gap-4 justify-end items-start">
                      {productDetails?.user_id === authUser?.user_id ||
                      productDetails?.brand === authUser?.user_name ? (
                        <EditOutlined
                          title="Edit product details"
                          className="flex text-2xl lg:text-xl-2 cursor-pointer"
                          onClick={() => handleOpenProductModal(true)}
                        />
                      ) : null}
                 
                      {/* {qrCodeGeneratorURL ? (
									<img
										className='w-20 lg:w-25 h-20 lg:h-25 object-cover'
										src={qrCodeGeneratorURL}
									/>
								) : null} */}
                    </div>
                    <div className="relative flex justify-between w-6 lg:w-7">
                      {showShareProductDetails && (
                        <ShareOptions
                          url={sharePageUrl}
                          setShow={setShowShareProductDetails}
                          onClose={() => setShowShareProductDetails(false)}
                          //   collection={blogCollectionPage}
                          isOpen={showShareProductDetails}
                          qrCodeGeneratorURL={qrCodeGeneratorURL}
                          true
                        />
                      )}
                      {sharePageUrl && (
                        <div className="flex w-auto">
                          <Image
                            width={28}
                            height={28}
                            className="cursor-pointer h-7 w-7"
                            src={share_icon}
                            preview={false}
                            onClick={() =>
                              setShowShareProductDetails(
                                !showShareProductDetails,
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-3 items-center">
                    {productDetails?.price || productDetails?.listprice ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${currencySymbol}${
                            productDetails.price || productDetails.listprice
                          }`,
                        }}
                        className="text-2xl font-semibold"
                      />
                    ) : null}
                    {productDetails?.price &&
                    +productDetails.listprice > +productDetails?.price ? (
                      <span className="text-base text-gray-101">
                        MRP{" "}
                        <span
                          className="line-through"
                          dangerouslySetInnerHTML={{
                            __html: `${currencySymbol}${productDetails.listprice}`,
                          }}
                        />
                      </span>
                    ) : null}
                    {discountPer ? (
                      <span className="text-base   text-red-600">
                        ( {discountPer}% OFF )
                      </span>
                    ) : null}
                  </div>

                  {productDetails?.availability ? (
                    <span
                      className={`font-medium uppercase ${
                        productDetails.availability === "out stock"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {productDetails.avlbl === 0
                        ? "SOLD"
                        : productDetails.availability}
                    </span>
                  ) : null}
                </div>

                {brandsDetails?.brandName && brandsDetails.brandDescription ? (
                  <div>
                    <span className="text-lg font-medium leading-loose">
                      About {brandsDetails.brandName}
                    </span>
                    <p>{brandsDetails.brandDescription}</p>
                  </div>
                ) : null}

                {!brandsDetails && productDetails?.brand ? (
                  <div>
                    <span className="text-lg font-medium leading-loose">
                      Brand :{" "}
                    </span>
                    <span className="text-slat-103">
                      {productDetails?.brand}
                    </span>
                  </div>
                ) : null}

                {brandsDetails?.paymentMethod ? (
                  <div>
                    <div className="text-lg font-medium leading-loose mb-1.75">
                      Payment Link
                    </div>
                    <div className="grid gap-2">
                      {brandsDetails.paymentMethod.split(",").map((item) => {
                        const link = item.trim();
                        return (
                          <a
                            className="flex items-center justify-center max-w-480 py-1.75 border border-gray-101 rounded-xl hover:underline"
                            target="_blank"
                            href={link}
                          >
                            {link}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center gap-4">


                {storeData?.pdp_settings?.is_add_to_cart_button && (
                  <div className="flex gap-5  mt-16 mb-6 items-center ">
                    <div className="border px-3 h-12 items-center flex gap-10 p-4 ">
                      <button
                        className="  text-xl cursor-pointer"
                        onClick={() => {
                          updateCartQuantity(cardItem?.qty - 1);
                        }}
                      >
                        -
                      </button>
                      <button className="  text-xl cursor-pointer">
                        {cardItem?.qty || 0}
                      </button>
                      <button
                        className="  text-xl cursor-pointer"
                        onClick={() => {
                          updateCartQuantity(cardItem?.qty + 1 || 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-white h-14 max-w-340 w-full ">
                      <button
                        onClick={handleAddToCart}
                        className="text-white h-14  bg-violet-100 w-full rounded-15"
                        style={{
                          backgroundColor: "#7c75c",
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
                {storeData?.pdp_settings?.is_buy_button && (
                  <button
                    className="w-fit  mt-4 inline text-white disabled:opacity-50 disabled:cursor-not-allowed py-2 px-9 font-normal text-lg rounded-10 shadow-lg "
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
                     <div
                        className="flex items-center gap-3 py-2 px-9 font-normal text-lg rounded-10 shadow-md  mt-4 bg-[#FAFAFA] cursor-pointer"
                        onClick={(e) => {
                          dispatch(
                            vtoIconState(productDetails?.mfr_code || true),
                          );
                          e.stopPropagation();
                        }}
                      >
                        <Image
                          height={28}
                          width={28}
                          alt="Try on with camera"
                          className="cursor-pointer"
                          src={camera}
                         style={{
filter: "sepia(100%) saturate(400%) hue-rotate(240deg)"
}}
                        />
                        <p>Virtual  Try On</p>
                      </div>

                </div>


                {productDetails?.description && (
                  <div>
                    <div className="text-lg font-medium leading-loose border-b border-solid border-gray-107">
                      Product Description
                    </div>
                    <div className="mt-1.75">{productDetails.description}</div>
                  </div>
                )}

                <div>
                  <div className="text-lg font-medium leading-loose border-b border-solid border-gray-107">
                    keywords
                  </div>
                  <div className="flex flex-wrap gap-2 my-5">
                    {productDetails?.product_tag &&
                      productDetails?.product_tag.length > 0 &&
                      productDetails?.product_tag.map((tag, index) => (
                        <div className="rounded-22 flex items-center whitespace-nowrap shadow h-30 px-2 sm:px-4 font-normal text-xs md:text-sm leading-none text-slat-104 bg-white py-0.5">
                          {tag}
                        </div>
                      ))}
                  </div>

                  <div className="relative w-full">
                    <Swiper
                      slidesPerView="auto"
                      spaceBetween={10}
                      preventClicks={false}
                      preventClicksPropagation={false}
                      freeMode={true}
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      className="pb-1 pr-10 mr-5"
                    >
                      {fieldsToDisplay.map((field) =>
                        productDetails?.[field]?.length > 0 ? (
                          <SwiperSlide key={field} style={{ width: "auto" }}>
                            <div
                              className="rounded-22 flex items-center whitespace-nowrap shadow h-30 px-2 sm:px-4 font-normal text-xs md:text-sm leading-none text-slate-600 bg-white py-0.5"
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
                          className="absolute right-0  lg:h-10 h-8 lg:w-10 top-0 lg:-top-1 hover:shadow-xl  bg-gray-50  w-8 rounded-full flex justify-center items-center"
                          style={{ cursor: "pointer", zIndex: 10 }}
                          onClick={() => {
                            if (swiperRef.current) {
                              swiperRef.current.slideNext();
                            }
                          }}
                        >
                          <MdOutlineKeyboardArrowLeft className="transform rotate-180 text-xl " />
                        </div>
                        <div
                          className="absolute  lg:h-10 h-8 top-0 lg:-top-1 lg:w-10 bg-gray-50  w-8 rounded-full flex hover:shadow-xl lg:-left-6 -left-5 justify-center items-center"
                          style={{ cursor: "pointer", zIndex: 10 }}
                          onClick={() => {
                            if (swiperRef.current) {
                              swiperRef.current.slidePrev();
                            }
                          }}
                        >
                          <MdOutlineKeyboardArrowLeft className="text-xl " />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  {(brandsDetails?.title ||
                    brandsDetails?.email ||
                    brandsDetails?.contact ||
                    brandsDetails?.instagramUrl ||
                    brandsDetails?.facebookUrl ||
                    brandsDetails?.info ||
                    brandsDetails?.couponCode ||
                    brandsDetails?.paymentDetails ||
                    brandsDetails?.shippingDetails) && (
                    <div className="text-lg font-medium leading-loose border-b border-solid border-gray-107">
                      Contact Details
                    </div>
                  )}
                  {brandsDetails?.title && (
                    <div className="flex flex-row items-center my-1.75 text-base">
                      <div className="w-1/4">Brand Name</div>
                      <div className="text-gray-105">
                        {brandsDetails.title}{" "}
                      </div>
                    </div>
                  )}
                  {brandsDetails?.email && (
                    <div className="flex flex-row items-center my-1.75 text-base">
                      <div className="w-1/4"> Brand Email</div>
                      <a
                        className="text-gray-105 p-0"
                        href={`mailto:${brandsDetails.email}`}
                      >
                        {brandsDetails.email}
                      </a>
                    </div>
                  )}
                  {brandsDetails?.contact && (
                    <div className="flex flex-row items-center my-1.75 text-base">
                      <div className="w-1/4">Contact</div>
                      <a
                        className="text-gray-105 p-0"
                        href={`tel:${brandsDetails.contact}`}
                      >
                        {brandsDetails.contact}
                      </a>
                    </div>
                  )}

                  {brandsDetails?.instagramUrl || brandsDetails?.facebookUrl ? (
                    <div className="flex my-1.75 gap-5">
                      {brandsDetails?.instagramUrl && (
                        <a
                          width={28}
                          height={28}
                          href={brandsDetails?.instagramUrl}
                          target="_blank"
                          className="p-0"
                        >
                          <Image src={instagramIcon} width="28px" height={28} />
                        </a>
                      )}
                      {brandsDetails?.facebookUrl && (
                        <a
                          width={28}
                          height={28}
                          href={brandsDetails?.facebookUrl}
                          target="_blank"
                          className="p-0"
                        >
                          <Image src={facebookIcon} width="28px" height={28} />
                        </a>
                      )}
                    </div>
                  ) : null}
                  {brandsDetails?.info ? (
                    <p className="text-base font-semibold mt-2">
                      {brandsDetails.info}
                    </p>
                  ) : null}
                </div>

                {brandsDetails?.couponCode ? (
                  <div className="flex flex-row items-center my-1.75 text-base">
                    <div className="w-1/4">Coupon Code</div>
                    <div className="flex items-center gap-2">
                      <p className="text-base">{brandsDetails.couponCode}</p>{" "}
                      <CopyToClipboard
                        text={brandsDetails.couponCode}
                        onCopy={() => message.success("Copied", 1)}
                      >
                        <CopyOutlined
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="text-lg"
                        />
                      </CopyToClipboard>
                    </div>
                  </div>
                ) : null}

                {brandsDetails?.paymentDetails && (
                  <div>
                    <div className="text-lg font-medium leading-loose border-b border-solid border-gray-107">
                      Payment Details
                    </div>
                    <div className="mt-1.75">
                      {linkifyText(brandsDetails.paymentDetails)}
                    </div>
                  </div>
                )}

                {brandsDetails?.shippingDetails && (
                  <div>
                    <div className="text-lg font-medium leading-loose border-b border-solid border-gray-107">
                      Shipping Details
                    </div>
                    <div className="mt-1.75">
                      {linkifyText(brandsDetails.shippingDetails)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
