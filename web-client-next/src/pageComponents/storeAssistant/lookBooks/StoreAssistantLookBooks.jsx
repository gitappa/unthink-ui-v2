import React, { useCallback, useEffect, useState } from "react";
import { notification, Spin } from "antd";
import { FiRefreshCw } from "react-icons/fi";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import LookBookCollectionCard from "./LookBookCollectionCard";
import {
  fetchStoreAssistantLookBooks,
  reorderLookBookCollections,
  updateLookBookKioskVisibility,
} from "./storeAssistantLookBooksApi";
import styles from "./StoreAssistantLookBooks.module.scss";

const StoreAssistantLookBooks = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [reordering, setReordering] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const loadLookBooks = useCallback(async () => {
    setLoading(true);
    try {
      setCollections(await fetchStoreAssistantLookBooks());
    } catch (error) {
      notification.error({ message: error.message || "Failed to fetch lookbooks" });
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLookBooks();
  }, [loadLookBooks]);

  const onToggleVisibility = async (collection) => {
    setUpdatingId(collection._id);
    try {
      const updatedCollection = await updateLookBookKioskVisibility(collection);
      setCollections((currentCollections) =>
        currentCollections.map((item) =>
          item._id === updatedCollection._id ? { ...item, starred: updatedCollection.starred } : item
        )
      );
      notification.success({
        message: updatedCollection.starred
          ? "Lookbook showcased in kiosk"
          : "Lookbook removed from kiosk showcase",
      });
    } catch (error) {
      notification.error({ message: error.message || "Failed to update lookbook" });
    } finally {
      setUpdatingId("");
    }
  };

  const persistLookBookOrder = async (nextCollections, previousCollections) => {
    setCollections(nextCollections);
    setReordering(true);
    try {
      await reorderLookBookCollections(nextCollections);
      notification.success({ message: "Lookbook order updated" });
    } catch (error) {
      setCollections(previousCollections);
      notification.error({ message: error.message || "Failed to reorder lookbooks" });
    } finally {
      setReordering(false);
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || reordering) return;

    const oldIndex = collections.findIndex((collection) => collection._id === active.id);
    const newIndex = collections.findIndex((collection) => collection._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previousCollections = collections;
    const nextCollections = arrayMove(collections, oldIndex, newIndex);
    persistLookBookOrder(nextCollections, previousCollections);
  };

  return (
    <section className={styles.lookBooksShell}>
      <div className={styles.header}>
        <div>
          <h2>LookBooks</h2>
          <p>Showcasing controls whether a published lookbook appears in the kiosk Look Books tab.</p>
          <small>Drag cards to control the order shown in kiosk.</small>
        </div>
        <button type="button" onClick={loadLookBooks} disabled={loading || reordering}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <Spin size="large" />
          <p>Loading lookbooks...</p>
        </div>
      ) : collections.length ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={collections.map((collection) => collection._id)} strategy={rectSortingStrategy}>
            <div className={styles.grid}>
              {collections.map((collection) => (
                <LookBookCollectionCard
                  key={collection._id}
                  collection={collection}
                  updatingId={updatingId}
                  disabled={reordering}
                  onToggleVisibility={onToggleVisibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={styles.emptyState}>
          <h3>No published lookbooks found</h3>
          <p>Published admin and influencer lookbook collections will appear here.</p>
        </div>
      )}
    </section>
  );
};

export default StoreAssistantLookBooks;
