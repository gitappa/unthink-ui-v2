import React from "react";
import { FiEye, FiEyeOff, FiImage, FiMove } from "react-icons/fi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { getCollectionNameToShow } from "../../../helper/utils";
import { isAdminLookBook } from "./storeAssistantLookBooksApi";
import styles from "./StoreAssistantLookBooks.module.scss";

const LookBookCollectionCard = ({ collection, updatingId, onToggleVisibility, disabled }) => {
  const lookBook = collection;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lookBook._id, disabled });
  const isVisible = !!lookBook.starred;
  const ownerType = isAdminLookBook(lookBook) ? "Admin" : "Influencer";
  const updating = updatingId === lookBook._id;
  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={cardStyle}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ""}`}
    >
      <button
        type="button"
        className={styles.dragHandle}
        aria-label="Drag to reorder"
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <FiMove />
      </button>
      <div className={styles.coverWrap}>
        {lookBook.cover_image ? (
          <img src={lookBook.cover_image} alt={getCollectionNameToShow(lookBook)} />
        ) : (
          <div className={styles.emptyCover}>
            <FiImage />
          </div>
        )}
        <span className={isVisible ? styles.visibleBadge : styles.hiddenBadge}>
          {isVisible ? <FiEye /> : <FiEyeOff />}
          {isVisible ? "Visible in Kiosk" : "Hidden from Kiosk"}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div>
          <p className={styles.ownerLabel}>{ownerType}</p>
          <h3>{getCollectionNameToShow(lookBook)}</h3>
          {lookBook.user_name ? <p className={styles.creatorName}>by {lookBook.user_name}</p> : null}
        </div>

        <button
          type="button"
          className={isVisible ? styles.secondaryButton : styles.primaryButton}
          disabled={updating || disabled}
          onClick={() => onToggleVisibility(lookBook)}
        >
          {updating ? "Saving..." : isVisible ? "Unshowcase" : "Showcase"}
        </button>
      </div>
    </article>
  );
};

export default LookBookCollectionCard;
