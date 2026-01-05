import React, { useCallback, useEffect, useMemo } from "react";
import { message, Alert } from "antd";
import CopyToClipboard from "react-copy-to-clipboard";
import {
	CopyOutlined,
	WhatsAppOutlined,
	FacebookOutlined,
	LinkedinOutlined,
} from "@ant-design/icons";
import { useNavigate } from "../helper/useNavigate";

import xIcon from "../images/x_white_icon.png";
import Modal from "./modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { setShowChatModal } from "../hooks/chat/redux/actions";
import {
	collectionQRCodeGenerator,
	getBlogCollectionPagePath,
} from "../helper/utils";
import { PUBLISHED } from "../constants/codes";
import { getTTid } from "../helper/getTrackerInfo";

const CollectionShareModal = ({
	isOpen,
	collectionDetails,
	collectionOwner,
	isAutoCreateCollection,
	onClose,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();




	const collectionRedirectPath = useMemo(
		() =>
			collectionDetails._id &&
			getBlogCollectionPagePath(
				collectionOwner.user_name,
				collectionDetails.path,
				collectionDetails._id,
				collectionOwner.user_id,
				collectionDetails.status,
				collectionDetails.hosted_stores,
				collectionDetails?.collection_theme
			),
		[
			collectionOwner.user_name,
			collectionDetails.path,
			collectionDetails._id,
			collectionOwner.user_id,
			collectionDetails.status,
			collectionDetails.hosted_stores,
			collectionDetails?.collection_theme,
		]
	);


	console.log("collectionRedirectPath",collectionRedirectPath);
	

	const collectionPageUrl = useMemo(
		() => (window?.location.origin || "") + collectionRedirectPath || allCollectionsList.path,
		[collectionRedirectPath, window]
	);

	useEffect(() => {
		console.log(collectionDetails);
		console.log(collectionRedirectPath);
	}, [collectionDetails])


	const qrCodeGeneratorURL = useMemo(
		() => collectionQRCodeGenerator(collectionRedirectPath),
		[collectionRedirectPath]
	);

	const platform =
		navigator.userAgentData?.mobile !== undefined
			? navigator.userAgentData.mobile
				? "mobile"
				: "web"
			: /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
				? "mobile"
				: "web";

	const collectionId = collectionDetails?.collection_id;


	console.log('collectionPageUrl', window?.location.origin);

	const baseUrl = `${collectionPageUrl}?utm_source=whatsapp&utm_medium=messaging&utm_campaign=${collectionId}&utm_content=unthink_collection_share&unthink_source=unthink_collection_share&unthink_medium=whatsapp&unthink_campaign=${collectionId}&unthink_shared=${getTTid()}`;

	const copybaseUrl = `${collectionPageUrl}?utm_source=unthink_collection_share&utm_medium=${platform}&utm_campaign=${collectionId}&utm_content=unthink_collection_share&unthink_source=unthink_collection_share&unthink_medium=${platform}&unthink_campaign=${collectionId}&unthink_shared=${getTTid()}`;

	const socialMediaUrls = {
		whatsapp: `https://wa.me/?text=${encodeURIComponent(baseUrl)}`,
		twitter: `https://x.com/intent/tweet?url=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'twitter'))}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'facebook'))}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'linkedin'))}`
	};


	console.log(collectionDetails, "collectionDetails");



	const handlePreviewCollectionPage = useCallback(() => {
		onClose();
		dispatch(setShowChatModal(false));
		navigate(collectionRedirectPath);
	}, [collectionRedirectPath]);

	return (
		<div>
			<Modal
				headerText='Share'
				isOpen={isOpen}
				onClose={onClose}
				maskClosable={false}
				size='sm'
			// okButtonProps={{ className: "hidden" }}
			>
				<div>
					<h1 className='text-xl font-bold capital-first-letter'>
						{collectionDetails.collection_name}
					</h1>
				</div>
				{/* {isAutoCreateCollection ? (
					<div>
						<Alert
							message='The new collection is created and published with the selected products.'
							type='info'
							className='mt-2'
						/>
					</div>
				) : null} */}
				<div className='mt-2'>
					<div className='flex items-center justify-between'>
						<p>
							<b>Share your collection with your friends and followers!</b>
						</p>
						<button
							className='rounded-md shadow px-2 py-0.75 sm:px-4 w-max text-white bg-indigo-600'
							onClick={handlePreviewCollectionPage}>
							View Collection
						</button>
					</div>
					{collectionDetails.status !== PUBLISHED && (
						<Alert
							message='Before sharing the collection page, Please make sure that the collection is published.'
							type='info'
							className='rounded-md text-base mt-4 md:mt-6'
						/>
					)}

					<div className='flex flex-col gap-4 md:gap-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 mt-4 md:mt-6'>
							<div className='grid gap-4 grid-cols-3 md:grid-cols-1 mt-2 md:pl-2.5 md:order-last'>
								<a
									href={socialMediaUrls.facebook}
									target='_blank'
									className='h-11 rounded text-white text-center text-3xl'
									style={{ backgroundColor: "#4267B2" }}>
									<FacebookOutlined className='flex justify-center items-center h-full' />
								</a>
								<a
									href={socialMediaUrls.whatsapp}
									target='_blank'
									className='h-11 rounded text-white text-center text-3xl'
									style={{ backgroundColor: "#128C7E" }}>
									<WhatsAppOutlined className='flex justify-center items-center h-full' />
								</a>
								<a
									href={socialMediaUrls.twitter}
									target='_blank'
									className='h-11 rounded text-white text-center text-3xl flex items-center justify-center bg-black-100'>
									<img
										src={xIcon}
										width={28}
										height={28}
										className='flex justify-center items-center'
									/>
								</a>
								<a
									href={socialMediaUrls.linkedin}
									target='_blank'
									className='h-11 rounded text-white text-center text-3xl'
									style={{ backgroundColor: "#0072b1" }}>
									<LinkedinOutlined className='flex justify-center items-center h-full' />
								</a>
							</div>

							{qrCodeGeneratorURL ? (
								<div className='flex items-center justify-center mt-4 md:mt-0'>
									<img
										className='w-full max-w-208 object-cover'
										src={qrCodeGeneratorURL}
									/>
								</div>
							) : null}
						</div>

						<div className='border p-1 rounded flex break-all'>
							{copybaseUrl}{" "}
							<CopyToClipboard
								text={copybaseUrl}
								onCopy={() => message.success("Copied", 1)}>
								<CopyOutlined className='text-xl flex ml-auto' />
							</CopyToClipboard>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default React.memo(CollectionShareModal);
