import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeProductModal } from "./redux/actions";
import CustomProductModal from "./CustomProductModal";

const CustomProductModalComponent = () => {
	const [loadComponent, setLoadComponent] = useState(false);
	const [isOpen, data, collectionId, allowEdit, storeData] = useSelector(
		(state) => [
			state.appState.productModal.isOpen,
			state.appState.productModal.data,
			state.appState.productModal.collectionId,
			state.appState.productModal.allowEdit || false,
			state.store.data,
		]
	);

	const {
		sellerDetails,
		templates: storeTemplates,
		catalog_attributes,
		filter_settings,
	} = storeData;

	const dispatch = useDispatch();

	const onModalClose = () => {
		dispatch(closeProductModal());
	};

	useEffect(() => {
		if (!loadComponent && isOpen) {
			setLoadComponent(true);
		}
	}, [isOpen]);

	return (
		loadComponent && (
			<CustomProductModal
				isModalOpen={isOpen}
				data={{ data, isView: !allowEdit, collectionId }}
				onModalClose={onModalClose}
				sellerDetails={sellerDetails}
				allowEdit={allowEdit}
				storeTemplates={storeTemplates}
				catalog_attributes={catalog_attributes}
				filter_settings={filter_settings}
			/>
		)
	);
};

export default React.memo(CustomProductModalComponent);
