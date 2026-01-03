import React from "react";
import Image from "next/image";

import person_avatar_1 from "../../images/newStaticPageImages/person_avatar_1.svg";
import person_avatar_2 from "../../images/newStaticPageImages/person_avatar_2.svg";

import styles from './staticPageComponents.module.scss';

const TrustBar = ({ text }) => {
	return (
		<div className={'relative max-w-4xl mx-auto ' + styles.trusbar_container}>
			<div className='flex flex-wrap items-center justify-center py-7 px-3.5 bg-lightgray-106 bg-opacity-20 backdrop-filter backdrop-blur-4xl rounded-md relative text-center z-10'>
				<span className='text-base lg:text-xl text-lightgray-101 italic'>
					{text}
				</span>
				<div className='flex px-2'>
					<Image 
						className='z-10' 
						src={person_avatar_1} 
						alt='person_avatar_1'
						width={40}
						height={40}
					/>
					<Image
						className='-ml-3.5'
						src={person_avatar_2}
						alt='person_avatar_2'
						width={40}
						height={40}
					/>
				</div>
			</div>
		</div>
	);
};

export default TrustBar;
