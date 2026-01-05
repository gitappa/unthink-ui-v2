import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";

import { closeProductDetailsCopyModal } from "./redux/actions";

const ProductDetailsCopyModal = dynamic(
	() => import("../../components/ProductDetailsCopyModal"),
	{ ssr: false }
);

const ProductDetailsCopyModalComponent = () => {
	const dispatch = useDispatch();
	const [enabledModal, setEnabledModal] = useState(false);
	const [authUser, isModalOpen, productDetails] = useSelector((state) => [
		state.auth.user.data,
		state.productDetailsCopyModal.isModalOpen,
		state.productDetailsCopyModal.productDetails,
	]);

	// load modal on DOM only when required
	useEffect(() => {
		if (isModalOpen && !enabledModal) {
			setEnabledModal(true);
		}
	}, [isModalOpen]);

	const handleProductDetailsCopyModalClose = () => {
		dispatch(closeProductDetailsCopyModal());
	};

	return (
		<div>
			{enabledModal && (
				<ProductDetailsCopyModal
					isOpen={isModalOpen}
					productDetails={productDetails}
					onClose={handleProductDetailsCopyModalClose}
					userId={authUser.user_id}
				/>
			)}
		</div>
	);
};

export default ProductDetailsCopyModalComponent;
