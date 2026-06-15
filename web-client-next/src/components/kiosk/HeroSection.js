import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { Autoplay } from "swiper";
import { SocialMediaApiCall } from "../../helper/serverAPIs";

const HeroSection = () => {
  const router = useRouter();
  const [collectiondata, setcollectiondata] = useState([]);
  // const collectiondata = useMemo(() => {
  //   return products?.find((data) => data?.video_url && data?.path && data?.status === 'published' );
  // }, [products]);
  // console.log('collectiondatas', collectiondata);
  // console.log('collectiondata',collectiondata);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await SocialMediaApiCall();
        // console.log('response',response.data.data);

        const shuffledData = [...response.data.data].sort(
          () => Math.random() - 0.5,
        );
        // setcollectiondata(shuffledData[0]);
        setcollectiondata(response.data.data[0]);
        // console.log('shuffledData',shuffledData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSocialMedia();
  }, []);

  // const videoUrlRaw = "https://www.youtube.com/watch?v=hrAOIj01B6E";
  const thumbnailImage =
    collectiondata?.thumbnail_image || collectiondata?.image;
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);


  useEffect(() => {
    // mark client after mount to avoid running client-only effects on SSR
    setIsClient(true);
  }, []);

  const videoContainerRef = useRef(null);
  const handlePlayClick = () => setIsPlaying(true);
  const handlePauseClick = () => setIsPlaying(false);

 

  useEffect(() => {
    if (!isClient) return;
    const node = videoContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry.intersectionRatio >= 0.5;
       
        setIsPlaying(visible);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // re-run when `products` changes so we attach observer when the
    // video container is mounted after the loading spinner.
  }, [isClient, collectiondata]);
  return (
    <div className="relative mt-7 mb-24">
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
                    disablekb: 1,
                  },
                },
              }}
              light={isPlaying ? false : thumbnailImage || false}
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

        <div className="absolute -bottom-14 left-0 right-0 px-3 md:px-6">
          <div className="relative pb-4">
            {/* subtle ash gradient behind the swiper cards */}
            <div
              aria-hidden="true"
              className="absolute -bottom-0.5 md:-bottom-1 mx-auto rounded-2xl pointer-events-none"
              style={{
                left: 0,
                right: 0,
                width: "100%",
                height: 168,
                zIndex: 1,
                background:
                  "linear-gradient(90deg, rgba(245,246,247,0.95) 0%, rgba(234,236,238,0.95) 50%, rgba(245,246,247,0.95) 100%)",
                filter: "blur(18px)",
              }}
            />

            <div
              style={{ position: "relative", zIndex: 10 }}
              className="flex items-stretch gap-3 overflow-hidden rounded-xl pb-2"
            >
              <div key="collection-info" className="flex-none">
                <div
                  className="h-40 w-44 md:h-48 md:w-52 rounded-xl shadow-lg flex items-center justify-center p-4"
                  style={{ backgroundColor: "rgba(250,251,252,0.96)" }}
                >
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-semibold leading-snug text-black">
                      {collectiondata.collection_name}
                    </h3>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(
                          `/kioskcollections/${collectiondata.path}`,
                        );
                      }}
                      className="mt-4 bg-black text-white px-4 py-2 rounded-md font-semibold"
                    >
                      Shop All
                    </button>
                  </div>
                </div>
              </div>
              <Swiper
                modules={[Autoplay]}
                spaceBetween={12}
                slidesPerView="auto"
                className="mySwipers"
                style={{ width: "100%", minWidth: 0 }}
                speed={2000} // move slowly for 2 seconds
                autoplay={{
                  delay: 3500, // wait 3.5 seconds before moving
                  disableOnInteraction: true, // stop autoplay after user swipes
                  pauseOnMouseEnter: false,
                }}
                // loop={true}
              >
                {collectiondata && (
                  <>
                    {collectiondata.product_lists?.map((product, idx) => (
                      <SwiperSlide
                        key={`product-${idx}`}
                        style={{ width: "auto" }}
                      >
                        <div
                          className="h-40 w-44 md:h-48 md:w-52 rounded-xl shadow-lg flex items-center justify-center p-3 overflow-hidden"
                          style={{ backgroundColor: "rgba(250,251,252,0.96)" }}
                        >
                          <Image
                            src={product.image}
                            width={176}
                            height={176}
                            alt={product.name || `slide-${idx}`}
                            className="h-full w-full rounded-lg object-contain"
                            onClick={(event) => {
                              event.stopPropagation();
                              router.push(`/product/${product.mfr_code}`);
                            }}
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
  );
};

export default HeroSection;
