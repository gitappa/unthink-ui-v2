import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";

const HeroProductSwiper = ({ products = [], onProductClick }) => (
  <Swiper
    modules={[Autoplay]}
    spaceBetween={12}
    slidesPerView="auto"
    className="mySwipers"
    style={{ width: "100%", minWidth: 0 }}
    speed={2000}
    autoplay={{
      delay: 3500,
      disableOnInteraction: true,
      pauseOnMouseEnter: false,
    }}
  >
    {products.map((product, idx) => (
      <SwiperSlide key={`product-${idx}`} style={{ width: "auto" }}>
        <div
          className="h-44 w-50 rounded-xl shadow-lg flex items-center justify-center p-3 overflow-hidden"
          style={{ backgroundColor: "rgba(250,251,252,0.96)" }}
        >
          <Image
            src={product.image}
            width={176}
            height={176}
            alt={product.name || `slide-${idx}`}
            className="h-full w-full rounded-lg object-contain"
            loading="lazy"
            onClick={(event) => {
              event.stopPropagation();
              onProductClick(product);
            }}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default HeroProductSwiper;
