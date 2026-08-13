import React from "react";
import { FiTrash2 } from "react-icons/fi";

import { getMediaId } from "./storeAssistantMediaUtils";
import styles from "./StoreAssistantUploadMedia.module.scss";

const UploadedMediaCard = ({ media, onDelete }) => {
  const mediaUrl = media.media_url || media.url || "";
  const mediaType = media.media_type || "image";
  const mediaId = getMediaId(media);

  return (
    <article className={styles.mediaCard}>
      <div className={styles.mediaPreview}>
        {mediaType === "video" ? (
          <video src={mediaUrl} controls preload="metadata" />
        ) : (
          <img src={mediaUrl} alt="Uploaded media" />
        )}
      </div>
      {/* <div className={styles.mediaMeta}>
        <div>
          <span>{mediaType}</span>
          {media.source ? <strong>{media.source}</strong> : <strong>store_assistant</strong>}
        </div>
        {media.platform ? <p>Platform: {media.platform}</p> : null}
        {media.event_id ? <p>Event: {media.event_id}</p> : null}
        {mediaId ? <small>ID: {mediaId}</small> : null}
      </div> */}
      <div className={styles.mediaActions}>
        <button type="button" onClick={() => onDelete(media)}><FiTrash2 /> Delete</button>
      </div>
    </article>
  );
};

export default UploadedMediaCard;
