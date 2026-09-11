import React, { useCallback, useEffect, useState } from "react";
import { Drawer, Modal, notification, Spin } from "antd";
import { useSelector } from "react-redux";
import { FiEdit2, FiEye, FiImage, FiRefreshCw, FiShoppingBag, FiStar, FiTrash2 } from "react-icons/fi";
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
import CustomProductModal from "../../customProductModal/CustomProductModal";
import { getCollectionNameToShow } from "../../../helper/utils";
import {
  fetchStoreAssistantLookBooks,
  fetchStoreAssistantTrendingCollections,
  removeLookBookProduct,
  reorderLookBookCollections,
  updateLookBookCollectionDetails,
  updateLookBookProductStar,
  updateLookBookKioskVisibility,
} from "./storeAssistantLookBooksApi";
import styles from "./StoreAssistantLookBooks.module.scss";

const getProductImage = (product) => product?.image || product?.image_url || product?.img_url || product?.thumbnail || "";
const getProductName = (product) => product?.name || product?.product_name || product?.title || "Untitled product";
const getProductPrice = (product) => product?.display_amount || product?.sale_price || product?.price || "";
const getProductMfrCode = (product) => product?.mfr_code || "";
const getProductCode = (product) => product?.mfr_code || product?.sku || product?.product_id || "";
const getLookBookProducts = (collection) => collection?.product_lists || collection?.product_list || [];
const COLLECTION_MODES = {
  lookbooks: {
    title: "LookBooks",
    previewTitle: "Kiosk Look Books preview",
    kioskTabTitle: "Look Books tab",
    description: "Showcasing controls whether a published lookbook appears in the kiosk Look Books tab.",
    emptyTitle: "No published lookbooks found",
    emptyDescription: "Published admin and influencer lookbook collections will appear here.",
    previewEmpty: "Showcase lookbooks to see the kiosk preview here.",
    productsEmpty: "This lookbook does not have products in the fetched dashboard data.",
    productCountLabel: "products in this lookbook",
    updatedMessage: "Lookbook updated",
    deleteProductMessage: "Product deleted from lookbook",
    fetchError: "Failed to fetch lookbooks",
    updateError: "Failed to update lookbook",
    collectionSingular: "Lookbook",
    fetchCollections: fetchStoreAssistantLookBooks,
  },
  trending: {
    title: "Trending",
    previewTitle: "Kiosk Trending preview",
    kioskTabTitle: "#Trending tab",
    description: "Showcasing controls whether a published trending collection appears in the kiosk #Trending tab.",
    emptyTitle: "No published trending collections found",
    emptyDescription: "Published trending collections will appear here.",
    previewEmpty: "Showcase trending collections to see the kiosk preview here.",
    productsEmpty: "This trending collection does not have products in the fetched dashboard data.",
    productCountLabel: "products in this trending collection",
    updatedMessage: "Trending collection updated",
    deleteProductMessage: "Product deleted from trending collection",
    fetchError: "Failed to fetch trending collections",
    updateError: "Failed to update trending collection",
    collectionSingular: "Trending collection",
    fetchCollections: fetchStoreAssistantTrendingCollections,
  },
};
const updateLookBookProducts = (collection, updater) => {
  if (!collection) return collection;

  const productKey = collection.product_lists ? "product_lists" : "product_list";
  return {
    ...collection,
    [productKey]: updater(getLookBookProducts(collection)),
  };
};

