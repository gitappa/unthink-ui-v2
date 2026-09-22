import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import dynamic from "next/dynamic";

const AutoCreateCollectionModal = dynamic(
	() => import("./AutoCreateCollectionModal"),
	{ ssr: false }
);

const AutoCreateCollectionModalComponent = () => {
	const [isOpen, data] = useSelector((state) => [
		state.autoCreateCollectionModal.isOpen,
		state.autoCreateCollectionModal.data,
	], shallowEqual);

	if (!isOpen) return null;

	return (
		<AutoCreateCollectionModal
			isOpen={isOpen}
			collectionData={data}
			isShareCollectionEnable={data?.isShareCollectionEnable}
		/>
	);
};

export default React.memo(AutoCreateCollectionModalComponent);
