import React from "react";

import styles from './loader.module.scss';

const SearchLoaderV2 = ({ className = "" }) => {
	return (
		<div
			id='search_loader'
			className={`search-loader-v2-wrapper flex items-center ${className}`}>
			<div className='sl1w'>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default SearchLoaderV2;
