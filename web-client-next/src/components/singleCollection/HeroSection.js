import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
const HeroSection = ({ im, products }) => {
  const router = useRouter();
  const collectiondata = products?.find(data => data?.collection_name === 'Brand JWELX')
  // console.log('collectiondatas', collectiondata);

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
              url={collectiondata?.video_url}
              playing={isPlaying}
              onPlay={handlePlayClick}
              onPause={handlePauseClick}
              muted={true}
              loop={true}
              width="100%"
              height="100%"
              playsinline
              controls={false}
              config={{
                youtube: {
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    disablekb: 1
                  }
                }
              }}
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

        <div className="absolute -bottom-16 w-full">
          <div className="relative pb-2">
            {/* subtle ash gradient behind the swiper cards */}
            <div
              aria-hidden="true"
              className="absolute -bottom-0.5 md:-bottom-1 mx-auto rounded-xl pointer-events-none"
              style={{
                left: 0,
                right: 0,
                width: '100%',
                height: 180,
                zIndex: 1,
                background: 'linear-gradient(90deg, rgba(245,246,247,0.95) 0%, rgba(234,236,238,0.95) 50%, rgba(245,246,247,0.95) 100%)',
                filter: 'blur(18px)'
              }}
            />

            <div style={{ position: 'relative', zIndex: 10 }} className="pb-2">
              <Swiper
                spaceBetween={10}
                slidesPerView={6}
                className="mySwipers"
                style={{ width: "100%" }}
                breakpoints={{
                  0: {
                    slidesPerView: 1.5,
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
                {collectiondata && (
                  <>
                    <SwiperSlide key="collection-info" >
                      <div
                        className="h-40 w-40 md:h-48 md:w-48 rounded-xl mr-3 shadow-md flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(250,251,252,0.95)' }}
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-black">
                            {collectiondata.collection_name}
                          </h3>
                          <button
                            onClick={() =>
                              router.push(
                                `/kioskcollections/${collectiondata.path}`
                              )
                            }
                            className="mt-4 bg-black text-white px-4 py-2 rounded-md"
                          >
                            Shop All
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>

                    {collectiondata.product_lists?.map((product, idx) => (
                      <SwiperSlide key={`product-${idx}`} className="ml-7">
                        <div
                          className="h-40 w-40 md:h-48 md:w-48  rounded-xl mr-3 shadow-md flex items-center justify-center p-3 overflow-hidden"
                          style={{ backgroundColor: 'rgba(250,251,252,0.95)' }}
                        >
                          <Image
                            src={product.image}
                            width={176}
                            height={176}
                            alt={product.name || `slide-${idx}`}
                            className="h-full w-full rounded-md object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </>
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection