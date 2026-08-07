import React from "react";

import {
  formatTimestamp,
  getAlertDetails,
  getAlertImages,
  getAlertSummary,
} from "./realtimeFeedFormatters";
import styles from "./StoreAssistantRealtimeFeed.module.scss";

const RealtimeFeedCard = ({ alert, onPreviewImage }) => {
  const images = getAlertImages(alert);
  const details = getAlertDetails(alert);

  return (
    <article className={styles.feedCard}>
      <div className={styles.cardBody}>
        <small>{formatTimestamp(alert.timestamp)}</small>
        <h3>{getAlertSummary(alert)}</h3>
        {details.map((detail) => (
          <p key={`${detail.label}-${detail.value}`}>
            {detail.label}: <strong>{detail.value}</strong>
          </p>
        ))}
        {alert.collection_path ? (
          <p>
            collection path: {" "}
            <a href={alert.collection_path} target="_blank" rel="noopener noreferrer">link</a>
          </p>
        ) : null}
      </div>

      {images.length > 0 ? (
        <div className={styles.imageGrid}>
          {images.slice(0, 4).map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => onPreviewImage(image)}
              aria-label={`Preview image ${index + 1}`}
            >
              <img src={image} alt="Feed preview" />
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
};

export default RealtimeFeedCard;