const LookBookKioskPreview = ({ collections = [], config }) => {
  const visibleLookBooks = collections.filter((collection) => collection?.starred && collection?.cover_image && collection?.path);
  const desktopColumns = [0, 1, 2, 3].map((columnIndex) =>
    visibleLookBooks.filter((_, index) => index % 4 === columnIndex)
  );
  const tileStyles = [styles.tallPreviewTile, styles.shortPreviewTile];

  return (
    <div className={styles.previewShell}>
      <div className={styles.previewHeader}>
        <div>
          <p>Kiosk Preview</p>
          <h3>{config.kioskTabTitle}</h3>
        </div>
        <span>{visibleLookBooks.length} showcased</span>
      </div>

      {visibleLookBooks.length ? (
        <>
          <div className={styles.mobilePreviewGrid}>
            {visibleLookBooks.map((lookBook) => (
              <div className={styles.previewTile} key={lookBook._id}>
                <img src={lookBook.cover_image} alt={getCollectionNameToShow(lookBook)} loading="lazy" />
                <div>{getCollectionNameToShow(lookBook) || "Untitled collection"}</div>
              </div>
            ))}
          </div>
          <div className={styles.desktopPreviewGrid}>
            {desktopColumns.map((columnLookBooks, columnIndex) => (
              <div className={styles.previewColumn} key={columnIndex}>
                {columnLookBooks.map((lookBook, lookBookIndex) => (
                  <div
                    className={`${styles.previewTile} ${tileStyles[(columnIndex + lookBookIndex) % tileStyles.length]}`}
                    key={lookBook._id}
                  >
                    <img src={lookBook.cover_image} alt={getCollectionNameToShow(lookBook)} loading="lazy" />
                    <div>{getCollectionNameToShow(lookBook) || "Untitled collection"}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.previewEmpty}>{config.previewEmpty}</div>
      )}
    </div>
  );
};

const StoreAssistantLookBooks = ({ mode = "lookbooks" }) => {
  const config = COLLECTION_MODES[mode] || COLLECTION_MODES.lookbooks;
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [reordering, setReordering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [drawerMode, setDrawerMode] = useState(null);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [editCollectionName, setEditCollectionName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingCollection, setSavingCollection] = useState(false);
  const [productActionId, setProductActionId] = useState("");
  const [hasUnsavedOrderChanges, setHasUnsavedOrderChanges] = useState(false);
  const selectedProducts = getLookBookProducts(selectedCollection);
  const selectedCollectionName = selectedCollection ? getCollectionNameToShow(selectedCollection) || config.collectionSingular : config.collectionSingular;
  const storeData = useSelector((state) => state.store.data || {});
  const {
    sellerDetails,
    templates: storeTemplates,
    catalog_attributes,
    filter_settings,
  } = storeData;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const loadLookBooks = useCallback(async () => {
    setLoading(true);
    try {
      setCollections(await config.fetchCollections());
      setHasUnsavedOrderChanges(false);
    } catch (error) {
      notification.error({ message: error.message || config.fetchError });
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadLookBooks();
  }, [loadLookBooks]);

  useEffect(() => {
    setDrawerMode(null);
    setDrawerProduct(null);
    setEditCollectionName(selectedCollection ? getCollectionNameToShow(selectedCollection) || "" : "");
    setEditDescription(selectedCollection?.description || "");
  }, [selectedCollection]);

  const closeDrawer = () => {
    setDrawerMode(null);
    setDrawerProduct(null);
  };

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
          ? `${config.collectionSingular} showcased in kiosk`
          : `${config.collectionSingular} removed from kiosk showcase`,
      });
    } catch (error) {
      notification.error({ message: error.message || config.updateError });
    } finally {
      setUpdatingId("");
    }
  };

  const onSaveOrder = async () => {
    if (!hasUnsavedOrderChanges) return;

    setReordering(true);
    try {
      await reorderLookBookCollections(collections);
      setHasUnsavedOrderChanges(false);
      notification.success({ message: `${config.collectionSingular} order updated` });
    } catch (error) {
      notification.error({ message: error.message || `Failed to reorder ${config.title.toLowerCase()}` });
    } finally {
      setReordering(false);
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || reordering) return;

    const oldIndex = collections.findIndex((collection) => collection._id === active.id);
    const newIndex = collections.findIndex((collection) => collection._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const nextCollections = arrayMove(collections, oldIndex, newIndex);
    setCollections(nextCollections);
    setHasUnsavedOrderChanges(true);
  };

  const replaceCollection = (collectionId, updater) => {
    setCollections((currentCollections) =>
      currentCollections.map((collection) =>
        collection._id === collectionId ? updater(collection) : collection
      )
    );
    setSelectedCollection((currentCollection) =>
      currentCollection?._id === collectionId ? updater(currentCollection) : currentCollection
    );
  };

  const onShowProduct = (product) => {
    setDrawerProduct(product);
    setDrawerMode("productView");
  };

  const onEditProduct = (product) => {
    setDrawerProduct(product);
    setDrawerMode("productEdit");
  };

  const onProductSaved = (updatedProduct) => {
    const collectionId = selectedCollection?._id;
    const mfrCode = getProductMfrCode(updatedProduct);
    if (!collectionId || !mfrCode) return;

    replaceCollection(collectionId, (collection) =>
      updateLookBookProducts(collection, (products) =>
        products.map((item) => (getProductMfrCode(item) === mfrCode ? { ...item, ...updatedProduct } : item))
      )
    );
    setDrawerProduct((currentProduct) =>
      getProductMfrCode(currentProduct) === mfrCode ? { ...currentProduct, ...updatedProduct } : currentProduct
    );
    closeDrawer();
  };

  const onEditCollection = () => {
    if (!selectedCollection?._id) return;

    setDrawerProduct(null);
    setDrawerMode("collectionEdit");
  };

  const onSaveCollection = async () => {
    const collectionId = selectedCollection?._id;
    if (!collectionId) return;

    setSavingCollection(true);
    try {
      await updateLookBookCollectionDetails({
        collectionId,
        collectionName: editCollectionName,
        description: editDescription,
      });
      replaceCollection(collectionId, (collection) => ({
        ...collection,
        collection_name: editCollectionName,
        name: collection.name ? editCollectionName : collection.name,
        description: editDescription,
      }));
      closeDrawer();
      notification.success({ message: config.updatedMessage });
    } catch (error) {
      notification.error({ message: error.message || config.updateError });
    } finally {
      setSavingCollection(false);
    }
  };

  const deleteProduct = async (product) => {
    const collectionId = selectedCollection?._id;
    const mfrCode = getProductMfrCode(product);
    const actionId = `delete-${mfrCode}`;

    setProductActionId(actionId);
    try {
      await removeLookBookProduct({ collectionId, mfrCode });
      replaceCollection(collectionId, (collection) =>
        updateLookBookProducts(collection, (products) => products.filter((item) => getProductMfrCode(item) !== mfrCode))
      );
      setDrawerProduct((currentProduct) => (getProductMfrCode(currentProduct) === mfrCode ? null : currentProduct));
      if (getProductMfrCode(drawerProduct) === mfrCode) closeDrawer();
      notification.success({ message: config.deleteProductMessage });
    } catch (error) {
      notification.error({ message: error.message || "Failed to delete product" });
    } finally {
      setProductActionId("");
    }
  };

  const onDeleteProduct = (product) => {
    Modal.confirm({
      title: "Delete product?",
      content: "This product will be deleted permanently from this collection.",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => deleteProduct(product),
    });
  };

  const onToggleProductStar = async (product) => {
    const collectionId = selectedCollection?._id;
    const mfrCode = getProductMfrCode(product);
    const starred = !product?.starred;
    const actionId = `star-${mfrCode}`;

    setProductActionId(actionId);
    try {
      await updateLookBookProductStar({ collectionId, product, starred });
      replaceCollection(collectionId, (collection) =>
        updateLookBookProducts(collection, (products) => {
          const updatedProducts = products.map((item) => (getProductMfrCode(item) === mfrCode ? { ...item, starred } : item));
          if (!starred) return updatedProducts;

          const starredProduct = updatedProducts.find((item) => getProductMfrCode(item) === mfrCode);
          return [starredProduct, ...updatedProducts.filter((item) => getProductMfrCode(item) !== mfrCode)].filter(Boolean);
        })
      );
      setDrawerProduct((currentProduct) =>
        getProductMfrCode(currentProduct) === mfrCode ? { ...currentProduct, starred } : currentProduct
      );
      notification.success({ message: starred ? "Product showcased on top" : "Product removed from top showcase" });
    } catch (error) {
      notification.error({ message: error.message || "Failed to update product" });
    } finally {
      setProductActionId("");
    }
  };

  const drawerTitle = {
    collectionEdit: "Edit Collection",
    productEdit: "Edit Product",
    productView: drawerProduct ? getProductName(drawerProduct) : "Product Details",
  }[drawerMode] || "Details";

  return (
    <section className={styles.lookBooksShell}>
      <div className={styles.header}>
        <div>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
          <small>Drag cards to control the order shown in kiosk.</small>
        </div>
        <div className={styles.headerActions}>
          {hasUnsavedOrderChanges ? (
            <button type="button" className={styles.saveOrderButton} onClick={onSaveOrder} disabled={reordering}>
              {reordering ? "Saving..." : "Save Order"}
            </button>
          ) : null}
          <button type="button" onClick={() => setShowPreview(true)} disabled={loading}>
            <FiEye /> Preview
          </button>
          <button type="button" onClick={loadLookBooks} disabled={loading || reordering}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {hasUnsavedOrderChanges ? (
        <div className={styles.unsavedOrderNotice}>
          You have unsaved order changes. Preview before saving to confirm how it will look in kiosk.
        </div>
      ) : null}

      {loading ? (
        <div className={styles.loadingState}>
          <Spin size="large" />
          <p>Loading {config.title.toLowerCase()}...</p>
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
                  onShowProducts={setSelectedCollection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={styles.emptyState}>
          <h3>{config.emptyTitle}</h3>
          <p>{config.emptyDescription}</p>
        </div>
      )}

      <Modal
        title={config.previewTitle}
        open={showPreview}
        footer={null}
        width={1080}
        onCancel={() => setShowPreview(false)}
      >
        <LookBookKioskPreview collections={collections} config={config} />
      </Modal>

      <Modal
        title={`${selectedCollectionName} products`}
        open={!!selectedCollection}
        footer={null}
        width={920}
        onCancel={() => setSelectedCollection(null)}
      >
        <div className={styles.productsModalHeader}>
          <p>{selectedProducts.length} {config.productCountLabel}</p>
          <button type="button" onClick={onEditCollection} disabled={!selectedCollection?._id}>
            <FiEdit2 /> Edit Collection
          </button>
        </div>
        {selectedProducts.length ? (
          <div className={styles.productsGrid}>
            {selectedProducts.map((product, index) => {
              const productImage = getProductImage(product);
              const productPrice = getProductPrice(product);
              const productCode = getProductCode(product);
              const productMfrCode = getProductMfrCode(product);
              const deleting = productActionId === `delete-${productMfrCode}`;
              const starring = productActionId === `star-${productMfrCode}`;

              return (
                <div className={styles.productCard} key={productCode || product?._id || index}>
                  <div className={styles.productImageWrap}>
                    {productImage ? <img src={productImage} alt={getProductName(product)} loading="lazy" /> : <FiImage />}
                  </div>
                  <div className={styles.productInfo}>
                    <h4>{getProductName(product)}</h4>
                    {productPrice ? <p>{productPrice}</p> : null}
                    {productCode ? <small>{productCode}</small> : null}
                  </div>
                  <div className={styles.productActions}>
                    <button type="button" onClick={() => onShowProduct(product)}>
                      <FiEye /> Show
                    </button>
                    <button type="button" onClick={() => onEditProduct(product)}>
                      <FiEdit2 /> Edit
                    </button>
                    <button type="button" onClick={() => onToggleProductStar(product)} disabled={!productMfrCode || !!productActionId}>
                      <FiStar /> {starring ? "Saving..." : product?.starred ? "Unstar" : "Star"}
                    </button>
                    <button type="button" onClick={() => onDeleteProduct(product)} disabled={!productMfrCode || !!productActionId}>
                      <FiTrash2 /> {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.productsEmpty}>
            <FiShoppingBag />
            <h4>No products found</h4>
            <p>{config.productsEmpty}</p>
          </div>
        )}
      </Modal>

      <Drawer
        title={drawerTitle}
        open={!!drawerMode}
        width={620}
        placement="right"
        destroyOnClose
        onClose={closeDrawer}
      >
        {drawerMode === "productView" && drawerProduct ? (
          <div className={styles.productDetailsPanel}>
            <div className={styles.productDetailsImage}>
              {getProductImage(drawerProduct) ? (
                <img src={getProductImage(drawerProduct)} alt={getProductName(drawerProduct)} loading="lazy" />
              ) : (
                <FiImage />
              )}
            </div>
            <div className={styles.productDetailsContent}>
              <h3>{getProductName(drawerProduct)}</h3>
              {getProductPrice(drawerProduct) ? <p>{getProductPrice(drawerProduct)}</p> : null}
              {getProductCode(drawerProduct) ? <small>{getProductCode(drawerProduct)}</small> : null}
              {drawerProduct?.brand ? <span>Brand: {drawerProduct.brand}</span> : null}
              {drawerProduct?.description ? <span>{drawerProduct.description}</span> : null}
            </div>
          </div>
        ) : null}
        {drawerMode === "collectionEdit" ? (
          <div className={styles.collectionEditPanel}>
            <label>
              Collection name
              <input value={editCollectionName} onChange={(event) => setEditCollectionName(event.target.value)} />
            </label>
            <label>
              Description
              <textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} rows={3} />
            </label>
            <div className={styles.collectionEditActions}>
              <button type="button" onClick={closeDrawer} disabled={savingCollection}>
                Cancel
              </button>
              <button type="button" onClick={onSaveCollection} disabled={savingCollection || !editCollectionName.trim()}>
                {savingCollection ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : null}
        {drawerMode === "productEdit" && drawerProduct ? (
          <CustomProductModal
            isModalOpen={!!drawerProduct}
            data={{ data: drawerProduct, isView: false, collectionId: selectedCollection?._id }}
            onModalClose={closeDrawer}
            sellerDetails={sellerDetails}
            allowEdit
            storeTemplates={storeTemplates || {}}
            catalog_attributes={catalog_attributes || []}
            filter_settings={filter_settings || { available_filters: [] }}
            renderInline
            onProductSaved={onProductSaved}
            userIdOverride={selectedCollection?.user_id}
          />
        ) : null}
      </Drawer>
    </section>
  );
};

export default StoreAssistantLookBooks;
