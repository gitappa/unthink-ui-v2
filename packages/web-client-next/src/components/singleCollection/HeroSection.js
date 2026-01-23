import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
 import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import Image from "next/image";

const HeroSection = ({im}) => {
    const videoUrlRaw = "https://www.youtube.com/watch?v=hrAOIj01B6E";
  let videoUrl = typeof videoUrlRaw === "string" ? videoUrlRaw : "";
     const [isClient, setIsClient] = useState(false);
    //   const videoContainerRef = useRef(null);

       const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const videoContainerRef = useRef(null);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

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
    
  return (
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
                className="mySwipers "
                style={{ width: "100%" }}
                breakpoints={{
                  0: {
                    slidesPerView: 2, // mobile
                  },
                  640: {
                    slidesPerView: 3, // sm
                  },
                  768: {
                    slidesPerView: 4, // md
                  },
                  1024: {
                    slidesPerView: 5, // lg
                  },
                  1280: {
                    slidesPerView: 6, // xl
                  },
                }}
              >
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={im} className="h-52 w-48 rounded-xl" />
                </SwiperSlide>
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
  )
}

export default HeroSection