import React, { useEffect, useState } from "react";
import { Skeleton } from "antd";
import {
	ArrowRightOutlined,
	StarFilled,
	UserOutlined,
} from "@ant-design/icons";
import { SortableHandle } from "react-sortable-hoc";
import styles from "./WishListItems.module.css";

import SortableContainer from "../../components/SortableContainer";
import { favorites_collection_name, PUBLISHED } from "../../constants/codes";
import { getCollectionNameToShow } from "../../helper/utils";

const WishListItems = ({
	activeCollection,
	wishlistData,
	onWishlistClick,
	onStarClick,
	isWishlistFetching,
	contentClassName,
	showStar = false,
	onWishlistSort,
	hideSorting = false,
	favoriteCollection,
	showFavoriteCollection = false,
	authUserId,
	enableSelectProduct,
	onSelectProductClick,
	selectedProducts
}) => {
	const [list, setList] = useState(wishlistData);

	useEffect(() => {
		setList(wishlistData);
	}, [wishlistData]);

	const onWishlistSortEnd = () => {
		setList(wishlistData);
		onWishlistSort(wishlistData);
	};

	const DragHandle = SortableHandle(() => (
		<div className={styles.dragHandleContainer}>
			{/* <div
				className='w-4 h-2'
				style={{
					background:
						"-webkit-linear-gradient(top, rgb(0, 0, 0), rgb(0, 0, 0) 20%, rgb(255 255 255 / 0%) 0px, rgb(255 255 255 / 0%) 40%, rgb(0, 0, 0) 0px, rgb(0, 0, 0) 60%, rgb(255 255 255 / 0%) 0px, rgb(255 255 255 / 0%) 80%, rgb(0, 0, 0) 0px, rgb(0, 0, 0))",
				}}
			/> */}
			<img
				src={"/icons/drag-indicator-grey.png"}
				alt='drag-indicator'
				height={20}
				width={20}
			/>
		</div>
	));

	const SortableWishlistItem = ({ value: wishlist, handleSelectProduct, isSelected }) => {

		return (
			<div
				key={wishlist._id}
				className={`${styles.wishlistItemContainer} ${wishlist.status !== PUBLISHED ? styles.unpublishedBg : styles.publishedContentBg}`}
				style={contentClassName ? { backgroundColor: contentClassName.replace('bg-', '') } : {}}
				onClick={(e) => {
				if(enableSelectProduct && wishlist.collection_name != "Editor’s Picks"){
					// e.preventDefault()
					// e.stopPropagation()
					handleSelectProduct(e)
				}
				else{
					onWishlistClick(wishlist)
				}}
			}
				>
				{activeCollection === "Feature" && (
					<>
						{!hideSorting && !enableSelectProduct ? <DragHandle /> : null}

						{enableSelectProduct && wishlist.collection_name != "Editor’s Picks" && (
							<input
								type='checkbox'
								checked={isSelected}
								onClick={handleSelectProduct}
								onChange={() => { }} // fix onchange handler warning
								className={styles.checkboxInput}
							/>
						)}

						{showStar && !enableSelectProduct && (
							<StarFilled
								className={`${styles.starIconContainer} ${wishlist.starred ? styles.starFilled : styles.starEmpty}`}
								onClick={(e) => {
									e.stopPropagation();
									onStarClick(wishlist);
								}}
							/>
						)}
					</>
				)}

			<h3 className={styles.wishlistTitle}>
				{getCollectionNameToShow(wishlist)}
				{authUserId && wishlist.user_id && wishlist.user_id !== authUserId ? (
					<UserOutlined className={styles.userIconBadge} />
					) : null}
				</h3>
			<div className={styles.arrowContainer}>
				<ArrowRightOutlined className={styles.arrowIcon} />
				</div>
			</div>
		);
	};

	return isWishlistFetching && !list.length ? (
		<>
			<Skeleton.Input active className={styles.skeletonLoader} />
			<Skeleton.Input active className={styles.skeletonLoader} />
			<Skeleton.Input active className={styles.skeletonLoader} />
		</>
	) : (
		<div>
			{showFavoriteCollection ? (
				<SortableWishlistItem
					value={{
						...favoriteCollection,
						collection_name: favorites_collection_name,
					}}
				/>
			) : null}
			<SortableContainer
				items={list}
				ItemComponent={SortableWishlistItem}
				onSortEnd={onWishlistSortEnd}
				useMoveMutable
				uniqueKey='_id'
				sortableProps={{
					useDragHandle: true,
				}}
				enableSelectProduct={enableSelectProduct}
				onSelectProductClick={onSelectProductClick}
				selectedProducts={selectedProducts}
			/>
			{/* {wishlistData.length && // REMOVE
				[...wishlistData].map(sortableWishlistItemGenerator)} */}
		</div>
	);
};

export default WishListItems;
