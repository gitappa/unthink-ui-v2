import React from "react";

import styles from './loader.module.scss';

export default function SpeakingLoader() {
	return (
		<div className='speaking-loader-wrapper flex items-center'>
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
