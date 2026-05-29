import React from "react";



const QRsection = ({
  title = "Scan & Earn",
  subtitle = "Scan the QR code to join our loyalty program and start collecting points instantly.",
}) => {
  return (
    <div className="relative mt-7 lg:mt-12 bg-white rounded-[18px] p-4 sm:p-7 w-full shadow-xl">
      <div className="w-full rounded-[14px]  md:flex flex-col md:flex-row items-center md:items-start gap-4">
        {/* Left: icon + text */}
        <div className="flex-1 md:flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="mt-1 mb-1.5">
            <div className="w-14 h-14 rounded-full bg-[#fff6e6] flex items-center m-auto justify-center shadow-md">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="6" height="6" rx="1" fill="#C47A00" />
                <rect x="15" y="3" width="6" height="6" rx="1" fill="#C47A00" />
                <rect x="3" y="15" width="6" height="6" rx="1" fill="#C47A00" />
              </svg>
            </div>
          </div>

          <h3 className="h2-kiosk leading-[34px] mt-3 mb-2 text-slate-900 font-semibold">
            {title}
          </h3>
          <p className="p-kiosk text-slate-400 mb-2 m-auto md:m-0 max-w-[400px]">
            {subtitle}
          </p>
        </div>

        {/* Right: QR + EARN ONLY
          On small screens this block appears first (left-aligned),
          on large screens it is shown on the right side. */}
        <div className="flex-shrink-0 lg:flex m-auto flex-col items-start md:mt-0  mt-2 lg:items-center order-first lg:order-last">
          <div className="w-[160px] m-auto h-[160px] sm:w-[220px] sm:h-[220px] rounded-[14px] bg-[#fbfdff] flex items-center justify-center shadow-md border border-[rgba(2,6,23,0.04)] p-4">
            <img src="https://aurastage.unthink.ai/settings/build_qrcode/?page_url=https://unthink-ui-next-stage-ui-v2-314035436999.us-central1.run.app/collections/testing-product-detail-page-173081113277330" alt="Qr code" />
          </div>

          <div className="flex items-center justify-center gap-2.5 mt-2 lg:mt-2 m-auto">
            <span className="w-[10px] h-[10px] rounded-full bg-emerald-500 ring-[3px] ring-emerald-100/20" />
            <span className="text-emerald-500   font-semibold text-[13px]">
              EARN ONLY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRsection;
