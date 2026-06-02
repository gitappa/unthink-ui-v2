import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import HeroSection from "./HeroSection";
import BannerKisok from "../kiosk/BannerKisok";
import QRsection from "../kiosk/QRsection";
import { Spin } from "antd";
import { SIGN_IN_EXPIRE_DAYS } from "../../constants/codes";
import { checkAndGenerateUserId, clearStorages, generateSessionId } from "../../helper/utils";
import { logoutVenlyUser } from "../../helper/venlyUtils";
import { getUserCollectionsReset, getUserInfo } from "../../pageComponents/Auth/redux/actions";
import { is_store_instance } from "../../constants/config";
import { fetchCategoriesReset } from "../../pageComponents/categories/redux/actions";

const HomePageNew = ({ blogCollectionPage }) => {
  const [collectionData] = useSelector((state) => [
    state.influencer.collections.data,
  ]);
  //   console.log("collectionDataz", collectionData);

  const authUserCollections = useSelector(
    (state) => state.auth.user.collections.data,
  );
  const Tags = ["Social Media", "Look Books", "#Trending"];
  const [showTags, setShowTags] = useState(Tags[0]);
  const [products, setProducts] = useState([]);
  //   console.log("products", products);
  const dispatch = useDispatch();

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
  const onSignOut = () => {
      Cookies.set("isGuestLoggedIn", false, { expires: SIGN_IN_EXPIRE_DAYS });
      localStorage.removeItem("adminRolePopupShown", "false");
      // Cookies.set('isGuestSkip', false, { expires: SIGN_IN_EXPIRE_DAYS });
      clearStorages();
      checkAndGenerateUserId(); // generating user id again for guest user after sign out
      generateSessionId(); // generating new session id for guest user after sign out
      // trackApi(); // generate the new user_id for the guest user and add it in the cookie/storage as tid
      // showMenu && setShowMenu(false);
      try {
        logoutVenlyUser();
      } catch {
        console.log("wallet error");
      }
  
      dispatch(getUserCollectionsReset());
  
      setTimeout(() => {
        dispatch(getUserInfo());
        // navigate(is_store_instance ? "/" : "/store");
        dispatch(fetchCategoriesReset()); // clearing fetched categories
      }, 0);
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
{/* <button onClick={()=>onSignOut()} className="text-end w-full mb-6 " >Sign out </button> */}
      {/* Sign Out Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => onSignOut()}
          className="group relative px-4 py-1.5 text-sm font-medium text-gray-700 border-2 border-gray-300 rounded-full hover:border-gray-400 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          aria-label="Sign out from your account"
        >
          <span className="absolute inset-0 bg-linear-to-r from-gray-100 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          Sign Out
        </button>
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
      {showTags === "Social Media" && (
        <HeroSection   products={products} />
      )}
      {showTags !== "Social Media" && (
        <BannerKisok products={products} Tags={Tags} />
      )}
      <QRsection />
    </div>
  );
};

export default HomePageNew;
