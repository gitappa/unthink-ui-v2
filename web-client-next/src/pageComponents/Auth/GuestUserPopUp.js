import React, { useCallback, useState } from "react";
import { notification } from "antd";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import GuestPopUp from "./GuestPopUp";
import { GuestPopUpShow } from "./redux/actions";
import { authAPIs } from "../../helper/serverAPIs";

const DEFAULT_GUEST_COOKIE_EXPIRE_DAYS = 7;

function GuestUserPopUp({
  isOpen,
  setIsOpen,
  storeName,
  onSuccess,
  onSkip,
  onClose,
  persistKioskLogin = false,
  cookieExpireDays = DEFAULT_GUEST_COOKIE_EXPIRE_DAYS,
}) {
  const dispatch = useDispatch();
  const isGuestPopUpShow = useSelector(
    (state) => state.GuestPopUpReducer.isGuestPopUpShow,
  );
  const [guestData, setGuestData] = useState({ email: "", phone: "" });
  const [errors, setErrors] = useState({ email: "", phone: "" });

  const setPopupOpen = useCallback(
    (show) => {
      setIsOpen?.(show);
      if (!show) onClose?.();
    },
    [onClose, setIsOpen],
  );

  const closePopup = useCallback(() => {
    dispatch(GuestPopUpShow(false));
    setPopupOpen(false);
  }, [dispatch, setPopupOpen]);

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const guestChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setGuestData((data) => ({ ...data, [name]: value }));
      if (name === "email" || name === "phone") {
        setErrors((currentErrors) => ({
          ...currentErrors,
          email: "",
          phone: "",
        }));
      }
    },
    [],
  );

  const handleGuestSkip = useCallback(
    (e) => {
      e?.preventDefault();
      closePopup();
      onSkip?.();
    },
    [closePopup, onSkip],
  );

  const handleGuestSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const email = guestData.email?.trim();
      const phone = guestData.phone?.trim();

      if (!email && !phone) {
        setErrors({ email: "Email or phone number is required", phone: "" });
        return;
      }

      if (email && !validateEmail(email)) {
        setErrors({ email: "Please enter a valid email address", phone: "" });
        return;
      }

      if (!Cookies.get("isGuestLoggedIn")) {
        Cookies.set("isGuestLoggedIn", false, {
          expires: cookieExpireDays,
        });
      }

      try {
        const res = await authAPIs.GuestRegisterAPICall({
          emailId: email,
          // user_id: tid,
          store: storeName,
          phone,
        });
        const userId = res?.data?.data?.user_id;
        const registeredUserName =
          res?.data?.data?.user_name ||
          res?.data?.data?.username ||
          res?.data?.data?.name;
        const registeredEmail =
          res?.data?.data?.email || res?.data?.data?.emailId || email;
        if (res?.data?.status_code === 200 && userId) {
          if (persistKioskLogin && typeof window !== "undefined") {
            sessionStorage.setItem(
              "Kiosk-login",
              JSON.stringify({
                user_id: userId,
                user_name: registeredUserName || registeredEmail || phone,
                username: registeredUserName || registeredEmail || phone,
                email: registeredEmail,
                phone,
              }),
            );
          }
          notification.success({
            message: "Login Successfully",
          });
          closePopup();
          onSuccess?.({
            userId,
            response: res,
            userName: registeredUserName || registeredEmail || phone,
            email: registeredEmail,
            phone,
          });
        }
      } catch (error) {
        console.error("Guest registration error:", error);
        setErrors({
          email: "Registration failed. Please try again.",
        });
      }
    },
    [
      closePopup,
      cookieExpireDays,
      guestData.email,
      guestData.phone,
      onSuccess,
      persistKioskLogin,
      storeName,
      validateEmail,
    ],
  );

  if (!isOpen || !isGuestPopUpShow) return null;

  return (
    <GuestPopUp
      handleGuestSubmit={handleGuestSubmit}
      errors={errors}
      handleGuestSkip={handleGuestSkip}
      guestChange={guestChange}
      guestData={guestData}
      setIsPopupShow={setPopupOpen}
    />
  );
}

export default GuestUserPopUp;
