import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const BannerKisok = ({ products }) => {
  const Tags = ["Look Books", "Social Media", "#Trending "];
  const [showTags, setShowTags] = useState(Tags[0]);
  const router = useRouter();

  const dummyProducts = products.filter((x) => x.cover_image);
  const displayedProducts = dummyProducts.slice(0, 9);
  const handleNavCollection = (Singlecollectiondata) => {
    router.push(`/kioskcollections/${Singlecollectiondata.path}`);
  };
  return (
    <div className="mt-5">
      {/* Tag Buttons */}
      <div className="flex items-center mb-8">
        {Tags.map((tag, i) => (
          <button
            key={i}
            className={`${showTags === tag ? "bg-black text-white shadow-md py-3 px-4 rounded-3xl" : "bg-gray-100 shadow text-gray-500 px-3 py-3 rounded-3xl"} w-full font-semibold mr-5`}
            onClick={() => setShowTags(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Banner Section */}
      <div className="bg-black rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="w-full  mx-auto">
          <div className="grid grid-cols-3 gap-3 gap-y-9  w-full">
            {displayedProducts.map((product) => (
              <div
                key={product.collection_id}
                className={`overflow-hidden opacity-90 m-auto hover:opacity-100 transition  h-60  cursor-pointer`}
              >
                {product.cover_image && (
                  <img
                    src={product.cover_image}
                    className="rounded-lg shadow-lg  h-full object-cover  lg:w-[215px]  "
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
