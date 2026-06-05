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
import useKioskSessionReminder, { KioskSessionPopup } from "../../components/kiosk/useKioskSessionReminder";
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
  const { showSessionPopup, handleStayLoggedIn, handleLogout } = useKioskSessionReminder();

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

  // KioskSessionPopup is rendered in JSX below using showSessionPopup

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
        <KioskSessionPopup onStay={handleStayLoggedIn} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default KioskHome;
