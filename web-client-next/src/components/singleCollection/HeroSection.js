import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import Image from "next/image";
const HeroSection = ({ im, products }) => {
  const collectiondata = products?.find(data=>data?.collection_name === 'Brand JWELX')
  console.log('collectiondatas',collectiondata);

  // const videoUrlRaw = "https://www.youtube.com/watch?v=hrAOIj01B6E";
  const thumbnailImage = collectiondata?.thumbnail_image || collectiondata?.image;
  const [isClient, setIsClient] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const videoContainerRef = useRef(null);
  const handlePlayClick = () => setIsPlaying(true);
  const handlePauseClick = () => setIsPlaying(false);
  
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
    const node = videoContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry.intersectionRatio >= 0.5;
        setIsVisible(visible);
        setIsPlaying(visible);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isClient]);

  return (
    <div className="relative mt-7 mb-28">
      <div
        className="relative cursor-pointer"
        style={{ minHeight: "68vh", height: "700px" }}
        onClick={handlePlayClick}
        ref={videoContainerRef}
      >
        {isClient ? (
           collectiondata?.video_url ? (
            <ReactPlayer
              url={ collectiondata?.video_url}
              playing={isPlaying}
              onPlay={handlePlayClick}
              onPause={handlePauseClick}
              muted={true}
              loop={true}
              width="100%"
              height="100%"
              playsinline
              controls={true}
              // config={{
              //   youtube: {
              //     playerVars: {
              //       autoplay: 1,
              //       mute: 1,
              //       playsinline: 1,
              //     },
              //   },
              // }}
              light={isPlaying ? false : (thumbnailImage || false)}
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
              {collectiondata?.product_lists?.map((collection, id) => (
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