import React from "react";

import styles from './loader.module.scss';
import cssStyles from './Loader.module.css';

const SearchLoaderV2 = ({ className = "" }) => {
	return (
		<div
			id='search_loader'
			className={`search-loader-v2-wrapper ${cssStyles.flexItemsCenter} ${className}`}>
			<div className='sl1w'>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default SearchLoaderV2;
