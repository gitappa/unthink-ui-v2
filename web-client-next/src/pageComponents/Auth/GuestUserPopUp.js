import React, { useCallback, useState } from "react";
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
  const [guestData, setGuestData] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });

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
      if (errors.email) setErrors({ ...errors, email: "" });
    },
    [errors],
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

      if (!guestData.email) {
        setErrors({ email: "Email is required" });
        return;
      }

      if (!validateEmail(guestData.email)) {
        setErrors({ email: "Please enter a valid email address" });
        return;
      }

      const tid = Cookies.get("tid");

      if (!Cookies.get("isGuestLoggedIn")) {
        Cookies.set("isGuestLoggedIn", false, {
          expires: cookieExpireDays,
        });
      }

      try {
        const res = await authAPIs.GuestRegisterAPICall({
          emailId: guestData.email,
          user_id: tid,
          store: storeName,
        });

        
        const userId = res?.data?.data?.user_id;
        const email = res?.data?.data?.email ||  res?.data?.data?.emailId;
        if (res?.data?.status_code === 200 && userId) {
          if (persistKioskLogin && typeof window !== "undefined") {
            sessionStorage.setItem("Kiosk-login",JSON.stringify( {user_id : userId,email}) );
          }

          closePopup();
          onSuccess?.({ userId, response: res, email: guestData.email });
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
