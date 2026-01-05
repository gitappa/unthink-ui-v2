// should be removed
// import React from "react";
// import { Typography, notification, Spin } from "antd";
// import { ArrowLeftOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";

// import {
// 	deleteWishlist,
// 	setIsEditWishlist,
// 	setSelectedWishlistId,
// } from "./redux/actions";
// import WishlistProducts from "./WishlistProducts";
// import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);
// import { generateShareCollectionPath } from "../../helper/utils";

// const { Text } = Typography;

// const WishlistGallery = ({ wishlist, wishListOwner, closeWishlistModal }) => {
// 	const dispatch = useDispatch();

// 	const onBackClick = () => {
// 		// dispatch(setShowWishlistProducts(false)); // REMOVE
// 		dispatch(setSelectedWishlistId(""));
// 	};

// 	const deleteWishlistClick = () => {
// 		dispatch(
// 			deleteWishlist({
// 				...wishlist,
// 			})
// 		);
// 	};

// 	const onCollectionNameClick = () => {
// 		const url = generateShareCollectionPath(
// 			wishListOwner?.user_id,
// 			wishListOwner?.user_name,
// 			wishlist.collection_id
// 		);
// 		if (url) {
// 			navigate(url);
// 			closeWishlistModal();
// 		}
// 	};

// 	return (
// 		<div className='px-4 lg:px-7 h-full'>
// 			<div className='flex items-center cursor-pointer' onClick={onBackClick}>
// 				<ArrowLeftOutlined className='text-base flex' />
// 				<Text className='pl-3 text-base font-medium'>Back</Text>
// 			</div>
// 			<div className='py-6'>
// 				<div className='flex justify-between items-center'>
// 					<div>
// 						<Text
// 							onClick={onCollectionNameClick}
// 							className='text-xl font-medium underline cursor-pointer'>
// 							{wishlist?.name}
// 						</Text>
// 					</div>

// 					<Text
// 						className='pl-3 text-sm font-bold cursor-pointer'
// 						onClick={deleteWishlistClick}>
// 						Delete
// 					</Text>
// 				</div>
// 				<div className='mt-2'>
// 					<Text
// 						className='text-xs font-bold text-blue-103 cursor-pointer'
// 						onClick={() => {
// 							dispatch(setIsEditWishlist(true));
// 							// dispatch(setShowWishlistProducts(false)); // REMOVE
// 						}}>
// 						Quick Edit
// 					</Text>
// 				</div>
// 			</div>

// 			{/* show wishlist products */}
// 			<WishlistProducts
// 				wishlist={wishlist}
// 				// isLoading={isProductRemoving}
// 			/>
// 		</div>
// 	);
// };

// export default WishlistGallery;
