import Link from "next/link";
import React from "react";

import { generateRoute, getFinalImageUrl } from "../../helper/utils";

import defaultAvatar from "../../images/avatar.svg";

const CreatorsListView = ({ pageUser }) => {
	if (pageUser.creators && pageUser.creators.length) {
		return (
			<div className='max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto w-full'>
				<h1 className='text-display-l font-semibold'>Featured Creators</h1>
				<div className='grid grid-cols-3 sm:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-10 mt-7'>
					{pageUser.creators.map((inf) => (
						<Link
							key={inf.user_id}
							href={generateRoute(inf.user_id, inf.user_name)}
							className='px-0'>
							<div className='text-center'>
								<div className='px-2 lg:px-4.5'>
									<img
										src={getFinalImageUrl(inf.profile_image) || defaultAvatar}
										className='h-auto w-full aspect-square object-cover rounded-full'
									/>
								</div>
								<p className='text-sm lg:text-base font-semibold mt-2.5 break-all'>{`@${inf.user_name}`}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		);
	}

	return null;
};

export default React.memo(CreatorsListView);
