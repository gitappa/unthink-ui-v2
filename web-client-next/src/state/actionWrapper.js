import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUserInfo } from "../pageComponents/Auth/redux/actions";
import { enable_venly } from "../constants/config";
import { setShowAuraIntro } from "../hooks/chat/redux/actions";
import { connectVenly } from "../helper/venlyUtils";
import { getStoreData } from "../pageComponents/store/redux/actions";

// import trackApi from "../track/api";

const ActionWrapper = ({ children }) => {
	const [authUser, authUserIsFetching] = useSelector((state) => [
		state.auth.user.data,
		state.auth.user.isFetching,
	]);
	const dispatch = useDispatch();

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

	return <>{children}</>;
};

export default ActionWrapper;
