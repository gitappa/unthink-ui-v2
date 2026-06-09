import React, { useEffect, useRef, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { SIGN_IN_EXPIRE_DAYS } from '../../constants/codes';
import { clearStorages } from '../../helper/utils';
import { logoutVenlyUser } from '../../helper/venlyUtils';
import { getUserCollectionsReset } from '../../pageComponents/Auth/redux/actions';
import { fetchCategoriesReset } from '../../pageComponents/categories/redux/actions';

// Hook: manages kiosk session reminder timer and actions
export default function useKioskSessionReminder({ time } = {}) {
  const intervalMs = time ||  30 * 1000
  const dispatch = useDispatch();
  const isUserLogin = useSelector((state) => state.auth.user.isUserLogin);
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const timerRef = useRef(null);
  const startSessionTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const cookie = sessionStorage.getItem('Kiosk-login');
    if (!cookie || !isUserLogin) return;

    timerRef.current = setInterval(() => {
      if (sessionStorage.getItem('Kiosk-login') && isUserLogin) {
        setShowSessionPopup(true);
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, intervalMs);
  }, [isUserLogin, intervalMs]);

  useEffect(() => {
    startSessionTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startSessionTimer]);

  const handleStayLoggedIn = useCallback(() => {
    const cookieVal = sessionStorage.getItem('Kiosk-login');
    // if (cookieVal) {
    //   sessionStorage.setItem('Kiosk-login', cookieVal);
    // }
    setShowSessionPopup(false);
    startSessionTimer();
  }, [startSessionTimer]);

  const handleLogout = useCallback(async () => {
    sessionStorage.removeItem('Kiosk-login');

    try {
      clearStorages();
    } catch (e) {}

    try {
      await logoutVenlyUser();
    } catch (e) {}

    try {
      dispatch(getUserCollectionsReset());
      dispatch(fetchCategoriesReset());
    } catch (e) {}

    setShowSessionPopup(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [dispatch]);

  return {
    showSessionPopup,
    setShowSessionPopup,
    handleStayLoggedIn,
    handleLogout,
    startSessionTimer,
  };
}

// Simple presentational popup component exported alongside the hook so consumers can import both from one file
export function KioskSessionPopup({ onStay, onLogout }) {
const kioskLoginMail = JSON.parse(
  sessionStorage.getItem('Kiosk-login') || '{}'
)?.email;
const maskedEmail = kioskLoginMail?.replace(
  /^(.{5})[^@]*(@.*)$/,
  '$1....$2'
);
// console.log('kioskLoginMail',maskedEmail);
useEffect(() => {
  const timer = setTimeout(() => {
    onLogout();
  }, 30000);

  return () => clearTimeout(timer);
}, []);

  return (
    <div className="fixed top-5 right-6 z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[340px] max-w-full flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Still here? Let's keep Shopping</h3>
          <p className="text-xs text-gray-600">{maskedEmail} kiosk session is active. Do you want to stay logged in?</p>
          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 px-3 py-1 max-w-[150px] rounded-2xl bg-gray-600/60 text-white text-sm hover:bg-gray-500"
              onClick={onStay}
            >
              Stay Logged In
            </button>
            <button
              className="px-3 py-1 rounded-2xl bg-red-600 text-white text-sm hover:bg-red-700"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// attach popup to default hook so consumers can access it as useKioskSessionReminder.Popup
try {
  // eslint-disable-next-line no-undef
  if (typeof useKioskSessionReminder === 'function') {
    useKioskSessionReminder.Popup = KioskSessionPopup;
  }
} catch (e) {
  // ignore in environments where module scope is immutable
}
