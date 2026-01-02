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

const AiExtractionDataModal = ({
	extractionData,
	authUser,
	collectionProperties,
	filter_settings,
}) => {
	const dispatch = useDispatch();
	console.log('display_url','faq');
	console.log('extractionData',extractionData);
	
	

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
			display_url:extractionData.data.display_url,
			faqs :extractionData.data?.faqs,
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
console.log('extractionData.data.display_url',extractionData.data.display_url);

	console.log("extractionData", extractionData);


	return (
		<Modal
			isOpen
			headerText={"Summary of the Video"}
		// onClose={handleModalClose}
		>
			<div>
				<h3 className='text-xl mb-4'>
					Click on the button below to view the prepared content and products.
				</h3>
				<div className='grid grid-cols-5 gap-4 text-lg'>
					<div className='col-span-1'>
						<b>Title:</b>
					</div>
					<div className='col-span-4 break-words'>
						<b>{extractionData?.data?.title}</b>
					</div>
					<div className='col-span-1'>Description:</div>
					<div className='col-span-4'>{extractionData?.data?.description}</div>

					<div className='col-span-5 flex ml-auto'>
						<button
							type='button'
							onClick={() => handleModalClose()}
							className='min-w-24 text-xs md:text-sm z-10 rounded-md py-2.5 px-3.5 h-full font-bold text-indigo-400 border-2 border-indigo-400 mr-4'>
							Discard
						</button>
						<button
							className='ml-auto bg-indigo-600 py-2 px-8 text-white rounded-lg'
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
