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

const KioskHome = ({ blogCollectionPage }) => {
  const [collectionData] = useSelector((state) => [
    state.influencer.collections.data,
  ]);
  //   console.log("collectionDataz", collectionData);

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [emailPhone, setEmailPhone] = useState("");

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
      <div className="flex justify-end items-center mb-6 gap-4 relative">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="email/phone number"
            value={emailPhone}
            onChange={(e) => setEmailPhone(e.target.value)}
            className="outline-none border-none bg-transparent text-sm w-40 text-black placeholder-gray-700"
          />
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="ml-2 bg-black text-white p-2 rounded-full flex items-center justify-center w-8 h-8"
          >
            {/* User SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-48 z-50">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              Wishlist
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              Cart
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Try on
            </button>
          </div>
        )}
      </div>

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
