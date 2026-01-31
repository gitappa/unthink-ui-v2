import React, { useMemo, useRef, useState } from "react";
import { Typography,   Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import Router, { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import facebookImg from "../../images/facebook.png";
import whatsappImg from "../../images/whatsapp.png";
import xIcon from "../../images/x_black_icon.png";
import LinkedIn from "../../images/linkedin.png";
import useOnClickOutside from "../../helper/useClickOutside";
import {
	setHelpMeShopModalOpen,
	setHelpMeShopModalSharedLink,
} from "./redux/actions";

import styles from './shareOption.module.scss';
import { MY_PROFILE, PUBLISHED } from "../../constants/codes";
import { useEffect } from "react";
import { getTTid } from "../../helper/getTrackerInfo";
import Modal from "../../components/modal/Modal";
import { FaXTwitter } from "react-icons/fa6";

import {
	CopyOutlined,
	WhatsAppOutlined,
	FacebookOutlined,
	LinkedinOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ShareOptions = (props) => {
	const ref = useRef();
	const [copied, setCopied] = useState(false);

	const dispatch = useDispatch();

	const handleClickOutside = () => {
		props.setShow && props.setShow(false);
	};
	const openUrl = (url) => {
		window.open(url, "_blank");
	};

	const onHelpMeShopClick = (e) => {
		e.stopPropagation();
		dispatch(setHelpMeShopModalOpen(true));
		dispatch(setHelpMeShopModalSharedLink(props.url));
	};

	useOnClickOutside(ref, handleClickOutside);

	const { url, collection,qrCodeGeneratorURL,collectionPagePath,onClose } = props;
const router = useRouter();

	const collectionName = collection?.collection_name;
	const collectionId = collection?.collection_id;
console.log('dfdvf',collectionId);


	// const collectionRedirectPath = useMemo(
	// 		() =>
	// 			collectionDetails._id &&
	// 			getBlogCollectionPagePath(
	// 				collection.user_name,
	// 				collection.path,
	// 				collection._id,
	// 				collection.user_id,
	// 				collection.status,
	// 				collectionDetails.hosted_stores,
	// 				collectionDetails?.collection_theme
	// 			),
	// 		[
	// 			collectionOwner.user_name,
	// 			collectionDetails.path,
	// 			collectionDetails._id,
	// 			collectionOwner.user_id,
	// 			collectionDetails.status,
	// 			collectionDetails.hosted_stores,
	// 			collectionDetails?.collection_theme,
	// 		]  
	// 	);
	 
const handlePreviewCollectionPage = () => {
	onClose();
	router.push(collectionPagePath);
}
function pdf(){
	onClose(()=>false)
}
		console.log(url);

	useEffect(() => {
		console.log(url);
	}, [])

	const baseUrl = `${url}?utm_source=whatsapp&utm_medium=messaging&utm_campaign=${collectionId}&utm_content=unthink_collection_share&unthink_source=unthink_collection_share&unthink_medium=whatsapp&unthink_campaign=${collectionId}&unthink_shared=${getTTid()}`;

	const socialMediaUrls = {
		whatsapp: `https://wa.me/?text=${encodeURIComponent(baseUrl)}`,
		twitter: `https://x.com/intent/tweet?url=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'twitter'))}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'facebook'))}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'linkedin'))}`
	};
console.log('aaadsDsds');

	return (
			<Modal
				headerText='Share'
				isOpen={props.isOpen}
				onClose={pdf}
				maskClosable={false}
				size='sm'
			// okButtonProps={{ className: "hidden" }}
			>
				<div>
					<h1 className='text-2xl font-bold capital-first-letter'>
						{collection.collection_name}
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
				<div className=''>
					{/* <div className='flex items-center justify-between'>
						<p>
							<b className="text-xl">Share your collection with your friends and followers!</b>
						</p>
						<button
							className='rounded-md shadow px-2 py-0.75 sm:px-4 w-max text-white bg-indigo-600'
							onClick={handlePreviewCollectionPage}
							>
							View Collection
						</button>
					</div> */}
					{/* {collection.status != PUBLISHED && (
						<Alert
							message='Before sharing the collection page, Please make sure that the collection is published.'
							type='info'
							className='rounded-md text-base mt-4 md:mt-6'
						/>
					)} */}

					<div className='flex flex-col gap-4 md:gap-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 mt-2 lg:mt-3'>
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
									className='h-11 rounded text-white text-center text-3xl flex items-center justify-center bg-gray-500'>
									{/* <Image
										src={xIcon}
										width={28}
										height={28}
										className='flex justify-center items-center'
									/> */}
									<FaXTwitter width={28}
										height={28} />

								</a>
								<a
									href={socialMediaUrls.linkedin}
									target='_blank'
									className='h-11 rounded text-white text-center text-3xl'
									style={{ backgroundColor: "#0072b1" }}>
									<LinkedinOutlined className='flex justify-center items-center h-full' />
								</a>
							</div>

							{qrCodeGeneratorURL &&   collection.status === PUBLISHED  ? (
								<div className='flex items-center justify-center mt-4 md:mt-0'>
									<img
										className='w-full max-w-208 object-cover'
										src={qrCodeGeneratorURL}
									/>
								</div>
							) : null}
						</div> 
							{url && 
						<div className='border p-1 rounded flex break-all text-lg '>
							{url}{" "}
							<CopyToClipboard className='text-lg'
								text={url}
								onCopy={() => message.success("Copied", 1)}>
								<CopyOutlined className='text-xl flex ml-auto' />
							</CopyToClipboard>
						</div> }
					</div>
				</div>
			</Modal>
	);
};

export default ShareOptions;
