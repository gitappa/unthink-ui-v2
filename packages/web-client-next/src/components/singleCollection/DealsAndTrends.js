import React from 'react'
import Image from "next/image";
import menimage2 from "./images/menImage2.jpg";
import menimage3 from "./images/menimage3.jpg";
import menimage from "./images/menimage.jpg";
import im from "./images/pppp.webp";
import styles from "./DealsAndTrends.module.css";

const DealsAndTrends = () => {
  return (
    <div className={styles.container}>
      <div className={styles.promoSection}>
        <div className={styles.promoCard} style={{ background: '#F2E5CB' }}>
          <h3 className={styles.promoTitle}>FLAT 15% OFF</h3>
          <p className={styles.promoText}>On orders above  <strong>₹1999</strong></p>
        </div>
        <div className={styles.promoCard} style={{ background: '#F2E5CB' }}>
          <h3 className={styles.promoTitle}>FLAT 15% OFF</h3>
          <p className={styles.promoText}>On orders above  <strong>₹1999</strong></p>
        </div>
      </div>

      <div
        className={styles.dividerContainer}
        style={{ height: "-webkit-fill-available" }}
      >
        <div className={styles.divider}></div>
      </div>

      <div className={styles.trendsSection}>
        {/* Decorative dots above */}
        <div className={`${styles.dotsContainer} ${styles.dotsTop}`}>
          <div className={`${styles.dotBase} ${styles.dotSmall}`}></div>
          <div className={`${styles.dotBase} ${styles.dotMedium}`}></div>
          <div className={`${styles.dotBase} ${styles.dotLarge} ${styles.shadowLarge}`}></div>
          <div className={`${styles.dotBase} ${styles.dotMedium}`}></div>
          <div className={`${styles.dotBase} ${styles.dotSmall}`}></div>
        </div>

        <div className={styles.tagsGrid}>
          <div className={`${styles.tag} summer-vibes`} >
            #SummerVibes
          </div>
          <div style={{ background: '#8E3B5B', borderColor: '#D77A9C' }} className={styles.tag}>
            #CyberPunk
          </div>
          <div style={{ background: '#2F6F7A', borderColor: '#6FB5C1' }} className={styles.tag}>
            #EcoFriendly
          </div>
          <div style={{ background: '#3F6B3F', borderColor: '#7FB27F' }} className={styles.tag}>
            #EcoFriendly
          </div>
          <div style={{ background: '#6A4A2F', borderColor: '#B8926B' }} className={styles.tag}>
            #SummerCrops
          </div>
          <div style={{ background: '#3E4F7A', borderColor: '#8FA0D6' }} className={styles.tag}>
            #BrandStran
          </div>
        </div>

        {/* Decorative dots below */}
        <div className={`${styles.dotsContainer} ${styles.dotsBottom}`}>
          <div className={`${styles.dotBase} ${styles.dotSmall}`}></div>
          <div className={`${styles.dotBase} ${styles.dotMedium}`}></div>
          <div className={`${styles.dotBase} ${styles.dotLarge} ${styles.shadowExtraLarge}`}></div>
          <div className={`${styles.dotBase} ${styles.dotMedium}`}></div>
          <div className={`${styles.dotBase} ${styles.dotSmall}`}></div>
        </div>
      </div>
    </div>
  )
}

export default DealsAndTrends