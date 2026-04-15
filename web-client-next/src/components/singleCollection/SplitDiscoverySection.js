import React from 'react'
import Image from "next/image";
import img1 from "./images/newmen.png";
import menimage from "./images/suv.jpg";
import qrcode from "./images/qrcode.svg";
import legs from "./images/shoes.jpg";
import robo from "./images/Robo2.svg";
import styles from "./SplitDiscoverySection.module.css";

import men from "./images/image.png";

import ai from "./images/sparkle.svg";

const SplitDiscoverySection = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>DISCOVER HIDDEN TREASURES</h2>
      <div className={styles.contentWrapper}>
        <div className={styles.imageColumn} style={{ height: 700 }}>
          <div className={styles.imageGridColumn}>
            <Image
              src={men}
              className={styles.imageTop}
              style={{ height: "50%" }}
            />
            <Image
              src={menimage} width={100} height={100}
              className={styles.imageBottom}
              style={{ height: "40%" }}
            />
          </div>

          <div className={styles.imageGridColumn}>
            <Image
              src={menimage} width={100} height={100}
              className={styles.imageTopRight}
              style={{ height: "40%" }}
            />
            <Image
              src={img1}
              className={styles.imageBottomRight}
              style={{ height: "50%" }}
            />
          </div>
        </div>

        <div className={styles.infoColumn}>
          <div style={{ minHeight: 455 }} className={styles.treasureCard}>
            <div className={styles.treasureContent}>
              <p className={styles.treasureText}>
                Uncover rare finds, exclusive styles, and pieces you won’t see everywhere. Your next favorite is waiting—just beneath the surface.
                Step into a world of carefully curated gems. Discover hidden treasures crafted to stand out.
              </p>
              <div className={styles.qrCodeContainer}>
                <Image
                  src={qrcode}
                  alt="qrcode"
                  className={styles.qrCodeImage}
                  width={100}
                  height={100}
                />
                <p className={styles.qrText}>Scan to Join</p>
              </div>
            </div>
            <div className={styles.challengeContainer}>
              <h3 className={styles.challengeTitle}>CHALLENGE  & EARN</h3>
              <Image
                src={legs}
                alt="show"
                className={styles.legsImage}
              />
            </div>
          </div>
          <div className={styles.stylistCard}>
            <Image
              src={robo} width={100} height={100}
              alt="ai stylist "
              className={styles.roboImage}
            />
            <h3 className={styles.stylistTitle}>ASK AI STYLIST </h3>
            <Image
              src={ai}
              width={40}
              height={40}
              alt="ai stylist "
              className={styles.sparkleImage}
            />
            {/* <Image
                src={ai}
                width={50}
                height={50}
                alt="ai stylist "
                className="  mt-3 w-9 h-9 absolute right-1 -bottom-2  z-20"
              /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplitDiscoverySection