import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import HeroSection from "../../components/singleCollection/HeroSection";
import BannerKisok from "../../components/kiosk/BannerKisok";
import QRsection from "../../components/kiosk/QRsection";
import { Spin } from "antd";
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
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const timerRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [emailPhone, setEmailPhone] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://auraprod.unthink.ai/user/collections/fetch_collections/?user_id=173081113277330&store=dothelook&product_limits=12&view=admin&ipp=15&current_page=0",
      );

      const json = await res.json();
      // store in state
      setProducts(json.data);

      //   console.log(json.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // start session reminder timer if Kiosk-login cookie exists and user is logged in
  const startSessionTimer = () => {
    // clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const cookie = Cookies.get("Kiosk-login");
    if (!cookie || !isUserLogin) return;

    // show popup every 1 minute
    timerRef.current = setInterval(() => {
      // only show if cookie still exists and user remains logged in
      if (Cookies.get("Kiosk-login") && isUserLogin) {
        setShowSessionPopup(true);
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 30 * 1000);
  };

  // Ensure timer starts on mount if kiosk cookie exists
  useEffect(() => {
    startSessionTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLogin]);

  const handleStayLoggedIn = () => {
    const cookieVal = Cookies.get("Kiosk-login");
    if (cookieVal) {
      // renew cookie expiry (keep same value)
      Cookies.set("Kiosk-login", cookieVal, { expires: 1 });
    }
    setShowSessionPopup(false);
    // restart timer
    startSessionTimer();
  };

  const handleLogout = async () => {
    // remove kiosk cookie
    Cookies.remove("Kiosk-login");

    // clear kiosk/session related storages
    try {
      clearStorages();
    } catch (e) {
      // ignore
    }

    // logout venly user if applicable
    try {
      await logoutVenlyUser();
    } catch (e) {
      // ignore
    }

    // dispatch resets for related redux slices
    try {
      dispatch(getUserCollectionsReset());
      dispatch(fetchCategoriesReset());
    } catch (e) {
      // ignore
    }

    setShowSessionPopup(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="min-h-screen mt-4 flex items-start justify-center">
        <Spin size="large" className="pink-spinner" />
      </div>
    );
  }

  return (
    <div className=" mx-auto w-full px-6 md:px-14 mt-14">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
               <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
        
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-48 z-50">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              Wishlist
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Cart
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Try on
            </button>
          </div>
        )}
      </div>

      {/* Tag Buttons (pill-style tabs) */}
      <div className="flex items-center mb-8">
        <div className="w-full  mx-auto">
          <div className="flex items-center rounded-full bg-gray-200/60 p-1">
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
      {showTags === "Social Media" && <HeroSection products={products} />}
      {showTags !== "Social Media" && (
        <BannerKisok products={products} Tags={Tags} />
      )}
      <QRsection />

      {/* Session reminder popup for kiosk users (floating bottom-right) */}
      {showSessionPopup && (
        <div className="fixed top-5 right-6 z-50">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[340px] max-w-full flex items-start gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Still here?Let's keep Shopping</h3>
              <p className="text-xs text-gray-600">Your kiosk session is active. Do you want to stay logged in?</p>
              <div className="mt-3 flex gap-2">
                <button
                  className="flex-1 px-3 py-1 max-w-[150px] rounded-2xl bg-gray-600/60 text-white text-sm hover:bg-gray-500"
                  onClick={handleStayLoggedIn}
                >
                  Stay Logged In
                </button>
                <button
                  className="px-3 py-1 rounded-2xl bg-red-600 text-white text-sm hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logged in info (fixed bottom-right) */}
      <div className="fixed bottom-5 right-5 z-50 border border-gray-200 bg-gray-200/90 rounded-full px-6 py-3 shadow-sm cursor-auto transition-shadow duration-300">
        <p className="text-sm font-semibold text-black">
          👤 Logged in as:{" "}
          <span className=" ">
            {userInfo?.user_name || userInfo?.email || "Guest User"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default KioskHome;
