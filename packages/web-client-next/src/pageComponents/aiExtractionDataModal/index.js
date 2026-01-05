import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { setAiExtractionData } from "../../hooks/chat/redux/actions";
import { CREATE_ACTION, EDIT_ACTION } from "../../constants/codes";
import dynamic from "next/dynamic";

const AiExtractionDataModal = dynamic(() => import("./AiExtractionDataModal"), {
	ssr: false,
});

const EditCollAiExtractionDataModal = dynamic(
	() => import("./EditCollAiExtractionDataModal"),
	{ ssr: false }
);

export default (props) => {
	const [loadComponent, setLoadComponent] = useState(false);
	const [
		extractionData,
		authUser,
		showChatModal,
		collectionProperties,
		filter_settings,
	] = useSelector((state) => [
		state.chatV2.aiExtractionData,
		state.auth.user.data,
		state.chatV2.showChatModal,
		state.store.data.collection_properties,
		state.store.data.filter_settings,
	]);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!loadComponent && extractionData && extractionData.type) {
			setLoadComponent(true);
		}
	}, [extractionData]);

	useEffect(() => {
		if (
			extractionData &&
			extractionData?.data?.status_code !== 200 &&
			extractionData?.type === "video_url"
		) {
			notification["error"]({
				message:
					extractionData?.data?.title ||
					"Couldn't process the video, please try again later",
			});
			dispatch(setAiExtractionData(null));
		}
	}, [extractionData]);

	return (
		loadComponent && (
			<>
				{extractionData && extractionData.successVideoUrlExtraction && (
					<>
						{extractionData.request.user_action === CREATE_ACTION && (
							<AiExtractionDataModal
								{...props}
								extractionData={extractionData}
								authUser={authUser}
								collectionProperties={collectionProperties}
								filter_settings={filter_settings}
							/>
						)}
						{extractionData.request.user_action === EDIT_ACTION && (
							<EditCollAiExtractionDataModal
								{...props}
								extractionData={extractionData}
								showChatModal={showChatModal}
							/>
						)}
					</>
				)}
			</>
		)
	);
};
