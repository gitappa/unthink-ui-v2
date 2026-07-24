import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUserInfo } from "../pageComponents/Auth/redux/actions";
import { enable_venly } from "../constants/config";
import { setShowAuraIntro } from "../hooks/chat/redux/actions";
import { connectVenly } from "../helper/venlyUtils";
import { getStoreData } from "../pageComponents/store/redux/actions";
import { fetchCart } from "../pageComponents/DeliveryDetails/redux/action";
import { getTTid } from "../helper/getTrackerInfo";
import { getStoredKioskLoginUserId } from "../helper/utils";
import { useKioskAccess } from "../components/kiosk/components/LoggedInInfo";

// import trackApi from "../track/api";

const ActionWrapper = ({ children }) => {
	const [authUser, authUserIsFetching, isUserLogin, storeData] = useSelector((state) => [
		state.auth.user.data,
		state.auth.user.isFetching,
		state.auth.user.isUserLogin,
		state.store.data,
	]);
	const dispatch = useDispatch();

	const hasKioskAccess = useKioskAccess({ isUserLogin, storeData, authUser });

	useEffect(() => {
		// showing aura intro only 3 times on reload
		if (
			!localStorage.getItem("showAuraIntro") ||
			localStorage.getItem("showAuraIntro") < 3
		) {
			dispatch(setShowAuraIntro(localStorage.getItem("showAuraIntro") < 3));
			localStorage.setItem(
				"showAuraIntro",
				Number(localStorage.getItem("showAuraIntro")) + 1
			);
		}
	}, []);

	useEffect(() => {
		if (enable_venly) {
			connectVenly();
		}
		dispatch(getStoreData()); // fetching store data and storing in redux
		// trackApi(); // generate the new user_id for the guest user and add it in the cookie/storage as tid // not using now // generating it in gatsby browser now
	}, []);

	useEffect(() => {
		if (!authUser.user_id && !authUserIsFetching) {
			setTimeout(() => {
				dispatch(getUserInfo());
			}, 0);
		}
	}, [authUser]);

	useEffect(() => {
		const userId = getStoredKioskLoginUserId() || authUser?.user_id || getTTid();
		if (userId) {
			const mycartcollectionpath = `my_cart_${userId}`;
			dispatch(fetchCart(mycartcollectionpath));
		}
	}, [authUser?.user_id, dispatch]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (hasKioskAccess) {
			const originalOverscroll = document.body.style.overscrollBehavior;
			const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

			document.body.style.overscrollBehavior = "none";
			document.documentElement.style.overscrollBehavior = "none";

			const requestFullscreen = () => {
				const docEl = document.documentElement;
				const isFullscreen = !!(
					document.fullscreenElement ||
					document.webkitFullscreenElement ||
					document.mozFullScreenElement ||
					document.msFullscreenElement
				);

				if (!isFullscreen) {
					const req =
						docEl.requestFullscreen ||
						docEl.webkitRequestFullscreen ||
						docEl.mozRequestFullScreen ||
						docEl.msRequestFullscreen;

					if (req) {
						req.call(docEl).catch((err) => {
							console.warn("Kiosk Mode: Fullscreen request was rejected:", err);
						});
					}
				}
			};

			const handleGesture = () => {
				requestFullscreen();
			};

			window.addEventListener("click", handleGesture, { passive: true });
			window.addEventListener("touchstart", handleGesture, { passive: true });

			// Request immediately in case we're in an event loop execution from a user gesture
			requestFullscreen();

			return () => {
				window.removeEventListener("click", handleGesture);
				window.removeEventListener("touchstart", handleGesture);
				document.body.style.overscrollBehavior = originalOverscroll;
				document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;

				// Exit fullscreen when kiosk access is lost
				const isFullscreen = !!(
					document.fullscreenElement ||
					document.webkitFullscreenElement ||
					document.mozFullScreenElement ||
					document.msFullscreenElement
				);
				if (isFullscreen) {
					const exit =
						document.exitFullscreen ||
						document.webkitExitFullscreen ||
						document.mozCancelFullScreen ||
						document.msExitFullscreen;
					if (exit) {
						exit.call(document).catch((err) => console.warn(err));
					}
				}
			};
		}
	}, [hasKioskAccess]);

	return <>{children}</>;
};

export default ActionWrapper;
