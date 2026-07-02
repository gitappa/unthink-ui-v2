import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/scrollbar";
import HeroSection from "../../components/kiosk/HeroSection";
import BannerKisok from "../../components/kiosk/BannerKisok";
import QRsection from "../../components/kiosk/QRsection";
import { Spin } from "antd";
import useKioskSessionReminder, {
  KioskSessionPopup,
} from "../../components/kiosk/useKioskSessionReminder";
import { LookBookApiCall, TrendingApiCall } from "../../helper/serverAPIs";
import LoggedInInfo from "../../components/kiosk/components/LoggedInInfo";
import AuthInput from "../../components/kiosk/components/AuthInput";

const KioskHome = ({ props }) => {
   

 
  const userInfo = useSelector((state) => state.auth.user.data);
  const Tags = ["Social Media", "Look Books", "#Trending"];
  const [showTags, setShowTags] = useState(sessionStorage.getItem('selectedTag') ||  Tags[0]);
  const [products, setProducts] = useState([]);
  const [lookBooks,setLookBooks] = useState([])
  //   console.log("products", products);
  const dispatch = useDispatch();
  const [isUserLogin,storeData] = useSelector((state) => [state.auth.user.isUserLogin,state.store.data]);
  
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
        const lookBookResponse = await LookBookApiCall()
        setLookBooks(lookBookResponse?.data?.data)
        // console.log('lookBookResponse',lookBookResponse?.data?.data);
        
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
    <div className=" mx-auto w-full px-6 md:px-10 mt-4 ">
      {/* User Actions */}

      {/* Tag Buttons (pill-style tabs) */}
      <div className="flex items-center mb-3">
        <div className="w-full  flex items-center mx-auto">
          <div className="flex items-center rounded-full bg-kiosk-secondary w-full p-1">
            {Tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => { setShowTags(tag) , sessionStorage.setItem("selectedTag", tag)}}
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
     <AuthInput  styles='min-w-[272px] max-w-[272px]'/>
        </div>
      </div>
      <div className={`flex ${showTags === "Social Media" ? 'items-start' : 'items-center' } gap-3`}>
      {showTags === "Social Media" && 
      <>
      <div className="min-w-0 flex-1">
        <HeroSection storeData={storeData} />
      </div>
      <QRsection storeData={storeData} showTags={showTags}/>
      </>
      }
      </div>
      {showTags !== "Social Media" && (
        <div className="">
        <BannerKisok products={products} Tags={showTags} lookBooks={lookBooks} storeData={storeData}/>
        </div>
      )}
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
