import React from "react";
import { FaGift } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";

const KioskQRCard = ({
  title,
  subtitle,
  qrSrc,
  badgeText,
  badgeColor = "emerald",
  icon = "star",
  showTags,
  space
}) => {
  const Icon = icon === "gift" ? FaGift : AiFillStar;

  return (
    <div
      className={`bg-white rounded-[18px] ${space ? "mt-2" : ""}  ${showTags === "Social Media" ? "p-3" : "p-4"}  border border-[rgba(2,6,23,0.04)] shadow-xl`}
    >
      <div
        className={` ${showTags === "Social Media" ? "" : "flex"}  items-center justify-between gap-4`}
      >
        <div
          className={`flex-1 flex flex-col ${showTags === "Social Media" ? "items-center " : "items-start"}  text-left`}
        >
          {showTags !== "Social Media"  &&
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${icon === "gift" ? "bg-[#fff0f4]" : "bg-[#fff6e6]"}`}
          >
            <Icon
              className={`${icon === "gift" ? "text-[#C23C6B]" : "text-[#C47A00]"} w-5 h-5`}
              aria-hidden="true"
            />
          </div>
}

          <h3 className={`text-xl md:text-[24px] leading-[34px] ${showTags === "Social Media" ? 'mt-0' : 'mt-3'}   mb-2 text-slate-900 font-semibold  `} >
            {title}
          </h3>
          <p className={`text-slate-400 mb-2 ${showTags === "Social Media" ? 'text-center' : ''} max-w-[420px] text-sm`}>
            {subtitle}
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center gap-2 mt-2 lg:mt-0">
          <div className={`${showTags === "Social Media" ? ' w-[120px] h-[120px]' : ' w-[160px] h-[160px] ' }  rounded-[14px] bg-[#fbfdff] p-2 border border-[rgba(2,6,23,0.04)] shadow-md flex items-center justify-center`}>
            <img
              src={qrSrc}
              alt={`${title} QR`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <span
              className={`w-[10px] h-[10px] rounded-full ${badgeColor === "emerald" ? "bg-emerald-500 ring-4 ring-emerald-100/20" : "bg-red-500 ring-4 ring-red-100/20"}`}
            />
            <span
              className={`font-semibold text-[13px] ${badgeColor === "emerald" ? "text-emerald-500" : "text-red-500"}`}
            >
              {badgeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskQRCard;
