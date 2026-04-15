import React from "react";

import styles from './loader.module.scss';
import cssStyles from './Loader.module.css';

export default function SearchLoader1() {
	return (
		<div className={`search-loader-1-wrapper ${cssStyles.flexItemsCenter}`}>
			<div >
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div >
	);
}
