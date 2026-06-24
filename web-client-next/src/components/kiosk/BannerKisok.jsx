import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
const BannerKisok = ({ products, Tags, lookBooks }) => {
  const router = useRouter();

  const trendingProducts = (products || [])
    .filter((x) => x.cover_image && x.path)
    .slice(0, 8);
  const lookBooksProducts = (lookBooks || [])
    .filter((x) => x.cover_image && x.path)
    .slice(0, 8);
  const displayedProducts =
    Tags === "#Trending" ? trendingProducts : lookBooksProducts;
  //  console.log('displayedProducts',displayedProducts);

  const handleNavCollection = (Singlecollectiondata) => {
    router.push(`/kioskcollections/${Singlecollectiondata.path}`);
  };
  return (
    <div className="mt-5">
      {/* Banner Section */}
      <div className="rounded-3xl bg-gradient-to-r from-kiosk-primary to-kiosk-secondary px-4 py-6 md:py-10 md:px-8 overflow-hidden relative ">
        {/* dark overlay so content reads on top of image */}
        <div className="   rounded-3xl pointer-events-none z-0" />
        <div className="w-full mx-auto relative z-10">
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
