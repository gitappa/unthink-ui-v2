import React from "react";
import KioskQRCard from "./KioskQRCard";

const QRsection = () => {
  const qr1 =
    "https://aurastage.unthink.ai/settings/build_qrcode/?page_url=https://unthink-ui-next-stage-ui-v2-314035436999.us-central1.run.app/collections/testing-product-detail-page-173081113277330";

  return (
    <div className="w-full mt-8 pb-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <KioskQRCard
          title="Loyalty Rewards"
          subtitle="Scan to join our loyalty program and start collecting points instantly."
          qrSrc={qr1}
          badgeText="POINTS ONLY"
          badgeColor="emerald"
          icon="star"
        />

        <KioskQRCard
          title="Giva Giveaway"
          subtitle="Scan to register for our weekly sweepstakes for exciting prizes."
          qrSrc={qr1}
          badgeText="GIVEAWAY ENTRY"
          badgeColor="red"
          icon="gift"
        />
      </div>
    </div>
  );
};

export default QRsection;
