import React from "react";


const KioskPromoCard = ({
  variant,
  title,
  subtitle,
  eventTitle,
  qrSrc,
  titleIcon,
  giftIcon,
  offerMessage,
  offerImage,
}) => {
  return (
       <div className="w-full shrink-0 md:mt-4 lg:mt-0 lg:w-[272px]">
        <div className="  min-h-[132px] items-center justify-between gap-6 rounded-[12px] bg-white px-10 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.18)] flex ">
          <div className="flex min-w-[225px] items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <h3 className="whitespace-nowrap text-[18px] font-extrabold leading-none text-[#202020]">
                {title}
              </h3>
              <img
                src={titleIcon}
                className="h-[56px] w-[70px] object-contain"
                alt={titleIcon || "Cart Icon"}
              />
            </div>

            <div className="max-w-[145px]">
              <h3 className="text-[14px] font-extrabold leading-[1.08] text-[#202020]">
                {eventTitle}
              </h3>
              <p className="mt-[8px] text-[11px] font-medium leading-[1.2] text-[#777777]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center border-[3px] border-kiosk-primary bg-white">
            <img
              src={qrSrc}
              alt="GIVA AI Assistant QR"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex min-w-[145px] flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[2px] bg-[#fff0f4]">
                <img
                  src={giftIcon}
                  className="h-[23px] w-[23px] object-contain"
                  alt=""
                />
              </span>
              <span className="text-[13px] font-extrabold leading-none text-[#202020]">
                {offerMessage || "Rs 500"}
              </span>
            </div>
            {offerImage ? (
              <img
                src={offerImage}
                alt={offerImage || "Offer Image"}
                className="max-h-[38px] max-w-[118px] object-contain"
              />
            ) : (
              <span className="text-[36px] font-medium uppercase leading-none tracking-[0.08em] text-black">
                GIVA
              </span>
            )}
          </div>
        </div>

         
      </div>
  );
};

export default KioskPromoCard;
