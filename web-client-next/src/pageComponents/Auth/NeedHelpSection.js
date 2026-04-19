import React from "react";
import { Image } from "antd";
import styles from "./authPage.module.scss";

import auth_need_help_aura from "../../images/staticpageimages/auth_need_help_aura.png";

export default function NeedHelpSection() {
	return (
		<div className={styles.needHelpContainer}>
			<Image
				className={styles.needHelpImage}
				src={auth_need_help_aura}
				preview={false}
			/>
			<p className={styles.needHelpText}>Need help? Ask Aura!</p>
		</div>
	);
}
