import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { openProductModal } from "../../pageComponents/customProductModal/redux/actions";
import {
  getPercentage,
  collectionQRCodeGenerator,
  getProductDetailsPagePath,
  cleanImage,
} from "../../helper/utils";
import {
  requestSigninWithLink,
  decryptSigninToken,
  buildVerifyUrl,
} from "../../helper/autoLogin";
import { customProductsAPIs } from "../../helper/serverAPIs";

import {
  KIOSK_LOGIN_CHANGE_EVENT,
  PATH_ROOT,
  STORE_USER_NAME_SAMSKARA,
} from "../../constants/codes";
import { fetchCart } from "../../pageComponents/DeliveryDetails/redux/action";
import { auraYfretUserCollBaseUrl } from "../../constants/config";
import { PDPPageSkeleton } from "./ProductDetailsSkeleton";
import { PDPloader } from "../../pageComponents/storePage/redux/action";
import { RESET_PRODUCT_DETAILS } from "../singleCollection/ProductRedux/constants";
import { fetchProductDetails } from "../singleCollection/ProductRedux/actions";
import Modal from "../modal/Modal";
import pdpLayoutStyles from "./ProductDetails.module.scss";
import {
  openWishlistModal,
  setProductsToAddInWishlist,
} from "../../pageComponents/wishlist/redux/actions";
import { BsBookmarkPlusFill } from "react-icons/bs";
import {
  getwishlistUserCollection,
  GuestPopUpShow,
} from "../../pageComponents/Auth/redux/actions";
import GuestUserPopUp from "../../pageComponents/Auth/GuestUserPopUp";
import { addProductToWishlistCollection } from "../../pageComponents/wishlistActions/addProductToWishlistCollection/redux/actions";
import useKioskSessionReminder, {
  KioskSessionPopup,
} from "../kiosk/useKioskSessionReminder";
import { useKioskAccess } from "../kiosk/components/LoggedInInfo";
import AuthInput from "../kiosk/components/AuthInput";
import GoBack from "../common/GoBack";
import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";
import ProductBrandDetails from "./ProductBrandDetails";
import ProductOverview from "./ProductOverview";
import ProductInformation from "./ProductInformation";

