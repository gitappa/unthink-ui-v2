import React, { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { normalizeStoreAssistantSettings } from "../utils/normalizeStoreAssistantSettings";
import { hasStoreAssistantAccess } from "../utils/storeAssistantAccess";
import styles from "../StoreAssistantDashboard.module.scss";

const AUTH_CHECK_DELAY_MS = 900;

const StoreAssistantProtected = ({ children }) => {
  const router = useRouter();
  const [readyToCheck, setReadyToCheck] = useState(false);
  const [authUser, isUserLogin, isUserFetching, storeData] = useSelector((state) => [
    state.auth.user.data,
    state.auth.user.isUserLogin,
    state.auth.user.isFetching,
    state.store.data,
  ]);

  const settings = useMemo(
    () => normalizeStoreAssistantSettings(storeData?.store_assistant_settings),
    [storeData?.store_assistant_settings]
  );

  const hasAccess = useMemo(
    () =>
      hasStoreAssistantAccess({
        isUserLogin,
        authUser,
        settings,
        storeAssistantList: storeData?.store_assistant_list,
      }),
    [authUser, isUserLogin, settings, storeData?.store_assistant_list]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setReadyToCheck(true), AUTH_CHECK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!readyToCheck || isUserFetching || isUserLogin) return;
    router.replace(`/signin?page=${encodeURIComponent("/store-assistant")}`);
  }, [isUserFetching, isUserLogin, readyToCheck, router]);

  if (!readyToCheck || isUserFetching) {
    return (
      <div className={styles.accessState}>
        <Spin size="large" />
        <p>Preparing Store Assistant...</p>
      </div>
    );
  }

  if (!isUserLogin) {
    return (
      <div className={styles.accessState}>
        <Spin size="large" />
        <p>Redirecting to sign in...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={styles.accessState}>
        <div className={styles.accessCard}>
          <h1>Store Assistant access required</h1>
          <p>Your account is signed in, but it is not enabled for this dashboard.</p>
          <button type="button" onClick={() => router.replace("/")}>Back to store</button>
        </div>
      </div>
    );
  }

  return children;
};

export default StoreAssistantProtected;
