import { useRouter } from "next/router";
import React from "react";
import KioskPromoSection from "./KioskPromoSection";

const BannerKisok = ({ products, Tags, lookBooks, storeData }) => {
  const router = useRouter();

  const trendingProducts = (products || [])
    .filter((x) => x.cover_image && x.path);

  const lookBooksProducts = (lookBooks || [])
    .filter((x) => x.cover_image && x.path);

  const displayedProducts =
    Tags === "#Trending"
      ? trendingProducts
      : lookBooksProducts
   console.log('displayedProducts',trendingProducts.length);

  const handleNavCollection = (Singlecollectiondata) => {
    router.push(`/kioskcollections/${Singlecollectiondata.path}`);
  };

  const desktopProducts = displayedProducts.slice(
  0,
  Math.floor(displayedProducts.length / 4) * 4,
);

const desktopColumns = [0, 1, 2, 3].map((columnIndex) =>
  desktopProducts.filter((_, index) => index % 4 === columnIndex),
);

  console.log('desktopColumns',desktopColumns);
  

  const tileStyles = [
    ["h-[268px]", "h-[237px]"],
    ["h-[237px]", "h-[268px]"],
    ["h-[268px]", "h-[237px]"],
    ["h-[237px]", "h-[268px]"],
  ];

  return (
    <div className="lg:flex items-start justify-center gap-3">
      {/* Banner Section */}
      <div className="relative max-h-[600px] w-full  rounded-[18px] bg-white p-2 md:p-5">
        <div className="relative z-10 h-full w-full">
          <div className="relative grid max-h-[calc(600px-1rem)] grid-cols-2 gap-4 overflow-y-auto pr-1 md:hidden">
            {displayedProducts.map((product) => (
              <button
                type="button"
                className="group flex h-[184px] cursor-pointer flex-col overflow-hidden rounded-[16px] border-[6px] border-[#eeeeee] bg-kiosk-support text-left shadow-[0_3px_8px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out active:scale-[0.99]"
                key={product.collection_id}
                onClick={() => handleNavCollection(product)}
              >
                <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-t-[10px] bg-[#ead8bd]">
                  {product.cover_image && (
                    <img
                      src={product.cover_image}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                      alt={product.collection_name || product.cover_image}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex h-[38px] shrink-0 items-center justify-center bg-kiosk-support px-2">
                  <p className="max-w-full truncate whitespace-nowrap text-center text-[18px] font-semibold leading-none text-black">
                    {product.collection_name || "Untitled collection"}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="relative hidden max-h-[calc(600px-2.5rem)] grid-cols-4 p-1 gap-5 overflow-auto md:grid">
            {desktopColumns.map((columnProducts, columnIndex) => (
              <div className="flex min-w-0 flex-col gap-[22px]" key={columnIndex}>
                {columnProducts.map((product, productIndex) => (
                  <button
                    type="button"
                    className={`group flex cursor-pointer flex-col overflow-hidden rounded-[16px] border-[6px] border-[#eeeeee] bg-kiosk-support text-left shadow-[0_3px_8px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out active:scale-[0.99] ${tileStyles[columnIndex][productIndex]}`}
                    key={product.collection_id}
                    onClick={() => handleNavCollection(product)}
                  >
                    <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-t-[10px] bg-[#ead8bd]">
                      {product.cover_image && (
                        <img
                          src={product.cover_image}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                          alt={product.collection_name || product.cover_image}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="flex h-[38px] shrink-0 items-center justify-center bg-kiosk-support px-2">
                      <p className="max-w-full truncate whitespace-nowrap text-center py-1 text-[18px] font-semibold leading-none text-black">
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
      <KioskPromoSection showTags={Tags} storeData={storeData} />
    </div>
  );
};

export default BannerKisok;
