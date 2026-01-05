import React, { forwardRef } from "react";

import styles from './collectionsContent.module.scss';
import { ERAS_COLLECTIONS_ID } from "../../../constants/codes";

import CollectionsGrid from "./CollectionsGrid";

export const CollectionsContent = ({}) => {
	return (
		<section className='collections-content' id={ERAS_COLLECTIONS_ID}>
			<h2 className='headline'> Collections from the Eras!</h2>
			<p className='sub-headline'>
				Browse through our Eras Tour inspired collections,
				<br />
				featuring fashion from leading ecommerce platforms.
			</p>
			<CollectionsGrid />
		</section>
	);
};
