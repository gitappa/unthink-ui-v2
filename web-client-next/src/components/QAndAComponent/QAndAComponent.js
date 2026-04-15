import React, { useCallback, useMemo, useState } from "react";
import { Popover, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import Chat from "../../pageComponents/storePage/Chat";
import ProductCard from "../singleCollection/ProductCard";
import {
	setChatMessage,
	setChatSearchType,
	setShowChatModal,
} from "../../hooks/chat/redux/actions";
import { useChat } from "../../hooks/chat/useChat";
import {
	CHAT_SEARCH_TYPES,
	CHAT_TYPES_KEYS,
	CHAT_TYPE_QANDACHAT,
	WIDGET_TYPE_Q_AND_A,
} from "../../constants/codes";

import header_aura from "../../images/chat/header_aura_image_transparent.png";
import star_ai_icon_logo from "../../images/unthink_star_ai_icon.svg";


import styles from './QAndAComponent.module.css';

const QAndAComponent = ({
	id,
	WrapperComponent = ({ children }) => <div>{children}</div>,
	config,
}) => {
	const [popoverVisible, setPopoverVisible] = useState(false); // make it null to hide full component
	const [popoverTooltipVisible, setPopoverTooltipVisible] = useState(false); // make it null to hide full component

	const [chatMessage, products] = useSelector((state) => [
		state.chatV2[CHAT_TYPES_KEYS[CHAT_TYPE_QANDACHAT].chatMessage],
		state.chatV2[CHAT_TYPES_KEYS[CHAT_TYPE_QANDACHAT].products],
	]);

	const dispatch = useDispatch();

	const { sendMessage } = useChat(CHAT_TYPE_QANDACHAT);

	const handlePopoverTooltipVisibleChange = (value) => {
		setPopoverTooltipVisible(value);
	};

	const handlePopoverVisibleChange = (value) => {
		setPopoverVisible(value);
		handlePopoverTooltipVisibleChange(false);
	};

	const setMessage = (message, key = CHAT_TYPE_QANDACHAT) => {
		dispatch(setChatMessage(message, key));
	};

	const chatInputMetadata = useMemo(
		() => ({
			search: true,
			widgetType: WIDGET_TYPE_Q_AND_A,
		}),
		[]
	);

	const submitChatInput = useCallback(
		(message, metadata) => {
			if (message) {
				setMessage(message, CHAT_TYPE_QANDACHAT);
				sendMessage(message, metadata);
			}
		},
		[sendMessage]
	);

	const popoverContent = useMemo(
		() => (
			<WrapperComponent>
				<div>
					<div>
						<p className={styles.formHeader}>
							<span className={`${styles.formTitle} ellipsis_1`}>
								Ask Aura
							</span>
							<CloseOutlined
								id={`${id}_close_icon`}
								onClick={() => handlePopoverVisibleChange(false)}
								className={styles.closeIcon}
							/>
						</p>
					</div>

					<div className={styles.chatWrapper}>
						<Chat
							submitChatInput={submitChatInput}
							chatInputMetadata={chatInputMetadata}
							chatTypeKey={CHAT_TYPE_QANDACHAT}
							availableChatSearchTypes={[CHAT_SEARCH_TYPES.SEARCH]}
							activeChatSearchType={CHAT_SEARCH_TYPES.SEARCH}
							showSpeaker={false}
							config={config}
						/>
					</div>

					<div className={`${styles.responseContent} response-content-container`}>
						{products?.widgetHeader ? (
							<p
								className={styles.widgetHeader}
								dangerouslySetInnerHTML={{ __html: products.widgetHeader }}
							/>
						) : null}
						<div className={styles.productsGrid}>
							{products?.product_list?.map((product) => (
								<ProductCard
									key={product.mfr_code}
									product={product}
									hideViewSimilar
									hideAddToWishlist
									size='small'
									showRemoveIcon
								/>
							))}
						</div>
					</div>
				</div>
			</WrapperComponent>
		),
		[products]
	);

	const onChatClick = () => {
		handlePopoverTooltipVisibleChange(false);
		dispatch(setChatSearchType(CHAT_SEARCH_TYPES.SEARCH));
		dispatch(setShowChatModal(true));
	};

	const popoverId = `popover_${CHAT_TYPE_QANDACHAT}`;

	return (
		<div
			id={popoverId}
			className={styles.wrapper}>
			<Tooltip
				placement='left'
				getPopupContainer={() =>
					typeof document !== "undefined" ? document.getElementById(popoverId) : undefined
				}
				title={"Ask Aura"}
				open={popoverTooltipVisible && !popoverVisible}
				onOpenChange={handlePopoverTooltipVisibleChange}>
				<div
					className={styles.triggerButton}
					role='button'
					onClick={onChatClick}>
					<img
						id={`header_chat_aura_${CHAT_TYPE_QANDACHAT}`}
						src={star_ai_icon_logo}
						className={styles.triggerImage}
					/>
				</div>
			</Tooltip>
		</div>
	);

	// return (
	// 	<div
	// 		id={popoverId}
	// 		className='z-30 fixed bottom-2 right-2 tablet:bottom-8 tablet:right-8 mb-20 tablet:mb-0'>
	// 		<Popover
	// 			placement='topRight'
	// 			getPopupContainer={() => document.getElementById(popoverId)}
	// 			content={popoverContent}
	// 			visible={popoverVisible}
	// 			trigger='click'
	// 			onVisibleChange={handlePopoverVisibleChange}
	// 			arrowPointAtCenter
	// 			overlayClassName='q-and-a-popover-overlay'
	// 			destroyTooltipOnHide={false}>
	// 			<Tooltip
	// 				placement='left'
	// 				title={"Ask Aura"}
	// 				visible={popoverTooltipVisible && !popoverVisible}
	// 				onVisibleChange={handlePopoverTooltipVisibleChange}>
	// 				<div
	// 					className='flex cursor-pointer bg-indigo-600 rounded-full text-lg tablet:text-4xl text-white'
	// 					role='button'>
	// 					<img
	// 						id={`header_chat_aura_${CHAT_TYPE_QANDACHAT}`}
	// 						src={header_aura}
	// 						className='rounded-full h-12 lg:h-16 w-12 lg:w-16'
	// 					/>
	// 				</div>
	// 			</Tooltip>
	// 		</Popover>
	// 	</div>
	// );
};

export default React.memo(QAndAComponent);
