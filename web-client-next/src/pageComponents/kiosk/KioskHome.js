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
      {/* User Info Display */}
      <div className="flex justify-end items-center mb-6 gap-4">
        <div className=" border border-gray-200 bg-gray-200/60 rounded-full px-6 py-3 shadow-sm cursor-auto transition-shadow duration-300">
          <p className="text-sm font-semibold ">
            👤 Logged in as:{" "}
            <span className=" ">
              {userInfo?.user_name || userInfo?.email || "Guest User"}
            </span>
          </p>
        </div>
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
    </div>
  );
};

export default KioskHome;
