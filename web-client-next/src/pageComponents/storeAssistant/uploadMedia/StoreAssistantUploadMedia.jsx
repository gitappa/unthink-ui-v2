import React, { useCallback, useEffect, useMemo, useState } from "react";
import { notification, Spin } from "antd";
import { useSelector } from "react-redux";
import { FiRefreshCw, FiUploadCloud } from "react-icons/fi";

import { profileAPIs } from "../../../helper/serverAPIs";
import {
  createMedia,
  deleteMedia,
  fetchMedia,
} from "./storeAssistantMediaApi";
import {
  getMediaId,
  getMediaIdentity,
  getMediaTypeFromFile,
  getStoreName,
  getUploadedMediaUrl,
  normalizeMediaList,
} from "./storeAssistantMediaUtils";
import UploadedMediaCard from "./UploadedMediaCard";
import styles from "./StoreAssistantUploadMedia.module.scss";

const StoreAssistantUploadMedia = () => {
  const [authUser, storeData] = useSelector((state) => [state.auth.user.data, state.store.data]);
  const storeName = getStoreName(storeData);
  const identity = useMemo(() => getMediaIdentity(authUser), [authUser]);
  const [files, setFiles] = useState([]);
  const [previewItems, setPreviewItems] = useState([]);
  const [mediaTypeFilter, setMediaTypeFilter] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const loadMedia = useCallback(async () => {
    if (!storeName) return;
    setLoading(true);
    try {
      const response = await fetchMedia({
        store: storeName,
        ...identity,
        media_type: mediaTypeFilter || undefined,
      });
      setMediaList(normalizeMediaList(response));
    } catch (error) {
      notification.error({ message: error.message || "Failed to fetch media" });
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  }, [identity, mediaTypeFilter, storeName]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    const nextPreviewItems = files.map((selectedFile) => ({
      file: selectedFile,
      url: URL.createObjectURL(selectedFile),
      mediaType: getMediaTypeFromFile(selectedFile),
    }));

    setPreviewItems(nextPreviewItems);

    return () => {
      nextPreviewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  const onFilesSelected = (fileList) => {
    setFiles(Array.from(fileList || []));
  };

  const removeSelectedFile = (fileToRemove) => {
    setFiles((currentFiles) => currentFiles.filter((selectedFile) => selectedFile !== fileToRemove));
  };

  const onUploadSubmit = async (event) => {
    event.preventDefault();
    if (files.length === 0) {
      notification.warning({ message: "Select media files first" });
      return;
    }
    if (!storeName) {
      notification.error({ message: "Store is missing" });
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    let successCount = 0;
    let failedCount = 0;

    try {
      for (let index = 0; index < files.length; index += 1) {
        const selectedFile = files[index];
        const mediaType = getMediaTypeFromFile(selectedFile);
        setUploadProgress({ current: index + 1, total: files.length });

        try {
          const uploadResponse = mediaType === "video"
            ? await profileAPIs.uploadVideo({ file: selectedFile, store: storeName })
            : await profileAPIs.uploadImage({ file: selectedFile });
          const mediaUrl = getUploadedMediaUrl(uploadResponse, mediaType);

          if (!mediaUrl) throw new Error("Media upload did not return a URL");

          await createMedia({
            ...identity,
            media_url: mediaUrl,
            media_type: mediaType,
            store: storeName,
            platform: "",
            source: "store_assistant",
            event_id: "",
          });
          successCount += 1;
        } catch (error) {
          failedCount += 1;
        }
      }

      if (successCount > 0) {
        notification.success({ message: `${successCount} media file${successCount === 1 ? "" : "s"} uploaded` });
        setFiles([]);
      }
      if (failedCount > 0) {
        notification.error({ message: `${failedCount} media file${failedCount === 1 ? "" : "s"} failed to upload` });
      }
      await loadMedia();
    } catch (error) {
      notification.error({ message: error.message || "Failed to upload media" });
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const onDeleteMedia = async (media) => {
    const mediaId = getMediaId(media);
    if (!mediaId) return;
    if (!window.confirm("Delete this media?")) return;
    try {
      await deleteMedia(mediaId);
      notification.success({ message: "Media deleted" });
      await loadMedia();
    } catch (error) {
      notification.error({ message: error.message || "Failed to delete media" });
    }
  };

  return (
    <section className={styles.uploadShell}>
      <div className={styles.uploadHeader}>
        <div>
          <h2>Upload Media</h2>
          <p>Upload customer or product media, then review uploaded media for this store.</p>
        </div>
        <button type="button" onClick={loadMedia} disabled={loading}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <form className={styles.uploadForm} onSubmit={onUploadSubmit}>
        <label className={styles.filePicker}>
          <FiUploadCloud />
          <span>{files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected` : "Choose images or videos"}</span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(event) => onFilesSelected(event.target.files)}
          />
        </label>
        <button type="submit" disabled={uploading || files.length === 0}>
          {uploading
            ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}`
            : `Upload ${files.length || ""} Media`}
        </button>
      </form>

      {previewItems.length > 0 ? (
        <div className={styles.selectedPreviewGrid}>
          {previewItems.map((item) => (
            <article key={item.url} className={styles.selectedPreviewCard}>
              <div className={styles.selectedPreviewMedia}>
                {item.mediaType === "video" ? (
                  <video src={item.url} controls preload="metadata" />
                ) : (
                  <img src={item.url} alt="Selected media preview" />
                )}
              </div>
              <div>
                <strong>{item.file.name}</strong>
                <span>{item.mediaType} · {(item.file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <button type="button" onClick={() => removeSelectedFile(item.file)} disabled={uploading}>Remove</button>
            </article>
          ))}
        </div>
      ) : null}

      <div className={styles.galleryHeader}>
        <div>
          <h3>Uploaded Media</h3>
          <p>{mediaList.length} item{mediaList.length === 1 ? "" : "s"}</p>
        </div>
        <select value={mediaTypeFilter} onChange={(event) => setMediaTypeFilter(event.target.value)}>
          <option value="">All media</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loadingState}><Spin /> Loading media...</div>
      ) : mediaList.length === 0 ? (
        <div className={styles.emptyState}>No uploaded media found.</div>
      ) : (
        <div className={styles.mediaGrid}>
          {mediaList.map((media, index) => (
            <UploadedMediaCard
              key={getMediaId(media) || index}
              media={media}
              onDelete={onDeleteMedia}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default StoreAssistantUploadMedia;
