import React from "react";

import styles from './erasBar.module.scss';

export const ErasBar = ({ customClass }) => {
	return (
		<div id='eras-bar'>
			<div className='eras-segment debut'></div>
			<div className='eras-segment fearless'></div>
			<div className='eras-segment speak-now'></div>
			<div className='eras-segment red'></div>
			<div className='eras-segment l1989'></div>
			<div className='eras-segment reputation'></div>
			<div className='eras-segment lover'></div>
			<div className='eras-segment folklore'></div>
			<div className='eras-segment evermore'></div>
			<div className='eras-segment midnights'></div>
			<div className='eras-segment poets'></div>
		</div>
	);
};
