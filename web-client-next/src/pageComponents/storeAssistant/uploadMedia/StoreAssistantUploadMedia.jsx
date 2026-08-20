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

const getSelectedMediaItemId = (file, index) =>
  `${file.name}-${file.size}-${file.lastModified}-${index}`;

const StoreAssistantUploadMedia = () => {
  const [authUser, storeData] = useSelector((state) => [state.auth.user.data, state.store.data]);
  const storeName = getStoreName(storeData);
  const identity = useMemo(() => getMediaIdentity(authUser), [authUser]);
  const [selectedMediaItems, setSelectedMediaItems] = useState([]);
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
    const nextPreviewItems = selectedMediaItems.map((item) => ({
      ...item,
      url: URL.createObjectURL(item.file),
      mediaType: getMediaTypeFromFile(item.file),
    }));

    setPreviewItems(nextPreviewItems);

    return () => {
      nextPreviewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [selectedMediaItems]);

  const onFilesSelected = (fileList) => {
    setSelectedMediaItems(
      Array.from(fileList || []).map((file, index) => ({
        id: getSelectedMediaItemId(file, index),
        file,
        title: "",
        description: "",
      }))
    );
  };

  const removeSelectedFile = (itemId) => {
    setSelectedMediaItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const updateSelectedMediaMetadata = (itemId, field, value) => {
    setSelectedMediaItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const onUploadSubmit = async (event) => {
    event.preventDefault();
    if (selectedMediaItems.length === 0) {
      notification.warning({ message: "Select media files first" });
      return;
    }
    if (!storeName) {
      notification.error({ message: "Store is missing" });
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: selectedMediaItems.length });
    let successCount = 0;
    let failedCount = 0;

    try {
      for (let index = 0; index < selectedMediaItems.length; index += 1) {
        const selectedItem = selectedMediaItems[index];
        const selectedFile = selectedItem.file;
        const mediaType = getMediaTypeFromFile(selectedFile);
        setUploadProgress({ current: index + 1, total: selectedMediaItems.length });

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
            title: selectedItem.title.trim(),
            description: selectedItem.description.trim(),
          });
          successCount += 1;
        } catch (error) {
          failedCount += 1;
        }
      }

      if (successCount > 0) {
        notification.success({ message: `${successCount} media file${successCount === 1 ? "" : "s"} uploaded` });
        setSelectedMediaItems([]);
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
          <span>{selectedMediaItems.length ? `${selectedMediaItems.length} file${selectedMediaItems.length === 1 ? "" : "s"} selected` : "Choose images or videos"}</span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(event) => onFilesSelected(event.target.files)}
          />
        </label>
        <button type="submit" disabled={uploading || selectedMediaItems.length === 0}>
          {uploading
            ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}`
            : `Upload ${selectedMediaItems.length || ""} Media`}
        </button>
      </form>

      {previewItems.length > 0 ? (
        <div className={styles.selectedPreviewGrid}>
          {previewItems.map((item) => (
            <article key={item.id} className={styles.selectedPreviewCard}>
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
              <div className={styles.selectedMetadataFields}>
                <label>
                  Title <small>optional</small>
                  <input
                    type="text"
                    value={item.title}
                    placeholder="Add media title"
                    disabled={uploading}
                    onChange={(event) => updateSelectedMediaMetadata(item.id, "title", event.target.value)}
                  />
                </label>
                <label>
                  Description <small>optional</small>
                  <textarea
                    value={item.description}
                    placeholder="Add a short description"
                    disabled={uploading}
                    onChange={(event) => updateSelectedMediaMetadata(item.id, "description", event.target.value)}
                  />
                </label>
              </div>
              <button type="button" onClick={() => removeSelectedFile(item.id)} disabled={uploading}>Remove</button>
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
