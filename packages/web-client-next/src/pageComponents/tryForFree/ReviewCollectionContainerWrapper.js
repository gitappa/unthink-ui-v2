// review collection container wrapper for create/ edit collection flow
import React from "react";
import Image from "next/image";
import classyimage from "../../images/Star-icon-background.svg";
import styles from "./tryForFree.module.scss";

const ReviewCollectionContainerWrapper = ({ children }) => {
	return (
		<div
			id='review-collection-container-wrapper'
			className={`${styles.reviewCollectionPanel} ${styles.reviewCollectionContainerWrapper}`}>
			<Image
				className={`${styles.classyBackgroundImage} ${styles.bgImageTop}`}
				src={classyimage}
				alt="bg-image"
				width={516}
				height={528}
			/>
			<Image
				className={`${styles.classyBackgroundImage} ${styles.bgImageBottom}`}
				src={classyimage}
				alt="bg-image"
				width={516}
				height={528}
			/>
			<div className={`${styles.reviewCollectionGlass} ${styles.reviewCollectionContent} ${styles.contentGlass}`}>
				<div className={styles.innerContent}>
					{children}
				</div>
			</div>
		</div>
	);
};

export default ReviewCollectionContainerWrapper;
