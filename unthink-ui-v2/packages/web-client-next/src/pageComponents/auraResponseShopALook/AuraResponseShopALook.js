import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "antd";

import {
	getBlogCollectionPagePath,
	getCurrentTheme,
	isEmpty,
} from "../../helper/utils";

import styles from './auraResponseShopALook.module.scss';

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
		<div id='chat_shop_a_look_container'>
			{title ? (
				<div className='flex flex-col'>
					{/* {text ? (
						<h1
							id='shop_a_look_data_widget_text'
							className='pb-1 md:pb-5 text-black-102 text-base lg:text-lg'
							dangerouslySetInnerHTML={{ __html: text }}
						/>
					) : null} */}
					<h1
						id='current_data_text'
						className='pb-1 md:pb-5 text-black-102 text-lg lg:text-xl font-bold'>
						{title}
					</h1>
				</div>
			) : null}
			<div
				id='chat_shop_a_look_inner_content'
				className='grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4'>
				{collection_list.map((collection) => (
					<div
						key={collection._id}
						className={`box-content w-40 sm:w-180 lg:w-80`}>
						<div
							className='overflow-hidden relative cursor-pointer collection_card_container shadow-3xl rounded-t-xl rounded-b-xl'
							onClick={() => handleCollectionClick(collection)}>
							<div className='h-full'>
								<img
									src={collection.cover_image}
									width='100%'
									className='h-180 lg:h-340 object-cover'
									loading='lazy'
								/>
							</div>
							{/* collection card header */}
							<div className='box-border absolute top-0 w-full flex justify-between px-2 lg:p-2.5 h-12 lg:h-20 collection_card_header z-20'>
								<div className='overflow-hidden'>
									<div className='flex'>
										<Text
											ellipsis={{ tooltip: collection.collection_name }}
											className='m-0 text-sm lg:text-xl overflow-hidden overflow-ellipsis whitespace-nowrap tracking-tighter-0.2 collection_name'>
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
