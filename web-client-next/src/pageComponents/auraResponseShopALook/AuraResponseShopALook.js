import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "antd";

import {
	getBlogCollectionPagePath,
	getCurrentTheme,
	isEmpty,
} from "../../helper/utils";
import styles from "./AuraResponseShopALook.module.css";


const { Text } = Typography;

const AuraResponseShopALook = ({
	enableClickFetchRec,
	enableClickTracking,
	trackCollectionCampCode,
	trackCollectionId,
	trackCollectionName,
	trackCollectionICode,
}) => {
	const [shopALookData = {}] = useSelector((state) => [state.chatV2.shopALook]);

	const handleCollectionClick = (collection) => {
		window.open(
			getBlogCollectionPagePath(
				collection.user_name,
				collection.path,
				collection._id,
				collection.user_id,
				collection.status,
				undefined,
				collection?.collection_theme
			),
			"_blank"
		);
	};

	const { collection_list = [], title, text } = shopALookData;

	if (isEmpty(shopALookData)) return null;

	return (
		<div id='chat_shop_a_look_container' className={styles.auraResponseShopALookContainer}>
			{title ? (
				<div className={styles.auraResponseTitleSection}>
					{/* {text ? (
						<h1
							id='shop_a_look_data_widget_text'
							className='pb-1 md:pb-5 text-black-102 text-base lg:text-lg'
							dangerouslySetInnerHTML={{ __html: text }}
						/>
					) : null} */}
					<h1
						id='current_data_text'
						className={styles.auraResponseTitle}>
						{title}
					</h1>
				</div>
			) : null}
			<div
				id='chat_shop_a_look_inner_content'
				className={styles.auraResponseGridContainer}>
				{collection_list.map((collection) => (
					<div
						key={collection._id}
						className={styles.auraResponseCollectionCard}>
						<div
							className={styles.auraResponseCardContainer}
							onClick={() => handleCollectionClick(collection)}>
							<div className={styles.auraResponseCardImageWrapper}>
								<img
									src={collection.cover_image}
									width='100%'
									className={styles.auraResponseCardImage}
									loading='lazy'
								/>
							</div>
							{/* collection card header */}
							<div className={styles.auraResponseCardHeader}>
								<div className={styles.auraResponseCardHeaderOverflow}>
									<div className={styles.auraResponseCardHeaderFlex}>
										<Text
											ellipsis={{ tooltip: collection.collection_name }}
											className={styles.auraResponseCollectionNameText}>
											{collection.collection_name}
										</Text>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AuraResponseShopALook;
