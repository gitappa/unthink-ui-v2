import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInfluencerCollection } from "../../pageComponents/Influencer/redux/actions";
import ProductCard from "../singleCollection/ProductCard";
import {
  filterAvailableProductList,
  filterProductListBySelectedTags,
} from "../../helper/utils";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import profilebanner from "../../images/package.jpg";
import { Spin } from "antd";
import BannerImage from "./BannerImage";
import ShareOptions from "../../pageComponents/shared/shareOptions";
import share_icon from "../../images/profilePage/share_icon.svg";
import { collectionQRCodeGenerator, getBlogCollectionPagePath, buildAutoLoginPagePath } from "../../helper/utils";
import { requestSigninWithLink, decryptSigninToken, buildVerifyUrl } from "../../helper/autoLogin";
import useKioskSessionReminder, { KioskSessionPopup } from "./useKioskSessionReminder";
import GuestUserPopUp from "../../pageComponents/Auth/GuestUserPopUp";
import { GuestPopUpShow } from "../../pageComponents/Auth/redux/actions";

const CollectionPage = ({ params }) => {
  // console.log(params);
  const dispatch = useDispatch();
  const [isTagsShowMoreActive, setIsTagsShowMoreActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const singleCollectionKiosk = useSelector(
    (state) => state.auth.user.singleCollections.data,
  ); // Update based on your Redux store structure
  const [isUserLogin, storeData] = useSelector((state) => [
    state.auth.user.isUserLogin,
    state.store.data,
  ]);
  const handleTagClick = useCallback((value) => {
    setActiveCategory(value);
    setSelectedTags(value === "All" ? [] : [value]);
  }, []);

  const productsData = useMemo(() => {
    if (!singleCollectionKiosk?.product_lists) return [];

    let list = filterAvailableProductList(singleCollectionKiosk.product_lists);

    if (selectedTags.length) {
      list = filterProductListBySelectedTags(
        list,
        selectedTags,
        singleCollectionKiosk.tag_map,
      );
    }

    return list;
  }, [
    singleCollectionKiosk?.product_lists,
    singleCollectionKiosk?.tag_map,
    selectedTags,
  ]);
  // console.log('productsData',productsData);

  const [showShareProductDetails, setShowShareProductDetails] = useState(false);
  const [sharePageUrl, setSharePageUrl] = useState("");
  
  const [qrUrl, setQrUrl] = useState("");
  console.log('sharePageUrl',qrUrl);
  const [isPopupShow, setIsPopupShow] = useState(false);
  const { showSessionPopup, handleStayLoggedIn, handleLogout } =
    useKioskSessionReminder({ time: 60 * 1000 });

  const openShareOptions = useCallback(() => {
    setShowShareProductDetails((show) => !show);
  }, []);

  const handleShareClick = useCallback(() => {
    const isKioskLogin = sessionStorage.getItem("Kiosk-login");
    // console.log('isKioskLogin',!isKioskLogin);
    // console.log('isUserLogin',isUserLogin);
    
    
    if ( isUserLogin && !isKioskLogin) {
      setShowShareProductDetails(false);
      setIsPopupShow(true);
      // console.log('fdfdfdfd');
      
      dispatch(GuestPopUpShow(true));
      return;
    }
      // console.log('fdfdfdfd');

    openShareOptions();
  }, [dispatch, isUserLogin, openShareOptions]);


  const collectionPagePath = useMemo(() => {
    if (!singleCollectionKiosk) return "";
    try {
      return getBlogCollectionPagePath(
        singleCollectionKiosk.user_name,
        singleCollectionKiosk.path,
        singleCollectionKiosk._id,
        singleCollectionKiosk.user_id,
        singleCollectionKiosk.status,
        singleCollectionKiosk.hosted_stores,
        singleCollectionKiosk.collection_theme,
      );
    } catch (e) {
      return "";
    }
  }, [singleCollectionKiosk]);

  const qrCodeGeneratorURL = useMemo(() => {
    if (!collectionPagePath) return "";
    return collectionQRCodeGenerator(collectionPagePath);
  }, [collectionPagePath]);

  useEffect(() => {
    setQrUrl(qrCodeGeneratorURL);
  }, [qrCodeGeneratorURL]);
  
  // this page is a collection page
  const fromCollection = true;

  // console.log("singleCollectionKiosk", singleCollectionKiosk.product_lists);
  const tagsToShow = useMemo(() => {
    const allTag = ["All"];
    const allTags = singleCollectionKiosk.tags
      ? allTag.concat(singleCollectionKiosk.tags)
      : allTag;
    return isTagsShowMoreActive ? allTags : allTags;
  }, [singleCollectionKiosk.tags, isTagsShowMoreActive]);

  useEffect(() => {
    if (params?.collection_name) {
      dispatch(
        getInfluencerCollection({
          collection_id: params.collection_name,
          path: params.collection_name,
          isStoreHomePage: false,
          product_sort_by: undefined,
          product_sort_order: undefined,
        }),
      );
    }
  }, [params?.collection_name, dispatch]);
  //   console.log('colleztctionData',singleCollectionKiosk);
  const productCardKiosk = (productdata) => {
    // console.log(productdata);
    return <ProductCard product={productdata} bannerImage />;
  };
  // const DummyImg =
  //   "https://cdn.unthink.ai/img/unthink_ai/DALL%C2%B7E%202024-11-22%2013.19.32%20-%20A%20stylish%20banner%20image%20for%20a%20website%20named%20%27dothelook%2C%27%20designed%20to%20reflect%20themes%20of%20both%20fashion%20and%20home%20products.%20The%20banner%20features%20a%20gradient%20b_giwegha.webp";
  useEffect(() => {
    let mounted = true;
    const makeUrls = async () => {
      if (typeof window === "undefined" || !collectionPagePath) return;
      const originPrefix = `${window.location?.origin}`;
      // default non-auto-login URL
      const normalUrl = `${originPrefix}${collectionPagePath}`;

      // For kiosk or store assistant flows we want auto-login URLs embedded in the QR/share
      try {
        // Determine email to request signin link for. Prefer store assistant/kiosk email from storeData if present
        const kioskEmail = JSON.parse(sessionStorage.getItem('Kiosk-login') || '{}')?.email; 
        // console.log('kioskEmail',kioskEmail);
         
        if (kioskEmail) { 
          const resp = await requestSigninWithLink(kioskEmail);
          const signin_token = resp?.signin_token || resp?.data?.signin_token;
          // console.log('signin_token',signin_token);
          
          if (signin_token) { 
            const decrypted = decryptSigninToken(signin_token); 
            if (decrypted) {
              // Build verify link to collection page
              const verifyLink = buildVerifyUrl(decrypted, `collection/${singleCollectionKiosk?.path || ''}`.replace(/\/+/, '/'));
              console.log('verifyLink',verifyLink);
              
              if (mounted) {
                setSharePageUrl(`${originPrefix}${verifyLink}`);
                setQrUrl(collectionQRCodeGenerator(`${originPrefix}${verifyLink}`));
              }
              return;
            }
          }
        }
      } catch (e) {
        // ignore and fallback
        console.error('auto-login build error', e);
      }

      // fallback
      if (mounted) {
        setSharePageUrl(normalUrl);
        setQrUrl(qrCodeGeneratorURL);
      }
    };

    makeUrls();

    return () => {
      mounted = false;
    };
  }, [isPopupShow]);
    
  if (!singleCollectionKiosk || singleCollectionKiosk.length === 0) {
    return (
      <div className="min-h-screen flex mt-3 justify-center">
        <Spin size="large" className="pink-spinner" />
      </div>
    );
  }
  return (
    <div className="p-8 md:p-12 bg-white min-h-screen">
      <button
        className="group text-gray-500 flex w-fit items-center gap-2 rounded-full   py-2 button-kiosk font-medium   transition "
        onClick={() => window.history.back()}
      >
        <span className=" leading-none flex transition group-hover:-translate-x-0.5">
          <ArrowLeftOutlined />
        </span>
        <span className="capitalize">Go back</span>
      </button>
      <div className="sticky top-0 py-2 mx-1 bg-white
       z-20 ">

      {/* Header */}
      <div className="mb-3 lg:mb-8 flex justify-between items-start">
        {/* <p className="text-gray-400 text-sm lg:text-base font-semibold tracking-widest mb-3">
          JEWEL GENIE
        </p> */}
        <div>

        <h1 className="h1-kiosk font-bold text-black mb-0 lg:mb-2">
          {singleCollectionKiosk.collection_name}
        </h1>
        
        <p className="text-gray-500 text-base lg:mb-0 mb-2">
          {singleCollectionKiosk?.product_lists?.length} pieces
        </p>
        </div>
           <div className="relative flex justify-between  h-8 lg:h-10 w-8 lg:w-10 ">
                        {showShareProductDetails && (
                          <ShareOptions
                            url={sharePageUrl}
                            setShow={setShowShareProductDetails}
                            onClose={() => setShowShareProductDetails(false)}
                            isOpen={showShareProductDetails}
                            qrCodeGeneratorURL={qrUrl}
                            collection={singleCollectionKiosk}
                            fromCollection={fromCollection}
                          />
                        )}
                        {/* {sharePageUrl && ( */}
                          <button
                            className="flex h-8 lg:h-10 w-8 lg:w-10  items-center justify-center rounded-full border border-[#e0d9ff] bg-white hover:bg-[#f2eeff]"
                            onClick={handleShareClick}
                          >
                            <img
                              className="cursor-pointer lg:h-6 lg:w-6 h-5 w-5"
                              src={share_icon}
                              preview={false}
                            />
                          </button>
                        {/* )} */}
                      </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 mb-5 lg:mb-12 flex-wrap">
        {tagsToShow.map((tag, i) => (
          <button
            key={i}
            onClick={() => handleTagClick(tag)}
            className={`${
              activeCategory === tag
                ? "bg-black text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            } lg:px-5 px-3 py-2 lg:py-3 rounded-full font-semibold text-[12px] lg:text-sm transition duration-200`}
          >
            {tag}
          </button>
        ))}
      </div>
      </div>

      {/* Product Grid Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
        {productsData?.map((item) => (
          <div
            key={item}
            className=" rounded-lg  flex items-center justify-center"
          >
            {productCardKiosk(item)}
          </div>
        ))}

      </div>
      <BannerImage src={profilebanner?.src} alt="profilebanner" className="lg:mt-11 mt-5" />
        <GuestUserPopUp
          isOpen={isPopupShow}
          setIsOpen={setIsPopupShow}
          storeName={storeData?.store_name || singleCollectionKiosk?.store_name}
          persistKioskLogin
          onSuccess={() => setShowShareProductDetails(true)}
        />
        {showSessionPopup && (
                    <KioskSessionPopup onStay={handleStayLoggedIn} onLogout={handleLogout} />
                  )}
    </div>
  );
};

export default CollectionPage;
