import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import im from "./images/pppp.webp";
import img1 from "./images/img1.jpg";
import men from "./images/men.jpg";
import women from "./images/women.jpg";
import womenBag from "./images/womenBag.jpg";
import fashionBg from "./images/fashionVideo.jpg";

import qrcode from "./images/qrcode.svg";
import legs from "./images/shoes.jpg";
import robo from "./images/robo.jpg";

import menimage from "./images/menimage.jpg";
import menimage2 from "./images/menImage2.jpg";
import menimage3 from "./images/menimage3.jpg";
import ai from "./images/aiimg.png";

import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';

const HomePageNew = () => {
  const [collection] = useSelector((state) => [
    state.influencer.collections.data,
  ]);
  const authUserCollections = useSelector(
    (state) => state.auth.user.collections,
  );
  console.log("authUserCollections", authUserCollections);

  const videoUrlRaw = "https://www.youtube.com/watch?v=hrAOIj01B6E";
  let videoUrl = typeof videoUrlRaw === "string" ? videoUrlRaw : "";

  // Extract actual video URL from tracking URL
  if (videoUrl.includes("dpholvw.net/click") && videoUrl.includes("url=")) {
    try {
      const urlParams = new URLSearchParams(videoUrl.split("?")[1]);
      const actualVideoUrl = urlParams.get("url");
      if (actualVideoUrl) {
        videoUrl = decodeURIComponent(actualVideoUrl);
      }
    } catch (error) {
      console.error("Error parsing video URL:", error);
    }
  }

  console.log("Collection:", collection);
  console.log("Video URL Raw:", videoUrlRaw);
  console.log("VideoURL", videoUrl);

  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const videoContainerRef = useRef(null);

  // Hydration-safe effect to set isClient
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if mobile device
  useEffect(() => {
    if (!isClient) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isClient]);

  // Check if the video container is visible in the viewport
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      if (videoContainerRef.current) {
        const rect = videoContainerRef.current.getBoundingClientRect();
        setIsVisible(rect.top >= 0 && rect.bottom <= window.innerHeight);
      }
    };

    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll); // Check on scroll

    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [isClient]);

  // const videoContainerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  // const handleMouseEnter = () => {
  //   if (!videoUrl) return;
  //   videoContainerRef.current?.play?.().catch(() => {});
  // };

  // const handleMouseLeave = () => {
  //   videoContainerRef.current?.pause?.();
  //   if (videoContainerRef.current) videoContainerRef.current.currentTime = 0; // optional: reset to start
  // };

  return (
    <div className="max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto     px-14">
      <div className="  relative mt-7">
        <div
          className=" relative"
          style={{ minHeight: "68vh", height: "700px" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isClient ? (
            videoUrlRaw ? (
              <ReactPlayer
                url={videoUrl}
                playing={isHovered} // Only play when hovered
                muted={true}
                loop={true}
                width="100%"
                height="100%"
                playsinline
                controls={false}
                light={true} // Don't load until play
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-600">No video available</p>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          <div className="absolute -bottom-14 w-full">
            <div className="pb-2">
              <Swiper
                scrollbar={{
                  hide: false,
                }}
                modules={[Scrollbar]}
                spaceBetween={10}
                slidesPerView={6}
                className="mySwiper"
                style={{ width: '100%', height: '120px' }}
              >
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>
                <SwiperSlide><Image src={im} className="h-25 w-24 rounded-xl" /></SwiperSlide>

              </Swiper>
              {/* <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" />
              <Image src={im} className="h-25 w-25 rounded-xl" /> */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-25 gap-4">
        <div className="grid grid-cols-2 text-white gap-3  border-gray-101  pr-2  w-504">
          <div className="bg-blue-100 flex flex-col rounded-lg border-2 border-blue-300 h-32 w-32 justify-center items-center">
            <Image src={menimage3} alt="" className="h-16 w-16 mb-1" />
            <p>MEN</p>
          </div>
          <div className="bg-blue-100 flex flex-col  rounded-lg border-2 border-blue-300 h-32 w-32  justify-center items-center">
            <Image src={menimage2} alt="" className="h-16 w-16 mb-1" />
            <p>Women</p>
          </div>
          <div className="bg-pink-200 flex flex-col rounded-lg border-2 border-pink-400 h-32 w-32  justify-center items-center">
            <Image src={menimage} alt="" className="h-16 w-16 mb-1" />
            <p>Accessories</p>
          </div>
          <div className="bg-pink-200 flex flex-col  rounded-lg border-2 border-pink-400 h-32 w-32  justify-center items-center ">
            <Image src={im} alt="" className="h-16 w-16 mb-1" />
            <p>Sale</p>
          </div>
        </div>
        <div className=" flex" style={{ height: '-webkit-fill-available' }}>
          <div className="w-[2px] bg-gray-101"></div>
        </div>

        <div className="w-full text-white">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 ">
            <div className="p-3 rounded-full border-2 border-violet-100 bg-violet-100">
              #SummerVideo
            </div>
            <div className="p-3 rounded-full border-2 border-white  bg-gradient-to-r from-purple-300 via-orange-400 to-red-300 ">
              #Cyber punk
            </div>
            <div className="p-3 rounded-full  border-2 border-yellow-102   bg-yellow-102">
              #EgoFriendly
            </div>
            <div className="p-3 rounded-full  border-2 border-green-400   bg-green-400">
              #EgoFriendly
            </div>
            <div className="p-3 rounded-full  border-2 border-slate-500 bg-slate-500">
              #SummerCors
            </div>
            <div className="p-3 rounded-full border-2 border-teal-500  bg-teal-500">
              #BrandStan
            </div>
          </div>
        </div>
      </div>

      <div className="  mt-20">
        <h2 className="text-4xl font-semibold ">DISCOVER HIDDEN TREASURES</h2>
        <div className="flex mt-6  h-700  gap-7 w-full">
          <div className="flex gap-4 w-full h-700 ">
            <div className="  w-full">
              <Image
                src={men}
                className=" w-full rounded-xl mb-3 "
                style={{ height: "55%" }}
              />
              <Image
                src={women}
                className="  w-full rounded-xl "
                style={{ height: "40%" }}
              />
            </div>

            <div className="  w-full">
              <Image
                src={women}
                className=" w-full rounded-xl   "
                style={{ height: "40%" }}
              />
              <Image
                src={img1}
                className=" w-full rounded-xl mt-3"
                style={{ height: "55%" }}
              />
            </div>
          </div>

          <div className="w-full text-white">
            <div className=" flex  gap-4 relative   border-secondary border-3 rounded-xl bg-gradient-to-r from-gray-101 to-secondary p-5 ">
              <div className="w-full ">
                <p>
                  Lorem ipsum dolor sit amet c Archit s mollitia quas cumque
                  quam aut. Cumque ea sint est vel accusantium. Sapiente fuga
                  cupiditate saepe placeat mollitia.
                </p>
                <Image
                  src={qrcode}
                  alt="qrcode"
                  className="rounded-xl mt-3 w-25 h-25 "
                  width={100}
                  height={100}
                />
                <p>Scan to Join</p>
              </div>
              <div className="w-full">
                <h3 className="text-3xl font-semibold">CHALLENGE & EARN</h3>
                <Image
                  src={legs}
                  alt="show"
                  className="rounded-xl mt-3 w-40 h-40 absolute bottom-0 right-0"
                />
              </div>
            </div>
            <div className="bg-gradient-to-r relative mt-4  flex gap-5 from-purple-102 rounded-xl p-3 to-purple-101  border-purple-102 border-3 ">
              <Image
                src={robo}
                alt="ai stylist "
                className="  mt-3 w-25 h-25 "
              />
              <h3 className="text-3xl font-semibold">ASK AI STYLIST </h3>
              <Image
                src={ai}
                width={30}
                height={30}
                alt="ai stylist "
                className="  mt-3 w-7 h-7 absolute right-3 top-2 "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageNew;
