import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Typography } from "antd";

import styles from './people.module.scss';

const { Text } = Typography;

const CollectionCard = ({ collection, handleCollectionClick }) => {
	return (
		<div
			className='relative cursor-pointer h-full'
			onClick={handleCollectionClick}>
			<div className=' h-180 lg:h-340'>
				<div className='h-full'>
					<LazyLoadImage
						src={collection?.product_list?.image}
						width='100%'
						className={`object-cover h-180 lg:h-340 rounded-xl`}
					/>
				</div>

				{/* collection card header */}
				<div
					className={`absolute top-0 w-full flex justify-between px-4 p-2 lg:pt-3 h-10 lg:h-20 rounded-xl collection-card-title`}>
					<div className={`overflow-hidden`}>
						<Text
							ellipsis={{ tooltip: collection?.name }}
							className={`m-0 text-sm lg:text-2xl text-white font-bold overflow-hidden overflow-ellipsis whitespace-nowrap`}>
							{collection?.name}
						</Text>
					</div>
				</div>
				<div className='absolute bottom-0 w-full flex justify-between px-4 pt-5 pb-2 lg:pb-3 rounded-xl collection-card-footer h-10 lg:h-20'></div>
			</div>
		</div>
	);
};

export default CollectionCard;
