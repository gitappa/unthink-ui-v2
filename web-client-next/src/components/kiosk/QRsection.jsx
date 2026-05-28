import React from 'react'

const DummyQR = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full block"
    aria-hidden="true"
  >
    <rect width="200" height="200" rx="18" fill="#fff" />
    {/* Finder squares */}
    <g fill="#000">
      <rect x="14" y="14" width="48" height="48" rx="6" />
      <rect x="14" y="14" width="18" height="18" />
      <rect x="168" y="14" width="18" height="18" />
      <rect x="152" y="14" width="48" height="48" rx="6" />
      <rect x="14" y="152" width="48" height="48" rx="6" />
      <rect x="14" y="152" width="18" height="18" />
    </g>
    {/* Decorative inner pattern (dummy) */}
    <g fill="#000">
      <rect x="70" y="40" width="12" height="12" />
      <rect x="94" y="40" width="10" height="10" />
      <rect x="120" y="40" width="8" height="8" />

      <rect x="70" y="68" width="8" height="8" />
      <rect x="88" y="68" width="12" height="12" />
      <rect x="108" y="68" width="8" height="8" />

      <rect x="44" y="100" width="10" height="10" />
      <rect x="70" y="100" width="12" height="12" />
      <rect x="96" y="100" width="8" height="8" />
      <rect x="118" y="100" width="8" height="8" />

      <rect x="44" y="124" width="8" height="8" />
      <rect x="70" y="124" width="10" height="10" />
      <rect x="96" y="124" width="12" height="12" />
      <rect x="124" y="124" width="6" height="6" />
    </g>
  </svg>
)

const QRsection = ({ title = 'Scan & Earn', subtitle = 'Scan the QR code to join our loyalty program and start collecting points instantly.' }) => {
  
  return (
    <div className="relative mt-7 lg:mt-12 bg-white rounded-[18px] p-5 sm:p-7 w-full shadow-xl">
      <div className="w-full border border-[rgba(1,3,12,0.04)] rounded-[14px] p-4 flex flex-col lg:flex-row items-center lg:items-start gap-4">
      {/* Left: icon + text */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="mt-1 mb-1.5">
          <div className="w-14 h-14 rounded-full bg-[#fff6e6] flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <rect x="3" y="3" width="6" height="6" rx="1" fill="#C47A00" />
              <rect x="15" y="3" width="6" height="6" rx="1" fill="#C47A00" />
              <rect x="3" y="15" width="6" height="6" rx="1" fill="#C47A00" />
            </svg>
          </div>
        </div>

        <h3 className="h2-kiosk leading-[34px] mt-3 mb-2 text-slate-900 font-semibold">{title}</h3>
        <p className="p-kiosk text-slate-400 mb-2 max-w-[400px]">{subtitle}</p>
      </div>

      {/* Right: QR + EARN ONLY
          On small screens this block appears first (left-aligned),
          on large screens it is shown on the right side. */}
      <div className="flex-shrink-0 flex flex-col items-start lg:items-center order-first lg:order-last">
        <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-[14px] bg-[#fbfdff] flex items-center justify-center shadow-md border border-[rgba(2,6,23,0.04)] p-4">
          <DummyQR />
        </div>

        <div className="flex items-center gap-2.5 mt-2 lg:mt-2">
          <span className="w-[10px] h-[10px] rounded-full bg-emerald-500 ring-[3px] ring-emerald-100/20" />
          <span className="text-emerald-500 font-semibold text-[13px]">EARN ONLY</span>
        </div>
      </div>
      </div>
    </div>
  )
}

export default QRsection