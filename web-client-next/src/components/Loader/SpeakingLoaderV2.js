import React from "react";

import styles from './loader.module.scss';

const SpeakingLoaderV2 = ({ className = "" }) => {
	return (
		<div
			id='speaking_loader'
			className={`speaking-loader-v2-wrapper flex items-center ${className}`}>
			<div class='slw'>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default SpeakingLoaderV2;
