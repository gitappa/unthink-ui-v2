import { useRouter } from "next/router";
import React, { useRef } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import QRsection from "./QRsection";

const BannerKisok = ({ products, Tags, lookBooks ,storeData}) => {
  const router = useRouter();
  const swiperRef = useRef(null);

  const trendingProducts = (products || [])
    .filter((x) => x.cover_image && x.path)
 
  const lookBooksProducts = (lookBooks || [])
    .filter((x) => x.cover_image && x.path)
    .slice(0, 6);
  const displayedProducts =
    Tags === "#Trending" ? trendingProducts.slice(0,trendingProducts.length >= 12 ? 12 : trendingProducts.length > 10 ? 9 : 6 ) : lookBooksProducts.slice(0,lookBooksProducts.length > 13 ? 12 :lookBooksProducts.length > 10 ? 9 : 6);
  //  console.log('displayedProducts',displayedProducts);

  const handleNavCollection = (Singlecollectiondata) => {
    router.push(`/kioskcollections/${Singlecollectiondata.path}`);
  };
  return (
    <div className=" flex justify-center items-start  gap-3 ">
      {/* Banner Section */}
      <div className="rounded-3xl   w-full bg-gradient-to-r from-kiosk-primary to-kiosk-secondary px-3 py-2 md:py-6 md:px-7.5 overflow-hidden relative ">
        {/* dark overlay so content reads on top of image */}
        <div className="   rounded-3xl pointer-events-none z-0" />
        <div className="w-full mx-auto relative z-10 h-full ">
          <div className="relative gap-4  grid grid-cols-3 h-full ">
            {/* <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={2}
              spaceBetween={20}
              speed={700}
              loop={displayedProducts.length > 3}
              watchOverflow={true}
              grabCursor={true}
              threshold={8}
              resistanceRatio={0.75}
              touchRatio={0.9}
              breakpoints={{
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="kiosk-banner-swiper w-full"
            > */}
              {displayedProducts.map((product) => (
                <div
                  key={product.collection_id}
                  
                >
                  <div className="h-auto bg-white rounded-t-xl">

                  <div
                    className={`relative overflow-hidden rounded-t-xl opacity-90 m-auto w-full hover:opacity-100 hover:scale-[1.015] transition-all duration-500 ease-out cursor-pointer h-40 sm:h-48 md:h-56 lg:h-[275px]  `}
                    onClick={() => handleNavCollection(product)}
                  >
                    {product.cover_image && (
                      <>
                      <img
                        src={product.cover_image}
                        className="shadow-lg h-full object-contain m-auto w-full transition-transform duration-500 ease-out"
                        alt={product.collection_name || product.cover_image}
                      />
                      
                      </>
                    )}
                  </div>
                  </div>
<div className="  bottom-0 left-0.5 bg-white/20 backdrop-blur-md border-t border-white/30 w-full rounded-b-lg px-2 py-1 shadow-[0_-8px_24px_rgba(0,0,0,0.18)]">
                        <p className="truncate text-center text-lg font-medium text-black drop-shadow-sm">
                          {product.collection_name || "Untitled collection"} 
                        </p>
                      </div>
                </div>
              ))}
            {/* </Swiper> */}

            {/* {displayedProducts.length > 3 && (
              <>
                <button
                  type="button"
                  aria-label="Previous collections"
                  className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all duration-300 ease-out hover:shadow-xl active:scale-95 md:h-10 md:w-10"
                  onClick={() => swiperRef.current?.slidePrev(700)}
                >
                  <MdOutlineKeyboardArrowLeft className="text-2xl" />
                </button>
                <button
                  type="button"
                  aria-label="Next collections"
                  className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all duration-300 ease-out hover:shadow-xl active:scale-95 md:h-10 md:w-10"
                  onClick={() => swiperRef.current?.slideNext(700)}
                >
                  <MdOutlineKeyboardArrowLeft className="rotate-180 text-2xl" />
                </button>
              </>
            )} */}
            {/* <style jsx global>{`
              .kiosk-banner-swiper .swiper-wrapper {
                transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
                will-change: transform;
              }

              .kiosk-banner-swiper .swiper-slide {
                backface-visibility: hidden;
                transform: translateZ(0);
              }
            `}</style> */}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-transparent rounded-full"></div>
        </div>
      </div>
      <QRsection showTags={Tags} storeData={storeData} />

    </div>
  );
};

export default BannerKisok;
