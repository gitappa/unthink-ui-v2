import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FiBell, FiRefreshCw, FiX } from "react-icons/fi";

import { current_store_name, event_app_api_base_url } from "../../../constants/config";
import {
  fetchStoreAssistantEventTemplates,
  fetchStoreAssistantRealtimeFeed,
} from "./realtimeFeedApi";
import { getPaginationItems } from "./realtimeFeedFormatters";
import RealtimeFeedCard from "./RealtimeFeedCard";
import styles from "./StoreAssistantRealtimeFeed.module.scss";

const PAGE_SIZE = 25;

const StoreAssistantRealtimeFeed = ({ settings }) => {
  const [storeData] = useSelector((state) => [state.store.data]);
  const storeName = storeData?.store_name || current_store_name;
  const apiBaseUrl = event_app_api_base_url;
  const [templates, setTemplates] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [timeRange, setTimeRange] = useState(7);
  const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });
  const [contactInput, setContactInput] = useState("");
  const [contact, setContact] = useState("");
  const [page, setPage] = useState(1);
  const [alerts, setAlerts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total_count: 0, page_start: 0, page_end: 0 });
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const isCustomRange = timeRange === "custom";
  const paginationItems = useMemo(
    () => getPaginationItems(pagination.page || 1, pagination.total_pages || 1),
    [pagination.page, pagination.total_pages]
  );

  useEffect(() => {
    if (!apiBaseUrl || !storeName) return;

    let cancelled = false;
    setLoadingTemplates(true);
    setError("");
    fetchStoreAssistantEventTemplates({ apiBaseUrl, store: storeName })
      .then((response) => {
        if (cancelled) return;
        const nextTemplates = response.data || [];
        setTemplates(nextTemplates);
        setSelectedEventId((current) => current || nextTemplates[0]?.event_id || "");
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load events");
      })
      .finally(() => {
        if (!cancelled) setLoadingTemplates(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, storeName]);

  useEffect(() => {
    if (!apiBaseUrl || !storeName || !selectedEventId) {
      setAlerts([]);
      return;
    }

    let cancelled = false;
    setLoadingFeed(true);
    setError("");

    fetchStoreAssistantRealtimeFeed({
      apiBaseUrl,
      store: storeName,
      eventId: selectedEventId,
      timeRange: isCustomRange ? undefined : timeRange,
      startDate: isCustomRange ? customRange.startDate : undefined,
      endDate: isCustomRange ? customRange.endDate : undefined,
      contact,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        setAlerts(response.data || []);
        setPagination(response.pagination || {});
      })
      .catch((err) => {
        if (!cancelled) {
          setAlerts([]);
          setPagination({ page: 1, total_pages: 1, total_count: 0, page_start: 0, page_end: 0 });
          setError(err.message || "Failed to load real-time feed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingFeed(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, contact, customRange.endDate, customRange.startDate, isCustomRange, page, selectedEventId, storeName, timeRange]);

  const resetToFirstPage = () => setPage(1);

  return (
    <section className={styles.feedShell}>
      <div className={styles.feedHeader}>
        <div>
          <h2>Real-time Feed</h2>
          <p>Showing {pagination.page_start || 0}-{pagination.page_end || 0} of {pagination.total_count || 0} records</p>
        </div>
        <button type="button" onClick={() => setPage((current) => current)} disabled={loadingFeed}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <form
        className={styles.filters}
        onSubmit={(event) => {
          event.preventDefault();
          setContact(contactInput.trim());
          resetToFirstPage();
        }}
      >
        <label>
          <span>Select Event</span>
          <select value={selectedEventId} onChange={(event) => { setSelectedEventId(event.target.value); resetToFirstPage(); }} disabled={loadingTemplates}>
            <option value="">-- Select an Event --</option>
            {templates.map((template) => (
              <option key={template.id} value={template.event_id}>{template.name}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Time Range</span>
          <select value={timeRange} onChange={(event) => { setTimeRange(event.target.value === "custom" ? "custom" : Number(event.target.value)); resetToFirstPage(); }}>
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </label>

        {isCustomRange ? (
          <>
            <label>
              <span>Start Date</span>
              <input type="date" value={customRange.startDate} onChange={(event) => { setCustomRange((current) => ({ ...current, startDate: event.target.value })); resetToFirstPage(); }} />
            </label>
            <label>
              <span>End Date</span>
              <input type="date" value={customRange.endDate} onChange={(event) => { setCustomRange((current) => ({ ...current, endDate: event.target.value })); resetToFirstPage(); }} />
            </label>
          </>
        ) : null}

        <label className={styles.contactFilter}>
          <span>Email / Phone</span>
          <div>
            <input value={contactInput} onChange={(event) => setContactInput(event.target.value)} placeholder="Exact email or phone" />
            <button type="submit">Filter</button>
            {contact ? <button type="button" onClick={() => { setContactInput(""); setContact(""); resetToFirstPage(); }}>Clear</button> : null}
          </div>
        </label>
      </form>

      {error ? <div className={styles.errorState}>{error}</div> : null}

      {loadingFeed ? (
        <div className={styles.loadingState}>Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className={styles.emptyState}>
          <FiBell />
          <h3>No alerts</h3>
          <p>New real-time feed records will appear here.</p>
        </div>
      ) : (
        <div className={styles.feedList}>
          {alerts.map((alert) => <RealtimeFeedCard key={alert.id} alert={alert} onPreviewImage={setPreviewImage} />)}
        </div>
      )}

      {pagination.total_count > PAGE_SIZE ? (
        <div className={styles.pagination}>
          {paginationItems.map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              disabled={loadingFeed || pageNumber === pagination.page}
              className={pageNumber === pagination.page ? styles.activePage : ""}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      ) : null}

      {previewImage ? (
        <div className={styles.previewOverlay} onClick={() => setPreviewImage("")}>
          <div className={styles.previewDialog} onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setPreviewImage("")}><FiX /> Close</button>
            <img src={previewImage} alt="Selected feed preview" />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default StoreAssistantRealtimeFeed;
