import React from "react";

import styles from './loader.module.scss';
import cssStyles from './Loader.module.css';

export default function AuraSpeakingLoader() {
	return (
		<div className='aura-speaking-loader-wrapper'>
			<div className={`aslw ${cssStyles.roundedFull}`}></div>
		</div>
	);
}
