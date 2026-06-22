import React, { useCallback, useEffect, useRef, useState } from "react";
import { authAPIs } from "../../../helper/serverAPIs";
import { current_store_name } from "../../../constants/config";

const KIOSK_LOGIN_STORAGE_KEY = "Kiosk-login";

const getStoredKioskLogin = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(sessionStorage.getItem(KIOSK_LOGIN_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

const getGuestLoginName = (user) =>
  user?.user_name || user?.username || user?.email || user?.emailId || user?.phone;

const getPhoneValue = (value) => value.replace(/[^\d+]/g, "");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value) => /^\+?\d{10,15}$/.test(getPhoneValue(value));

const AuthInput = ({ onLoginChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [emailPhone, setEmailPhone] = useState("");
  const [kioskLogin, setKioskLogin] = useState(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef(null);

  const syncKioskLogin = useCallback(
    (login) => {
      setKioskLogin(login);

    },
    [onLoginChange],
  );

  const clearKioskLogin = useCallback(
    ({ resetInput = true } = {}) => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(KIOSK_LOGIN_STORAGE_KEY);
      }
      if (resetInput) setEmailPhone("");
      setStatus("");
      setIsDropdownOpen(false);
      syncKioskLogin(null);
    },
    [syncKioskLogin],
  );

  useEffect(() => {
    const storedLogin = getStoredKioskLogin();
    if (!storedLogin) return;

    setEmailPhone(getGuestLoginName(storedLogin) || "");
    syncKioskLogin(storedLogin);
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
      const registeredUserName = responseData.user_name 
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

  const loginName = getGuestLoginName(kioskLogin);

  return (
    <div
      ref={containerRef}
      className="flex justify-end items-center mb-6 gap-4 relative"
    >
      <div
        className={`flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm ${
          kioskLogin ? "w-fit" : ""
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
          {/* User SVG */}
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
        <div className="absolute top-12 text-red-500 pt-0.5 right-1 text-xs text-gray-700">
          {status}
        </div>
      )}

      {kioskLogin && isDropdownOpen && (
        <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-48 z-50">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
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
            Wishlist
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
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
            Cart
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
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
            Try on
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50   "
          >
            <svg
              className="w-5 h-5 text-gray-500  "
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
    </div>
  );
};

export default AuthInput;
