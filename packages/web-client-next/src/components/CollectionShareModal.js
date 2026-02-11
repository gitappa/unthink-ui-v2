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
import styles from "./CollectionShareModal.module.css";

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


	console.log("collectionRedirectPath", collectionRedirectPath);


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


	console.log("collectionDetails", collectionDetails);



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
					<h1 className={styles.collectionTitle}>
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
				<div className={styles.shareSection}>
					<div className={styles.shareHeader}>
						<p>
							<b>Share your collection with your friends and followers!</b>
						</p>
						<button
							className={styles.viewCollectionBtn}
							onClick={handlePreviewCollectionPage}>
							View Collection
						</button>
					</div>
					{collectionDetails.status !== PUBLISHED && (
						<Alert
							message='Before sharing the collection page, Please make sure that the collection is published.'
							type='info'
							className={styles.alertMessage}
						/>
					)}

					<div className={styles.shareContent}>
						<div className={styles.shareGrid}>
							<div className={styles.socialGrid}>
								<a
									href={socialMediaUrls.facebook}
									target='_blank'
									className={styles.socialLink}
									style={{ backgroundColor: "#4267B2" }}>
									<FacebookOutlined className={styles.socialIconFlex} />
								</a>
								<a
									href={socialMediaUrls.whatsapp}
									target='_blank'
									className={styles.socialLink}
									style={{ backgroundColor: "#128C7E" }}>
									<WhatsAppOutlined className={styles.socialIconFlex} />
								</a>
								<a
									href={socialMediaUrls.twitter}
									target='_blank'
									className={styles.twitterLink}>
									<img
										src={xIcon}
										width={28}
										height={28}
										className={styles.twitterIcon}
									/>
								</a>
								<a
									href={socialMediaUrls.linkedin}
									target='_blank'
									className={styles.socialLink}
									style={{ backgroundColor: "#0072b1" }}>
									<LinkedinOutlined className={styles.socialIconFlex} />
								</a>
							</div>

							{qrCodeGeneratorURL ? (
								<div className={styles.qrCodeWrapper}>
									<img
										className={styles.qrCodeImage}
										src={qrCodeGeneratorURL}
									/>
								</div>
							) : null}
						</div>

						<div className={styles.urlBox}>
							{copybaseUrl}{" "}
							<CopyToClipboard
								text={copybaseUrl}
								onCopy={() => message.success("Copied", 1)}>
								<CopyOutlined className={styles.copyIconLarge} />
							</CopyToClipboard>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default React.memo(CollectionShareModal);
