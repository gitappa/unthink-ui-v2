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
}) => {
  const Icon = icon === "gift" ? FaGift : AiFillStar;

  return (
    <div className="bg-white rounded-[18px] p-4 border border-[rgba(2,6,23,0.04)] shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex flex-col items-start text-left">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${icon === "gift" ? "bg-[#fff0f4]" : "bg-[#fff6e6]"}`}>
            <Icon className={`${icon === "gift" ? "text-[#C23C6B]" : "text-[#C47A00]"} w-5 h-5`} aria-hidden="true" />
          </div>

          <h3 className="text-xl md:text-[24px] leading-[34px] mt-3 mb-2 text-slate-900 font-semibold">{title}</h3>
          <p className="text-slate-400 mb-2 max-w-[420px] text-sm">{subtitle}</p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center gap-2 mt-2 lg:mt-0">
          <div className="w-[160px] h-[160px]  rounded-[14px] bg-[#fbfdff] p-2 border border-[rgba(2,6,23,0.04)] shadow-md flex items-center justify-center">
            <img src={qrSrc} alt={`${title} QR`} className="max-w-full max-h-full object-contain" />
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <span className={`w-[10px] h-[10px] rounded-full ${badgeColor === "emerald" ? "bg-emerald-500 ring-4 ring-emerald-100/20" : "bg-red-500 ring-4 ring-red-100/20"}`} />
            <span className={`font-semibold text-[13px] ${badgeColor === "emerald" ? "text-emerald-500" : "text-red-500"}`}>{badgeText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskQRCard;
