import React, { useCallback, useEffect, useRef, useState } from "react";
import { authAPIs, collectionAPIs } from "../../../helper/serverAPIs";
import { current_store_name } from "../../../constants/config";
import { collectionQRCodeGenerator, getStoredKioskLoginUserId } from "../../../helper/utils";
import {
  buildVerifyUrl,
  decryptSigninToken,
  requestSigninWithLink,
} from "../../../helper/autoLogin";
import Modal from "../../modal/Modal";
import CopyToClipboard from "react-copy-to-clipboard";

import {
	CopyOutlined,
} from "@ant-design/icons";
import { KIOSK_LOGIN_CHANGE_EVENT } from "../../../constants/codes";
const KIOSK_LOGIN_STORAGE_KEY = "Kiosk-login";

const INITIAL_COLLECTION_QR_STATE = {
  isOpen: false,
  isLoading: false,
  title: "",
  qrUrl: "",
  shareUrl: "",
  message: "",
};

const KIOSK_COLLECTION_ACTIONS = [
  {
    key: "wishlist",
    label: "Wishlist",
    pathPrefix: "my_wishlist",
    modalTitle: "Wishlist QR",
    emptyMessage: "No wishlist there. Create the Wishlist",
  },
  {
    key: "cart",
    label: "Cart",
    pathPrefix: "my_cart",
    modalTitle: "Cart QR",
    emptyMessage: "No cart there.",
  },
  {
    key: "tryon",
    label: "Try ons",
    modalTitle: "Try on QR",
    emptyMessage: "No try-on there.",
    getFetchParams: (userId) => ({
      collection_name: "my tryons",
      user_id: userId,
      type: "system",
    }),
  },
];

