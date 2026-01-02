// review collection container wrapper for create/ edit collection flow
import React from "react";
import Image from "next/image";
import classyimage from "../../images/Star-icon-background.svg";
import styles from "./tryForFree.module.scss";

const ReviewCollectionContainerWrapper = ({ children }) => {
	return (
		<div
			id='review-collection-container-wrapper'
			className={`${styles.reviewCollectionContainerWrapper} ${styles.reviewCollectionPanel} tablet:mx-4 desktop:mx-8 relative`}>
			<Image
				className={`absolute top-24 -left-10 ${styles.classyBackgroundImage}`}
				src={classyimage}
				alt="bg-image"
				width={516}
				height={528}
			/>
			<Image
				className={`absolute -top-10 -right-10 ${styles.classyBackgroundImage}`}
				src={classyimage}
				alt="bg-image"
				width={516}
				height={528}
			/>
			<div className={`${styles.reviewCollectionGlass} ${styles.reviewCollectionContent} p-3 tablet:px-4 tablet:py-3 desktop:px-8 desktop:py-6 tablet:rounded-2xl flex justify-center`}>
				<div className='w-full max-w-s-3 tablet:max-w-screen-tablet desktop:max-w-screen-desktop'>
					{children}
				</div>
			</div>
		</div>
	);
};

export default ReviewCollectionContainerWrapper;