const ProductDetails = ({ params, ...props }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mfr_code = params?.mfr_code || router?.query?.mfr_code;
  const { collection, loading } = useSelector((state) => state.cart);
  const [isloading, setIsLoading] = useState(true);
  const [
    sellerDetails,
    customProductsData,
    authUser,
    pdploader,
    fetchProductImage,
    fetchProductLoading,
    productDetail,
    productToWishlistCollection,
    wishlistCollections,
  ] = useSelector((state) => [
    state.store.data.sellerDetails || {},
    state.auth.customProducts.data.data || [],
    state.auth.user.data,
    state.PDP_LoaderReducer.pdpLoader,
    state.auth.fetchProduct.image,
    state.auth.fetchProduct.isLoading,
    state.auth.fetchProduct.productDetails.data,
    state.wishlistActions?.addProductToWishlistCollection?.data || [],
    state.auth.user.wishlistCollections,
  ]);

  const [store_id, isUserLogin] = useSelector((state) => [
    state.store.data.store_id,
    state.auth.user.isUserLogin,
  ]);
  const [storeData] = useSelector((state) => [state.store.data]);
  const [authUserId] = useSelector((state) => [state.auth.user.data.user_id]);
  const [fetchedProductDetails, setFetchedProductDetails] = useState();
  const [showShareProductDetails, setShowShareProductDetails] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [qrTargetUrl, setQrTargetUrl] = useState("");
  const [shareContext, setShareContext] = useState("product");

 
  const imageFromQuery = cleanImage(router.query.image);
  const [sharePageUrl, setSharePageUrl] = useState("");
  const hasKioskAccess = useKioskAccess({
    isUserLogin,
    storeData,
    authUser,
  });

  const savedProductDetails = useMemo(
    () => productDetail?.find((item) => item.mfr_code === mfr_code),
    [productDetail],
  );

  const productDetails = useMemo(() => {
    if (savedProductDetails) {
      return savedProductDetails;
    } else {
      return fetchedProductDetails;
    }
  }, [savedProductDetails, fetchedProductDetails]);
  const [kioskLogin, setKioskLoginAuth] = useState(null);

  const wishlist = Array.isArray(wishlistCollections)
    ? wishlistCollections
    : wishlistCollections?.product_lists || [];
  const heartRedProduct = wishlist?.find((x) => {
    return (
      String(x?.mfr_code).trim() === String(productDetails?.mfr_code).trim()
    );
  });

  const showHeartWishlist = hasKioskAccess
    ? kioskLogin && isUserLogin
    : isUserLogin;

  const routeMfrCode = Array.isArray(mfr_code) ? mfr_code[0] : mfr_code;
  const productMfrCode = productDetails?.mfr_code || routeMfrCode;

  const productDetailsPagePath = useMemo(
    () => (productMfrCode ? getProductDetailsPagePath(productMfrCode) : ""),
    [productMfrCode],
  );

  const { showSessionPopup, handleStayLoggedIn, handleLogout } =
    useKioskSessionReminder({ time: 500 * 1000 });

  const [isPopupShow, setIsPopupShow] = useState(false);
  const [guestPopupAction, setGuestPopupAction] = useState(null);

  useEffect(() => {
    const handleKioskLoginChange = () => {
      const kioskLogin = sessionStorage.getItem("Kiosk-login");

      try {
        setKioskLoginAuth(kioskLogin ? JSON.parse(kioskLogin) : null);
      } catch {
        setKioskLoginAuth(null);
      }
    };
    handleKioskLoginChange();

    window.addEventListener(KIOSK_LOGIN_CHANGE_EVENT, handleKioskLoginChange);

    return () => {
      window.removeEventListener(
        KIOSK_LOGIN_CHANGE_EVENT,
        handleKioskLoginChange,
      );
    };
  }, []);

  const onAddSelectedProductsToCollection = useCallback(
    (e = null, options = {}) => {
      const {
        isSave = false,
        isShare = false,
        isSkip = false,
        isGuestSubmit = false,
        userId = null,
        email = null,
      } = options;

      const kioskLoginUserId = kioskLogin?.user_id;

      if (
        isSave &&
        !isGuestSubmit &&
        (!isUserLogin || (hasKioskAccess && !kioskLoginUserId))
      ) {
        setIsPopupShow(true);
        setGuestPopupAction("save");
        dispatch(GuestPopUpShow(true));
        return;
      }

      if (isSave) {
        if (productDetails?.mfr_code) {
          const login_userID = userId || kioskLoginUserId || authUserId;
          dispatch(
            addProductToWishlistCollection({
              mfr_code: productDetails?.mfr_code,
              product_name: productDetails?.name,
              product_image: productDetails?.image,
              store: storeData?.store_name || "dothelook",
              user_id: userId || kioskLoginUserId || authUserId,
              eventId: storeData?.event_id,
              successMessage: "Product added to wishlist successfully!",
              errorMessage:
                "Failed to add product to wishlist. Please try again.",
              callback: () => {
                dispatch(
                  getwishlistUserCollection({
                    path: `my_wishlist_${login_userID}`,
                  }),
                );
              },
            }),
          );
        }
      }
    },
    [
      authUser,
      isUserLogin,
      dispatch,
      hasKioskAccess,
      authUserId,
      kioskLogin?.user_id,
      storeData,
      productDetails,
      productToWishlistCollection,
    ],
  );

  const buildShareAutoLoginLink = useCallback(
    async ({ userId = null, email = null, phone } = {}) => {
      const kioskLoginUserId = userId || kioskLogin?.user_id;
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      try {
        const currentKiosk =
          typeof window !== "undefined"
            ? JSON.parse(sessionStorage.getItem("Kiosk-login") || "{}")
            : {};
        const kioskEmail = email || currentKiosk?.email;
        const kioksPhone = phone || currentKiosk?.phone;
        if (kioskLoginUserId && (kioksPhone || kioskEmail)) {
          const resp = await requestSigninWithLink({
            email: kioskEmail,
            phone: kioksPhone,
          });
          const signin_token = resp?.signin_token || resp?.data?.signin_token;

          if (signin_token) {
            const decrypted = decryptSigninToken(signin_token);
            if (decrypted) {
              const pageParam = `?page=product/${productMfrCode}`;
              const verifyLink = buildVerifyUrl(decrypted, pageParam);

              const fullVerifyUrl = `${origin}${verifyLink}`;

              setSharePageUrl(fullVerifyUrl);
              setQrImageUrl(collectionQRCodeGenerator(fullVerifyUrl));
              setQrTargetUrl(fullVerifyUrl);
              setShowShareProductDetails(true);
              return true;
            }
          }
        }
      } catch (e) {
        console.error("Share auto-login build error", e);
      }

      return false;
    },
    [kioskLogin?.user_id, productMfrCode],
  );

  const buildProductAutoLoginQr = useCallback(
    async ({ mfrCode = productMfrCode, email = null } = {}) => {
      if (typeof window === "undefined" || !mfrCode) return false;

      const targetPath = getProductDetailsPagePath(mfrCode);
      const origin = window.location.origin;
      const normalUrl = `${origin}${targetPath}`;

      try {
        const currentKiosk =
          typeof window !== "undefined"
            ? JSON.parse(sessionStorage.getItem("Kiosk-login") || "{}")
            : {};
        const kioskEmail = email || currentKiosk?.email;
        const kioskPhone = currentKiosk?.phone;

        if (kioskEmail || kioskPhone) {
          const resp = await requestSigninWithLink({
            email: kioskEmail,
            phone: kioskPhone,
          });
          const signin_token = resp?.signin_token || resp?.data?.signin_token;

          if (signin_token) {
            const decrypted = decryptSigninToken(signin_token);
            if (decrypted) {
              const verifyLink = buildVerifyUrl(
                decrypted,
                `?page=product/${mfrCode}`,
              );
              const fullVerifyUrl = verifyLink?.startsWith("http")
                ? verifyLink
                : `${origin}${verifyLink}`;

              setSharePageUrl(fullVerifyUrl);
              setQrImageUrl(collectionQRCodeGenerator(fullVerifyUrl));
              setQrTargetUrl(fullVerifyUrl);
              setShareContext("vto");
              setShowShareProductDetails(true);
              return true;
            }
          }
        }
      } catch (e) {
        console.error("Product auto-login QR build error", e);
      }

      setSharePageUrl(normalUrl);
      setQrImageUrl(collectionQRCodeGenerator(normalUrl));
      setQrTargetUrl(normalUrl);
      setShareContext("vto");
      setShowShareProductDetails(true);
      return true;
    },
    [productMfrCode],
  );

  const handleShareClick = useCallback(async () => {
    const kioskLoginUserId = kioskLogin?.user_id;
    if (!kioskLoginUserId && hasKioskAccess) {
      setShowShareProductDetails(false);
      setGuestPopupAction("share");
      setIsPopupShow(true);
      dispatch(GuestPopUpShow(true));
      return;
    }

    const didBuildShareLink = await buildShareAutoLoginLink();
    if (didBuildShareLink) {
      setShareContext("product");
      return;
    }

    setShareContext("product");
    setShowShareProductDetails((show) => !show);
  }, [buildShareAutoLoginLink, dispatch, kioskLogin?.user_id, hasKioskAccess]);

  useEffect(() => {
    if (!mfr_code) return;
    const storedImage = localStorage.getItem("pdp_image") || "";

    dispatch(
      fetchProductDetails({
        mfr_code,
        image: storedImage,
        cache: hasKioskAccess,
      }),
    );
  }, [mfr_code, dispatch, hasKioskAccess]);

  useEffect(() => {
    if (!mfr_code) return;
    return () => {
      localStorage.removeItem(`pdp_image`);
    };
  }, [mfr_code]);
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

  const qrCodeGeneratorURL = useMemo(
    () => collectionQRCodeGenerator(productDetailsPagePath),
    [productDetailsPagePath],
  );

  useEffect(() => {
    if (
      hasKioskAccess ||
      typeof window === "undefined" ||
      !productDetailsPagePath
    ) {
      return;
    }

    setSharePageUrl(`${window.location.origin}${productDetailsPagePath}`);
  }, [hasKioskAccess, productDetailsPagePath]);

  const shareQrCodeImage = useMemo(() => {
    try {
      return sharePageUrl
        ? collectionQRCodeGenerator(sharePageUrl)
        : qrCodeGeneratorURL;
    } catch (e) {
      return qrCodeGeneratorURL;
    }
  }, [sharePageUrl, qrCodeGeneratorURL]);

  if (fetchProductLoading) {
    return <PDPPageSkeleton />;
  }

  return (
    <div
      className={`relative w-full   pb-20 lg:pb-14 ${hasKioskAccess ? "px-8" : ""} `}
    >
      <div className=" " />
      <div className={`${pdpLayoutStyles.pageWidthContainer} relative`}>
        <div
          className={`flex flex-col bg-white w-full self-center ${!hasKioskAccess ? "lg:pt-10 pt-7 " : ""} gap-3.5 lg:gap-8 `}
        >
          {hasKioskAccess && (
            <div className="flex h-12  items-start sticky py-7  z-30 top-0 bg-white">
              <GoBack />
              <AuthInput styles={"mb-0 w-fit pr-7"} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-6  lg:gap-8 items-start">
            <div className="flex flex-col gap-4 xl:sticky xl:top-6">
              <ProductGallery
                productDetails={productDetails}
                fetchProductImage={fetchProductImage}
                discountPer={discountPer}
                storeData={storeData}
                kioskLogin={kioskLogin}
                hasKioskAccess={hasKioskAccess}
                buildProductAutoLoginQr={buildProductAutoLoginQr}
                setIsPopupShow={setIsPopupShow}
                setGuestPopupAction={setGuestPopupAction}
                collection={collection}
                authUser={authUser}
                pdploader={pdploader}
              />
            </div>
            {productDetails && (
              <div className="flex flex-col  w-full   bg-white/95 ">
                <ProductOverview
                  productDetails={productDetails}
                  authUser={authUser}
                  isUserLogin={isUserLogin}
                  onEditProduct={() => handleOpenProductModal(true)}
                  heartRedProduct={heartRedProduct}
                  showHeartWishlist={showHeartWishlist}
                  onAddToWishlist={() =>
                    onAddSelectedProductsToCollection(null, {
                      isSave: true,
                    })
                  }
                  kioskLogin={kioskLogin}
                  authUserId={authUserId}
                  showShareProductDetails={showShareProductDetails}
                  shareContext={shareContext}
                  sharePageUrl={sharePageUrl}
                  setShowShareProductDetails={setShowShareProductDetails}
                  shareQrCodeImage={shareQrCodeImage}
                  onShareClick={handleShareClick}
                  brandsDetails={brandsDetails}
                />

                <ProductActions
                  brandsDetails={brandsDetails}
                  storeData={storeData}
                  productDetails={productDetails}
                  collection={collection}
                  authUserId={authUserId}
                  hasKioskAccess={hasKioskAccess}
                  isUserLogin={isUserLogin}
                  authUser={authUser}
                  storeId={store_id}
                />

                <ProductInformation
                  productDetails={productDetails}
                  storeData={storeData}
                />
                <ProductBrandDetails brandsDetails={brandsDetails} />
              </div>
            )}
          </div>
        </div>
      </div>
      <GuestUserPopUp
        isOpen={isPopupShow}
        setIsOpen={setIsPopupShow}
        storeName={storeData?.store_name}
        isUserLogin ={ !isUserLogin ? true : false}
        persistKioskLogin
        onSuccess={async ({ userId, email, phone }) => {
          try {
            if (guestPopupAction === "share") {
              const didBuildShareLink = await buildShareAutoLoginLink({
                userId,
                email,
                phone,
              });
              setShareContext("product");
              if (!didBuildShareLink) setShowShareProductDetails(true);
            } else if (guestPopupAction === "vto") {
              const mfrCode = productDetails?.mfr_code;
              if (mfrCode) {
                await buildProductAutoLoginQr({ mfrCode, email });
              }
            } else {
              onAddSelectedProductsToCollection(null, {
                isSave: true,
                isGuestSubmit: true,
                userId,
                email,
              });
            }
          } catch (err) {
            console.error("Guest onSuccess flow failed", err);
            if (guestPopupAction === "share") setShowShareProductDetails(true);
            if (guestPopupAction === "vto") {
              const mfrCode = productDetails?.mfr_code;
              if (mfrCode) {
                await buildProductAutoLoginQr({ mfrCode, email });
              }
            }
          } finally {
            setGuestPopupAction(null);
          }
        }}
        onSkip={() => setGuestPopupAction(null)}
      />
      <Modal
        headerText="Scan to open collection"
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
        }}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4">
          {qrImageUrl ? (
            <img
              src={qrImageUrl}
              alt="QR code"
              className="w-48 h-48 object-contain"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
              QR
            </div>
          )}
          {qrTargetUrl && (
            <div className="break-all text-center text-sm">
              <a
                href={qrTargetUrl}
                target="_blank"
                rel="noreferrer"
                className={
                  hasKioskAccess
                    ? "text-kiosk-primary hover:underline"
                    : "text-indigo-600 hover:underline"
                }
              >
                {qrTargetUrl}
              </a>
            </div>
          )}
        </div>
      </Modal>
      {showSessionPopup && (
        <KioskSessionPopup
          onStay={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default ProductDetails;
