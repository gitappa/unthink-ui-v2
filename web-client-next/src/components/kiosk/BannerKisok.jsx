import { useRouter } from "next/router";
import React from "react";
import QRsection from "./QRsection";

const BannerKisok = ({ products, Tags, lookBooks, storeData }) => {
  const router = useRouter();

  const trendingProducts = (products || [])
    .filter((x) => x.cover_image && x.path);

  const lookBooksProducts = (lookBooks || [])
    .filter((x) => x.cover_image && x.path);

  const displayedProducts =
    Tags === "#Trending"
      ? trendingProducts.slice(0, 8)
      : lookBooksProducts.slice(0, 8);
  //  console.log('displayedProducts',lookBooksProducts.length);

  const handleNavCollection = (Singlecollectiondata) => {
    router.push(`/kioskcollections/${Singlecollectiondata.path}`);
  };

  const desktopColumns = [0, 1, 2, 3].map((columnIndex) =>
    [displayedProducts[columnIndex], displayedProducts[columnIndex + 4]].filter(
      Boolean,
    ),
  );

  const tileStyles = [
    ["h-[258px]", "h-[245px]"],
    ["h-[227px]", "h-[288px]"],
    ["h-[258px]", "h-[251px]"],
    ["h-[227px]", "h-[288px]"],
  ];

  return (
    <div className="flex items-start justify-center gap-3">
      {/* Banner Section */}
      <div className="relative max-h-[600px] w-full overflow-hidden rounded-[18px] bg-white p-2 md:p-5">
        <div className="relative z-10 h-full w-full">
          <div className="relative grid max-h-[calc(600px-1rem)] grid-cols-2 gap-4 overflow-y-auto pr-1 md:hidden">
            {displayedProducts.map((product) => (
              <button
                type="button"
                className="group relative cursor-pointer overflow-hidden rounded-[10px] bg-[#5c1722] text-left shadow-sm transition-transform duration-300 ease-out active:scale-[0.99]"
                key={product.collection_id}
                onClick={() => handleNavCollection(product)}
              >
                <div className="relative h-[130px] w-full overflow-hidden sm:h-[170px] md:h-[229px]">
                  {product.cover_image && (
                    <img
                      src={product.cover_image}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                      alt={product.collection_name || product.cover_image}
                      loading="lazy"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                  />
                  <p className="absolute inset-x-0 bottom-3 px-3 text-center text-[18px] font-extrabold uppercase leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] md:text-[19px]">
                    {product.collection_name || "Untitled collection"}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="relative hidden max-h-[calc(600px-2.5rem)] grid-cols-4 gap-5 overflow-hidden md:grid">
            {desktopColumns.map((columnProducts, columnIndex) => (
              <div className="flex min-w-0 flex-col gap-[22px]" key={columnIndex}>
                {columnProducts.map((product, productIndex) => (
                  <button
                    type="button"
                    className="group relative cursor-pointer overflow-hidden rounded-[10px] bg-[#5c1722] text-left shadow-sm transition-transform duration-300 ease-out active:scale-[0.99]"
                    key={product.collection_id}
                    onClick={() => handleNavCollection(product)}
                  >
                    <div
                      className={`relative w-full overflow-hidden ${tileStyles[columnIndex][productIndex]}`}
                    >
                      {product.cover_image && (
                        <img
                          src={product.cover_image}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                          alt={product.collection_name || product.cover_image}
                          loading="lazy"
                        />
                      )}
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                      />
                      <p className="absolute inset-x-0 bottom-3 px-3 text-center text-base font-extrabold uppercase leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                        {product.collection_name || "Untitled collection"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <QRsection showTags={Tags} storeData={storeData} />
    </div>
  );
};

export default BannerKisok;
