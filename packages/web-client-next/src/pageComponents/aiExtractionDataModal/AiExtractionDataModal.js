import React, { useCallback } from "react";
import Router from 'next/router';

const navigate = (path) => Router.push(path);
import { useDispatch } from "react-redux";

import Modal from "../../components/modal/Modal";
import { setAiExtractionData } from "../../hooks/chat/redux/actions";
import {
	COLLECTION_GENERATED_BY_VIDEO_BASED,
	COLLECTION_TYPE_AUTO_PLIST,
	PATH_CREATE_COLLECTION,
} from "../../constants/codes";
import { createWishlist } from "../wishlistActions/createWishlist/redux/actions";
import { current_store_name } from "../../constants/config";

import styles from "./AiExtractionDataModal.module.css";

const AiExtractionDataModal = ({
	extractionData,
	authUser,
	collectionProperties,
	filter_settings,
}) => {
	const dispatch = useDispatch();
	console.log('display_url', 'faq');
	console.log('extractionData', extractionData);



	const handleModalClose = useCallback(() => {
		dispatch(setAiExtractionData(null));
	}, []);

	const handleViewClick = useCallback(() => {
		const payload = {
			collection_name: extractionData.data.title,
			type: COLLECTION_TYPE_AUTO_PLIST,
			tags: extractionData.data.tags,
			description: extractionData.data.description,
			generated_by: COLLECTION_GENERATED_BY_VIDEO_BASED,
			video_url: extractionData.data.video_url,
			uploaded_source: extractionData.request.uploaded_source,
			redirectToEditCollectionPage: true,
			display_url: extractionData.data.display_url,
			faqs: extractionData.data?.faqs,
		}

		if (extractionData.data.keyword_tag_map) {
			const keyword_tag_map = extractionData.data.keyword_tag_map;

			// set brands from authUser.filters in keyword_tag_map which is available in available_filters
			const brandsToShow = authUser?.filters?.[current_store_name]?.strict?.brand?.filter((item) =>
				filter_settings?.available_filters?.brand?.includes(item)
			);
			if (authUser.filters?.[current_store_name]?.strict?.brand) {
				for (const key in keyword_tag_map) {
					if (!keyword_tag_map[key].brand) {
						keyword_tag_map[key].brand = brandsToShow.length
							? brandsToShow
							: undefined;
					}
				}
			}

			payload.keyword_tag_map = keyword_tag_map;
		}

		dispatch(createWishlist(payload));
		navigate(PATH_CREATE_COLLECTION);
		handleModalClose();
	}, []);
	console.log('extractionData.data.display_url', extractionData.data.display_url);

	console.log("extractionData", extractionData);


	return (
		<Modal
			isOpen
			headerText={"Summary of the Video"}
		// onClose={handleModalClose}
		>
			<div>
				<h3 className={styles.modalTitle}>
					Click on the button below to view the prepared content and products.
				</h3>
				<div className={styles.summaryGrid}>
					<div className={styles.labelCol}>
						<b>Title:</b>
					</div>
					<div className={styles.valueCol}>
						<b>{extractionData?.data?.title}</b>
					</div>
					<div className={styles.labelCol}>Description:</div>
					<div className={styles.descriptionValueCol}>{extractionData?.data?.description}</div>

					<div className={styles.actionCol}>
						<button
							type='button'
							onClick={() => handleModalClose()}
							className={styles.discardButton}>
							Discard
						</button>
						<button
							className={styles.nextButton}
							onClick={handleViewClick}>
							Next
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default React.memo(AiExtractionDataModal);