const getStoredKioskLogin = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(sessionStorage.getItem(KIOSK_LOGIN_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

const getGuestLoginName = (user) =>
  user?.user_name   || user?.email || user?.emailId || user?.phone;

const getPhoneValue = (value) => value.replace(/[^\d+]/g, "");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value) => /^\+?\d{10,15}$/.test(getPhoneValue(value));

const getCollectionListFromResponse = (response) => {
  const data = response?.data?.data;

  if (Array.isArray(data)) return data.filter(Boolean);
  if (Array.isArray(data?.data)) return data.data.filter(Boolean);
  if (data && typeof data === "object") return [data];

  return [];
};

const getCollectionProductCount = (collection) => {
  const productLists =
    collection?.product_lists || collection?.product_list || collection?.products;

  return Array.isArray(productLists) ? productLists.filter(Boolean).length : 0;
};

const getFetchedCollection = (response, collectionPath) => {
  const collections = getCollectionListFromResponse(response);

  return (
    collections.find((collection) => collection?.path === collectionPath) ||
    collections.find((collection) => getCollectionProductCount(collection) > 0) ||
    collections[1] ||
    collections[0] ||
    null
  );
};

const buildCollectionVerifyPageParam = (
  collection,
  collectionPath,
  kioskLogin,
  fallbackUserName,
) => {
  const collectionId = collection?._id 
  const userName = collection?.user_name || fallbackUserName || kioskLogin?.user_name;
    if(collection.collection_name === "my cart"){
      return `?page=cart`;
    }
  if (userName && collectionId) {
    return `?page=influencer/${userName}/${collectionId}`;
  }

  if (collection?.user_id && collectionId) {
    return `?page=influencer/shared/${collection.user_id}/${collectionId}`;
  }

  return "";
};

const renderCollectionActionIcon = (actionKey) => {
  if (actionKey === "wishlist") {
    return (
      <svg
        className="w-5 h-5 text-red-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        ></path>
      </svg>
    );
  }

  if (actionKey === "cart") {
    return (
      <svg
        className="w-5 h-5 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
    );
  }

  return (
    <svg
      className="w-5 h-5 text-green-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      ></path>
    </svg>
  );
};

const AuthInput = ({ onLoginChange, styles }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [emailPhone, setEmailPhone] = useState("");
  const [kioskLogin, setKioskLogin] = useState(null);
  const kiosklogin = getStoredKioskLoginUserId();
  // console.log('kioskLogin',kioskLogin);
  
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrState, setQrState] = useState(
    INITIAL_COLLECTION_QR_STATE,
  );
  const [activeCollectionAction, setActiveCollectionAction] = useState("");
  const containerRef = useRef(null);

  const syncKioskLogin = useCallback(
    (login) => {     
      setKioskLogin(login);
      onLoginChange?.(login);
    },
    [onLoginChange,kiosklogin],
  );

  const clearKioskLogin = useCallback(
    ({ resetInput = true } = {}) => {
      if (typeof window !== "undefined"   ) {
        sessionStorage.removeItem(KIOSK_LOGIN_STORAGE_KEY);
        window.dispatchEvent(new Event(KIOSK_LOGIN_CHANGE_EVENT));
      }
      if (resetInput) setEmailPhone("");
      setStatus("");
      setIsDropdownOpen(false);
      syncKioskLogin(null);
      // notifyKioskLoginChange();
    },
    [syncKioskLogin],
  );

 useEffect(() => {
    const storedLogin = getStoredKioskLogin();
    if (!storedLogin){
      setEmailPhone("");
      setStatus("");
      setIsDropdownOpen(false);
      syncKioskLogin(null);
      return;
    } 

    setEmailPhone(getGuestLoginName(storedLogin) || "");
    syncKioskLogin(storedLogin);
  }, [syncKioskLogin,kiosklogin]);

 

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    window.addEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);

    return () => {
      window.removeEventListener(KIOSK_LOGIN_CHANGE_EVENT, syncKioskLogin);
    };
  }, [syncKioskLogin]);

  useEffect(() => {
    if (!isDropdownOpen) return undefined;

    const handleOutsideClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleGuestLogin = useCallback(async () => {
    if (isSubmitting) return;

    const value = emailPhone.trim();
    const isEmail = isValidEmail(value);
    const isPhone = isValidPhone(value);

    if (!value) {
      setStatus("Email or phone number is required");
      return;
    }

    if (!isEmail && !isPhone) {
      setStatus("Enter a valid email or phone number");
      return;
    }

    setIsSubmitting(true);
    setStatus("Logging in...");

    try {
      const phone = isPhone ? getPhoneValue(value) : "";
      const email = isEmail ? value : "";
      const res = await authAPIs.GuestRegisterAPICall({
        emailId: email,
        store: current_store_name,
        phone,
      });
      const responseData = res?.data?.data || {};
      const userId = responseData.user_id;
      const registeredUserName = responseData.user_name;
      const registeredEmail = responseData.email || responseData.emailId;
      const loginName = registeredUserName || registeredEmail;

      if (res?.data?.status_code === 200 && userId) {
        const loginData = {
          user_id: userId,
          user_name: loginName,
          email: registeredEmail,
          phone,
        };

        sessionStorage.setItem(KIOSK_LOGIN_STORAGE_KEY, JSON.stringify(loginData));
        window.dispatchEvent(new Event(KIOSK_LOGIN_CHANGE_EVENT));
        setEmailPhone(loginName);
        syncKioskLogin(loginData);
        setStatus("");
        setIsDropdownOpen(true);
        return;
      }

      clearKioskLogin({ resetInput: false });
      setStatus("Login failed. Please try again.");
    } catch (error) {
      console.error("Kiosk guest login error:", error);
      clearKioskLogin({ resetInput: false });
      setStatus("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [clearKioskLogin, emailPhone, isSubmitting, syncKioskLogin]);

  const handleInputChange = (e) => {
    if (kioskLogin) {
      clearKioskLogin({ resetInput: false });
    }
    setEmailPhone(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!kioskLogin) handleGuestLogin();
    }
  };

  const handleUserButtonClick = () => {
    if (kioskLogin) {
      setIsDropdownOpen((isOpen) => !isOpen);
      return;
    }

    handleGuestLogin();
  };

  const handleLogout = () => {
    clearKioskLogin();
  };

  const handleCollectionActionClick = useCallback(
    async (action) => {
      if (activeCollectionAction) return;

      const userId = kioskLogin?.user_id;
      const kioskEmail = kioskLogin?.email || kioskLogin?.emailId;
      const kioskPhone = kioskLogin?.phone || kioskLogin?.phoneId;
      if (!userId) {
        setStatus("Login is required");
        return;
      }

      const collectionPath = action.pathPrefix ? `${action.pathPrefix}_${userId}` : "";
      const fetchParams = action.getFetchParams
        ? action.getFetchParams(userId)
        : {
            path: collectionPath,
            ...(action.key === "cart" ? { is_display_amount: true } : {}),
          };

      setIsDropdownOpen(false);
      setStatus("");
      setActiveCollectionAction(action.key);
      setQrState({
        ...INITIAL_COLLECTION_QR_STATE,
        isOpen: true,
        isLoading: true,
        title: action.modalTitle,
      });

      try {
        const response = await collectionAPIs.fetchCollectionsAPICall(fetchParams);
        const collection = getFetchedCollection(response, collectionPath);

        const hasCollectionData = action.key === "tryon"
          ? Boolean(collection)
          : getCollectionProductCount(collection) > 0;

        if (!collection || !hasCollectionData) {
          setQrState((prev) => ({
            ...prev,
            isLoading: false,
            message: action.emptyMessage,
          }));
          return;
        }

        if (!kioskEmail && !kioskPhone) {
          setQrState((prev) => ({
            ...prev,
            isLoading: false,
            message: `Email or phone is required to create ${action.label.toLowerCase()} QR.`,
          }));
          return;
        }

        const resp = await requestSigninWithLink(kioskEmail, kioskPhone);
        const signinToken = resp?.signin_token || resp?.data?.signin_token;
        const signinUserName = resp?.data?.user_name || resp?.user_name;

        if (!signinToken) {
          throw new Error(`Missing ${action.label} signin token`);
        }

        const decrypted = decryptSigninToken(signinToken);
        if (!decrypted) {
          throw new Error(`Unable to decode ${action.label} signin token`);
        }

        const pageParam = buildCollectionVerifyPageParam(
          collection,
          collectionPath,
          kioskLogin,
          signinUserName,
        );

        if (!pageParam) {
          throw new Error(`Unable to build ${action.label} page link`);
        }

        const verifyLink = buildVerifyUrl(decrypted, pageParam);
        const fullVerifyUrl = `${window.location.origin}${verifyLink}`;

        setQrState((prev) => ({
          ...prev,
          isLoading: false,
          qrUrl: collectionQRCodeGenerator(fullVerifyUrl),
          shareUrl: fullVerifyUrl,
        }));
      } catch (error) {
        console.error(`${action.label} QR build failed`, error);
        setQrState((prev) => ({
          ...prev,
          isLoading: false,
          message: `Unable to create ${action.label.toLowerCase()} QR.`,
        }));
      } finally {
        setActiveCollectionAction("");
      }
    },
    [activeCollectionAction, kioskLogin],
  );

  const loginName = getGuestLoginName(kioskLogin);

  return (
    <div
      ref={containerRef}
      className={`flex justify-end items-center    ${styles ? styles : " "} gap-4 relative ml-auto`}
    >
      <div
        className={`flex items-center w-full  bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm ${
          kioskLogin ? "w-fit justify-start  " : "justify-end  " 
        }`}
      >
        {!kioskLogin && (
          <input
            type="text"
            placeholder="email/phone number"
            value={emailPhone}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="outline-none border-none bg-transparent text-sm w-40 text-black placeholder-gray-700"
          />
        )}
        <button
          onClick={handleUserButtonClick}
          disabled={isSubmitting}
          title={kioskLogin ? "Open user menu" : "Login"}
          className={`${kioskLogin ? "mr-2" : "ml-2"} bg-black text-white p-2 rounded-full flex items-center justify-center w-8 h-8 ${
            isSubmitting ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        {kioskLogin && (
          <span className="text-sm font-medium text-black whitespace-nowrap">
            {loginName}
          </span>
        )}
      </div>

      {status && (
        <div className="absolute top-12 pt-0.5 right-1 text-xs text-red-500">
          {status}
        </div>
      )}

      {kioskLogin && isDropdownOpen && (
        <div className="absolute top-14 right-0 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-48 z-50">
          {KIOSK_COLLECTION_ACTIONS.map((action) => (
            <button
              key={action.key}
              onClick={() => handleCollectionActionClick(action)}
              disabled={Boolean(activeCollectionAction)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${
                activeCollectionAction ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              {renderCollectionActionIcon(action.key)}
              {activeCollectionAction === action.key ? "Loading..." : action.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              ></path>
            </svg>
            Logout
          </button>
        </div>
      )}

      <Modal
        headerText={qrState.title}
        isOpen={qrState.isOpen}
        onClose={() => setQrState(INITIAL_COLLECTION_QR_STATE)}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4">
          {qrState.isLoading ? (
            <div className="flex h-48 w-48 items-center justify-center bg-gray-100 text-sm text-gray-500">
              Loading QR...
            </div>
          ) : qrState.qrUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrState.qrUrl}
                alt={`${qrState.title} code`}
                className="h-48 w-48 object-contain"
              />
            </>
          ) : (
            <div className="flex min-h-32 w-full items-center justify-center rounded bg-gray-100 px-4 text-center text-sm text-gray-600">
              {qrState.message || "QR unavailable"}
            </div>
          )}
          {qrState.shareUrl ? (
           	<div className='border p-1 rounded flex break-all text-base mb-2 md:text-lg '>
							{qrState.shareUrl}{" "}
							<CopyToClipboard className='text-lg'
								text={qrState.shareUrl}
								onCopy={() => message.success("Copied", 1)}>
								<CopyOutlined className='text-xl flex ml-auto' />
							</CopyToClipboard>  
						</div> 
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default AuthInput;
