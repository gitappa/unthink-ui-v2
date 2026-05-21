import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import Image from "next/image";
const HeroSection = ({ im, collectionData }) => {
  const videoUrlRaw = "https://www.youtube.com/watch?v=hrAOIj01B6E";
  let videoUrl = typeof videoUrlRaw === "string" ? videoUrlRaw : "";
  const thumbnailImage = collectionData?.thumbnail_image || collectionData?.image;
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const videoContainerRef = useRef(null);
  const handlePlayClick = () => setIsPlaying(true);
  const handlePauseClick = () => setIsPlaying(false);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const handleScroll = () => {
      if (videoContainerRef.current) {
        const rect = videoContainerRef.current.getBoundingClientRect();
        setIsVisible(rect.top >= 0 && rect.bottom <= window.innerHeight);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  return (
    <div className="relative mt-7">
      <div
        className="relative cursor-pointer"
        style={{ minHeight: "68vh", height: "700px" }}
        onClick={handlePlayClick}
        ref={videoContainerRef}
      >
        {isClient ? (
          videoUrlRaw ? (
            <ReactPlayer
              url={videoUrlRaw}
              playing={isPlaying}
              onPlay={handlePlayClick}
              onPause={handlePauseClick}
              muted={true}
              loop={true}
              width="100%"
              height="100%"
              playsinline
              controls={true}
              light={thumbnailImage || true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-lightgray-102">
              <p className="text-black-103">No video available</p>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-lightgray-102">
            <p className="text-black-103">Loading...</p>
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
              className="mySwipers"
              style={{ width: "100%" }}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                640: {
                  slidesPerView: 3,
                },
                768: {
                  slidesPerView: 4,
                },
                1024: {
                  slidesPerView: 5,
                },
                1380: {
                  slidesPerView: 6,
                },
              }}
            >
              {collectionData.product_lists?.map((collection, id) => (
                <SwiperSlide key={id}>
                  <Image
                    src={collection.image}
                    width={192}
                    height={192}
                    alt={collection.name || `slide-${id}`}
                    className="h-48 w-48 rounded-xl shadow-md object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection