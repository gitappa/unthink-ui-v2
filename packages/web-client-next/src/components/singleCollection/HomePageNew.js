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

import ai from "./images/aiimg.png";

import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import HeroSection from "./HeroSection";
import DealsAndTrends from "./DealsAndTrends";
import SplitDiscoverySection from "./SplitDiscoverySection";

const HomePageNew = () => {
  const [collection] = useSelector((state) => [
    state.influencer.collections.data,
  ]);
  const authUserCollections = useSelector(
    (state) => state.auth.user.collections,
  );
  console.log("authUserCollections", authUserCollections);

  



  



 
  // const videoContainerRef = useRef(null);

 
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
     <HeroSection im={im}/>

      <DealsAndTrends />

<SplitDiscoverySection/>
     

    </div>
  );
};

export default HomePageNew;
