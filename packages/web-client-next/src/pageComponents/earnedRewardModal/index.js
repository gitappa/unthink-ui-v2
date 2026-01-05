import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

const EarnedRewardModal = dynamic(() => import("./EarnedRewardModal"), {
	ssr: false,
});

export default (props) => {
	const [loadComponent, setLoadComponent] = useState(false);
	const [isModalOpen] = useSelector((state) => [
		state.appState.earnedRewardModal.isOpen,
	]);

	useEffect(() => {
		if (!loadComponent && isModalOpen) {
			setLoadComponent(true);
		}
	}, [isModalOpen]);

	return loadComponent && <EarnedRewardModal {...props} />;
};
