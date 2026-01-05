import React, { useRef, useState } from "react";
import { Typography, Image, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);
import { CopyToClipboard } from "react-copy-to-clipboard";

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
import { MY_PROFILE } from "../../constants/codes";
import { useEffect } from "react";
import { getTTid } from "../../helper/getTrackerInfo";

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

	const { url, collection } = props;

	const collectionName = collection?.collection_name;
	const collectionId = collection?.collection_id;

	useEffect(() => {
		console.log(url);
	}, [copied])

	const baseUrl = `${url}?utm_source=whatsapp&utm_medium=messaging&utm_campaign=${collectionId}&utm_content=unthink_collection_share&unthink_source=unthink_collection_share&unthink_medium=whatsapp&unthink_campaign=${collectionId}&unthink_shared=${getTTid()}`;

	const socialMediaUrls = {
		whatsapp: `https://wa.me/?text=${encodeURIComponent(baseUrl)}`,
		twitter: `https://x.com/intent/tweet?url=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'twitter'))}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'facebook'))}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl.replace(/whatsapp/g, 'linkedin'))}`
	};

	return (
		<div
			className={`unthink-share-url ${props.disableFloating ? "disableFloating" : ""
				}`}
			ref={ref}>
			<Text className='unthink-share-url__header'>Share</Text>
			{(!props.showHelpMeShop && (
				<div className='unthink-share-url__icons'>
					<a href={socialMediaUrls.facebook} target='_blank'>
						<img src={facebookImg} />
					</a>
					<a href={socialMediaUrls.whatsapp} target='_blank'>
						<img src={whatsappImg} />
					</a>
					<a href={socialMediaUrls.twitter} target='_blank'>
						<img src={xIcon} width={28} height={28} />
					</a>
					<a href={socialMediaUrls.linkedin} target='_blank'>
						<img src={LinkedIn} width={31} height={31} />
					</a>
				</div>
			)) ||
				null}
			<div className='unthink-share-url__link-option'>
				{(props.showHelpMeShop && (
					<>
						<Button
							type='primary'
							className='border-primary bg-primary'
							onClick={onHelpMeShopClick}>
							Help me Shop
						</Button>
					</>
				)) || (
						<>
							{/* <Text
							className='unthink-share-url__link-option--copy'
							copyable={{ text: shareUrl }}>
							<Text ellipsis={{ tooltip: shareUrl }}>{shareUrl}</Text>
						</Text> */}
							{copied ? (
								<Button
									type='primary'
									className='border-primary bg-primary'
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}>
									Copied
								</Button>
							) : (
								<CopyToClipboard
									text={props.url}
									onCopy={() => {
										setCopied(true);
										setTimeout(() => {
											setCopied(false);
										}, 3000);
									}}>
									<Button
										type='primary'
										className='border-primary bg-primary'
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}>
										Copy link
									</Button>
								</CopyToClipboard>
							)}
						</>
					)}
				{props.showMyProfile && (
					<Button
						type='primary'
						className='border-primary bg-primary'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							navigate(MY_PROFILE);
						}}>
						Show My Profile
					</Button>
				)}
			</div>
		</div>
	);
};

export default ShareOptions;
