import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
const BannerKisok = ({ products, Tags }) => {
  const router = useRouter();

  const dummyProducts = (products || []).filter((x) => x.cover_image && x.path);
  const displayedProducts = dummyProducts.slice(0, 8);
 
  // const trendingBase = [
  //   "#Hot Now",
  //   "#Street Style",
  //   "#OOTD",
  //   "#Viral",
  //   "#Editor's Pick",
  //   "#Must Haves",
  //   "#New Arrivals",
  //   "#Eco Friendly",
  //   "#Celeb Picks",
  // ];
  // const trendingTags = useMemo(() => {
  //   if (showTags !== "#Trending") return [];
  //   const shuffled = [...trendingBase].sort(() => Math.random() - 0.5);
  //   return shuffled.slice(0, 6);
  // }, [showTags]);

  const handleNavCollection = (Singlecollectiondata) => {
    router.push(`/kioskcollections/${Singlecollectiondata.path}`);
  };
  return (
    <div className="mt-5">
      {/* Banner Section */}
      <div
        className="rounded-3xl bg-gradient-to-r from-kiosk-primary to-kiosk-secondary px-4 py-6 md:py-10 md:px-8 overflow-hidden relative "
        // style={{
        //   backgroundImage: `url(${Gold_bg_banner?.src || Gold_bg_banner})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        // }}
      >
        {/* dark overlay so content reads on top of image */}
        <div className="   rounded-3xl pointer-events-none z-0" />
        <div className="w-full mx-auto relative z-10">
          {/* {showTags === "#Trending" ? (
            <div className="grid grid-cols-3 gap-3 gap-y-9 w-full">
              {trendingTags.map((tag, idx) => (
                <div
                  key={`${tag}-${idx}`}
                  className="overflow-hidden opacity-90 m-auto hover:opacity-100 hover:shadow-lg transition h-8 w-48 cursor-pointer flex items-center justify-center"
                >
                  <div className="rounded-2xl shadow-lg h-full w-full flex items-center justify-center bg-gray-200">
                    <span className="text-black text-lg font-bold">{tag}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : ( */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 gap-y-5 md:gap-y-5 xl:gap-5 w-full">
            {displayedProducts.map((product) => (
              <div
                key={product.collection_id}
                className={`overflow-hidden opacity-90 m-auto w-full hover:opacity-100 transition cursor-pointer h-40 sm:h-48 md:h-56 lg:h-60 xl:h-[405px]`}
              >
                {product.cover_image && (
                  <img
                    src={product.cover_image}
                    className="rounded-xl shadow-lg h-full object-cover m-auto  w-[225px] lg:w-[215px] xl:w-full"
                    alt={product.collection_name || product.cover_image}
                    onClick={() => handleNavCollection(product)}
                  />
                )}
              </div>
            ))}
          </div>
          {/* )} */}
        </div>

        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BannerKisok;
