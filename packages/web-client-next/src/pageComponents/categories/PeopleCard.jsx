import React from "react";
import { Tooltip } from "antd";
import { StarFilled } from "@ant-design/icons";
import { getFinalImageUrl } from "../../helper/utils";

import defaultAvatar from "../../images/avatar.svg";

const PeopleCard = ({
	categoryData,
	handleCategoryClick,
	handleStarInfluencer,
	handleFeatureCreatorInfluencer,
	isAdminLoggedIn = false,
	handleSignInAsInfluencer,
	starred = false,
	isCreator = false,
	communityProperties,
}) => {
	const { mark_as_seller, sign_in_as_creator, feature_as_creator } =
		communityProperties;
	return (
		<div
			className='flex flex-col cursor-pointer bg-slate-100 rounded-xl p-8 shadow-m relative'
			onClick={() => handleCategoryClick(categoryData)}>
			<div className='w-full'>
				<img
					loading='lazy'
					src={
						categoryData.image_url
							? getFinalImageUrl(categoryData.image_url)
							: defaultAvatar
					}
					width='100%'
					className='rounded-full aspect-square h-auto object-cover'
				/>
			</div>
			{/* card footer */}
			<div className='w-full mt-3 rounded-b-xl category-card-footer'>
				<p
					title={categoryData?.title}
					className='text-base category-title lg:text-xl font-semibold text-black-200 overflow-hidden overflow-ellipsis capitalize h-14 text-center'>
					{categoryData?.title}
				</p>

				{/* // FOR ADMIN USE ONLY // SHOULD BE REMOVED LATER WITH BETTER AUTHENTICATION
				// START */}
				{isAdminLoggedIn && categoryData.key && (
					<>
						{feature_as_creator?.is_display ? (
							<Tooltip
								title={
									isCreator
										? feature_as_creator?.remove_info
										: feature_as_creator?.info
								}>
								<button
									className={`mt-2 text-center w-full ${isCreator
											? "bg-gray-104 text-gray-600"
											: "bg-lightgray-104 text-white"
										}`}
									onClick={(e) =>
										handleFeatureCreatorInfluencer(e, categoryData)
									}>
									{isCreator
										? feature_as_creator?.remove_label
										: feature_as_creator?.label}
								</button>
							</Tooltip>
						) : null}
						{sign_in_as_creator?.is_display ? (
							<Tooltip title={sign_in_as_creator?.info}>
								<button
									className='mt-2 bg-secondary text-primary text-center w-full'
									onClick={(e) =>
										handleSignInAsInfluencer(e, categoryData.key)
									}>
									{sign_in_as_creator?.label}
								</button>
							</Tooltip>
						) : null}
					</>
				)}
				{/* // END */}
			</div>
			{/* // FOR ADMIN USE ONLY
				// START */}
			{isAdminLoggedIn && categoryData.key && mark_as_seller?.is_display && (
				<div className='absolute top-0 right-0'>
					<div className='pr-4 pt-4'>
						<Tooltip
							title={
								starred ? mark_as_seller?.remove_info : mark_as_seller?.info
							}>
							<StarFilled
								className={`text-xl flex ${starred ? "text-yellow-102" : "text-gray-106"
									}`}
								onClick={(e) => {
									handleStarInfluencer(e, categoryData);
								}}
							/>
						</Tooltip>
					</div>
				</div>
			)}
			{/* // END */}
		</div>
	);
};

export default React.memo(PeopleCard);
