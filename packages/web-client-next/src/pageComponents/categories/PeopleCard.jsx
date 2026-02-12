import React from "react";
import { Tooltip } from "antd";
import { StarFilled } from "@ant-design/icons";
import { getFinalImageUrl } from "../../helper/utils";

import defaultAvatar from "../../images/avatar.svg";
import styles from "./peopleCard.module.scss";

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
			className={styles.card}
			onClick={() => handleCategoryClick(categoryData)}>
			<div className={styles.imageWrapper}>
				<img
					loading='lazy'
					src={
						categoryData.image_url
							? getFinalImageUrl(categoryData.image_url)
							: defaultAvatar
					}
					width='100%'
					className={styles.image}
				/>
			</div>
			{/* card footer */}
			<div className={`${styles.footer} category-card-footer`}>
				<p
					title={categoryData?.title}
					className={`${styles.title} category-title`}>
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
									className={`${styles.adminButton} ${isCreator
										? styles.creatorActive
										: styles.creatorInactive
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
									className={styles.signInButton}
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
				<div className={styles.starIconWrapper}>
					<div className={styles.starIconInner}>
						<Tooltip
							title={
								starred ? mark_as_seller?.remove_info : mark_as_seller?.info
							}>
							<StarFilled
								className={`${styles.starIcon} ${starred ? styles.starActive : styles.starInactive}`}
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
