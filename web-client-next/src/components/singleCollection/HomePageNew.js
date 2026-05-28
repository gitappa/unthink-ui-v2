import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import im from "./images/pppp.webp";

import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import HeroSection from "./HeroSection";
import BannerKisok from "../kiosk/BannerKisok";
import QRsection from "../kiosk/QRsection";
import { Spin } from "antd";

const HomePageNew = ({ blogCollectionPage }) => {
  const [collectionData] = useSelector((state) => [
    state.influencer.collections.data,
  ]);
//   console.log("collectionDataz", collectionData);

  const authUserCollections = useSelector(
    (state) => state.auth.user.collections.data,
  );

  const [products, setProducts] = useState([]);
//   console.log("products", products);

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
  if(!Array.isArray(products) || products.length === 0 ){
    return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" className="pink-spinner" />
    </div>
    )}

  return (
    <div className=" mx-auto w-full px-6 md:px-14">
      <HeroSection im={im} products={products} />
      <BannerKisok products={products} />
      <QRsection />
    </div>
  );
};

export default HomePageNew;
 