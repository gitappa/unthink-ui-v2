import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import HeroSection from "../../components/kiosk/HeroSection";
import BannerKisok from "../../components/kiosk/BannerKisok";
import QRsection from "../../components/kiosk/QRsection";
import { Spin } from "antd";
import useKioskSessionReminder, {
  KioskSessionPopup,
} from "../../components/kiosk/useKioskSessionReminder";
import { SIGN_IN_EXPIRE_DAYS } from "../../constants/codes";
import {
  checkAndGenerateUserId,
  clearStorages,
  generateSessionId,
} from "../../helper/utils";
import { logoutVenlyUser } from "../../helper/venlyUtils";
import { getUserCollectionsReset, getUserInfo } from "../Auth/redux/actions";
import { is_store_instance } from "../../constants/config";
import { fetchCategoriesReset } from "../categories/redux/actions";
import { TrendingApiCall } from "../../helper/serverAPIs";
import LoggedInInfo from "../../components/kiosk/components/LoggedInInfo";
import AuthInput from "../../components/kiosk/components/AuthInput";

const KioskHome = ({ props }) => {
   

  const authUserCollections = useSelector(
    (state) => state.auth.user.collections.data,
  );
  const userInfo = useSelector((state) => state.auth.user.data);
  const Tags = ["Social Media", "Look Books", "#Trending"];
  const [showTags, setShowTags] = useState(Tags[0]);
  const [products, setProducts] = useState([]);
  //   console.log("products", products);
  const dispatch = useDispatch();
  const isUserLogin = useSelector((state) => state.auth.user.isUserLogin);

  // session reminder popup state and timer ref
  const { showSessionPopup, handleStayLoggedIn, handleLogout } =
    useKioskSessionReminder();


  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await TrendingApiCall();
        // console.log('response',response.data.data);
        const data =
          response && response.data && response.data.data
            ? response.data.data
            : [];
        const shuffledData = [...data].sort(() => Math.random() - 0.5);
        setProducts(shuffledData);
        // console.log('shuffledData', shuffledData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSocialMedia();
  }, []);

  // KioskSessionPopup is rendered in JSX below using showSessionPopup

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="min-h-screen mt-4 flex items-start justify-center">
        <Spin size="large" className="pink-spinner" />
      </div>
    );
  }

  return (
    <div className=" mx-auto w-full px-6 md:px-14 mt-10">
      {/* User Actions */}
     <AuthInput />

      {/* Tag Buttons (pill-style tabs) */}
      <div className="flex items-center mb-8">
        <div className="w-full  mx-auto">
          <div className="flex items-center rounded-full bg-kiosk-secondary p-1">
            {Tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => setShowTags(tag)}
                aria-pressed={showTags === tag}
                className={`flex-1 text-center button-kiosk px-3 md:px-5 py-2 font-semibold transition rounded-full ${
                  showTags === tag
                    ? "bg-white text-black shadow-md"
                    : "text-gray-600 hover:text-black"
                } ${i > 0 ? "border-l border-gray-400" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      {showTags === "Social Media" && <HeroSection />}
      {showTags !== "Social Media" && (
        <BannerKisok products={products} Tags={Tags} />
      )}
      <QRsection />

      {/* Session reminder popup for kiosk users (floating bottom-right) */}
      {showSessionPopup && (
        <KioskSessionPopup
          onStay={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}

      {/* Logged in info (fixed bottom-right) */}
   
      <LoggedInInfo userInfo={userInfo} />
    </div>
  );
};

export default KioskHome;
