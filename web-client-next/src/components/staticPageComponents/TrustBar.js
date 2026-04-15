import React from "react";
import Image from "next/image";

import person_avatar_1 from "../../images/newStaticPageImages/person_avatar_1.svg";
import person_avatar_2 from "../../images/newStaticPageImages/person_avatar_2.svg";

import styles from './TrustBar.module.css';

const TrustBar = ({ text }) => {
	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<span className={styles.text}>
					{text}
				</span>
				<div className={styles.avatarGroup}>
					<Image
						className={styles.avatarFirst}
						src={person_avatar_1}
						alt='person_avatar_1'
						width={40}
						height={40}
					/>
					<Image
						className={styles.avatarSecond}
						src={person_avatar_2}
						alt='person_avatar_2'
						width={40}
						height={40}
					/>
				</div>
			</div>
		</div>
	);
};

export default TrustBar;
