import React from "react";
import KioskQRCard from "./KioskQRCard";
import cart from "../../images/kiosk/cart.png";
const QRsection = ({ showTags, storeData }) => {
  const [fetchedData, setFetchedData] = React.useState(null);
  console.log('fetchedData',fetchedData);
  
  const qr1 =
    "https://aurastage.unthink.ai/settings/build_qrcode/?page_url=https://unthink-ui-next-stage-ui-v2-314035436999.us-central1.run.app/collections/testing-product-detail-page-173081113277330";
  const data =storeData.kiosk_settings?.tabs
  // data.push(storeData.kiosk_settings?.tab1,storeData.kiosk_settings?.tab2,storeData.kiosk_settings?.tab3,storeData.kiosk_settings?.tab4);
React.useEffect(() => {
  const item = data.find((item) => item?.label === showTags);
  setFetchedData(item || null);
}, [showTags, storeData]);
      
  // console.log('data',data)
  if (
    showTags === "Social Media" ||
    showTags === "#Trending" ||
    showTags === "Look Books"
  ) {
    return (
      <div className="w-[272px] shrink-0 h-screen ">
        <div className="relative  rounded-[16px] border border-white/80 bg-[linear-gradient(180deg,#fff1f6_0%,#f8f8f8_34%,#f1f1f1_100%)] px-[18px] pb-[24px] pt-[18px] shadow-[0_0_22px_rgba(236,126,153,0.42),0_18px_36px_rgba(15,23,42,0.26),inset_0_0_22px_rgba(255,255,255,0.95)]">
          <div
            className="absolute -top-[7px] right-2.5  -translate-x-1/2
 w-5 h-5 bg-[#fff1f6]
 border-l border-t border-white
 rotate-45 z-20"
          ></div>

          <div className="relative z-10 flex h-full flex-col items-center">
            <div className="flex w-full items-center pt-8  justify-center gap-[10px]">
              <img src={fetchedData?.title_icon || cart.src} className="w-[50%]" alt="cart" />

              <div className="p-2.5 w-full  bg-white rounded">
                <div className="flex h-auto w-fit m-auto   items-center justify-center bg-[#a98b3d]  shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_3px_8px_rgba(0,0,0,0.08)]">
                  <img
                    src={qr1}
                    alt="Digital cart QR"
                    className="h-full w-full object-contain mix-blend-lighten"
                  />
                </div>
              </div>
            </div>

            <p className="mt-[26px] text-center text-[28px] font-normal leading-[1.4] text-[#252525]">
              {fetchedData?.event_message ||
                "Scan to pick up your digital cartq"}
            </p>

            <div className="relative my-[30px] w-full rounded-[8px] bg-[#f5aaad] px-[18px] py-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
              <div
                aria-hidden="true"
                className="absolute -left-[7px] top-[16px] flex flex-col gap-[7px]"
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <span
                    key={`left-${index}`}
                    className="h-[6px] w-[9px] rounded-full bg-[#f0f0f0]"
                  />
                ))}
              </div>
              <div
                aria-hidden="true"
                className="absolute -right-[7px] top-[16px] flex flex-col gap-[7px]"
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <span
                    key={`right-${index}`}
                    className="h-[6px] w-[9px] rounded-full bg-[#f0f0f0]"
                  />
                ))}
              </div>
              <div className="flex h-[88px] items-center justify-center rounded-[8px] bg-[#f2f2f2] px-4 shadow-[inset_0_0_14px_rgba(0,0,0,0.05)]">
                <span className="whitespace-nowrap text-[52px] font-extrabold leading-none text-[#555555]">
                  {fetchedData?.offer_message || "Rs 500"}
                </span>
              </div>
            </div>

            <p className="mt-0 whitespace-nowrap text-center text-[28px] font-normal leading-none text-[#252525]">
              Shop &amp; Play to earn!
            </p>
          </div>
          <img
            src={fetchedData?.offer_image || "https://www.giva.co/cdn/shop/files/logo__3.png?v=1752672324&width=100"}
            alt="offer_image"
            className="p-4 m-auto mt-3"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 pb-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <KioskQRCard
          title="Loyalty Rewards"
          subtitle="Scan to join our loyalty program and start collecting points instantly."
          qrSrc={qr1}
          badgeText="POINTS ONLY"
          badgeColor="emerald"
          icon="star"
          showTags={showTags}
        />

        <KioskQRCard
          title="Giva Giveaway"
          subtitle="Scan to register for our weekly sweepstakes for exciting prizes."
          qrSrc={qr1}
          badgeText="GIVEAWAY ENTRY"
          badgeColor="red"
          icon="gift"
          showTags={showTags}
          space
        />
      </div>
    </div>
  );
};

export default QRsection;
