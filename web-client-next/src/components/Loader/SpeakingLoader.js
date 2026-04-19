import React from "react";

import styles from './loader.module.scss';
import cssStyles from './Loader.module.css';

export default function SpeakingLoader() {
	return (
		<div className={`speaking-loader-wrapper ${cssStyles.flexItemsCenter}`}>
			<div class='slw'>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
