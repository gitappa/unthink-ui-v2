import Link from "next/link";
import React from "react";

import { generateRoute, getFinalImageUrl } from "../../helper/utils";

import defaultAvatar from "../../images/avatar.svg";

const CreatorsListView = ({ pageUser }) => {
	if (pageUser.creators && pageUser.creators.length) {
		return (
			<div className='mt-6 mx-auto
    max-w-[350px]
    min-[500px]:max-w-[470px]
    min-[700px]:w-[650px] min-[700px]:max-w-[650px]
    min-[835px]:max-[1535px]:w-[calc(100%_-_80px)] min-[835px]:max-[1535px]:max-w-none
    min-[1271px]:max-[1439px]:w-[1202px] min-[1271px]:max-[1439px]:max-w-[1202px]
    min-[1440px]:w-[1332px] min-[1440px]:max-w-[1332px] mx-auto w-full'>
				<h1 className='text-display-l font-semibold'>Featured Creators</h1>
				<div className='grid grid-cols-3 sm:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-10 mt-7'>
					{pageUser.creators.map((inf) => {
						const route = generateRoute(inf.user_id, inf.user_name);
						return route ? (
							<Link
								key={inf.user_id}
								href={route}
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
						) : (
							<div key={inf.user_id} className='text-center'>
								<div className='px-2 lg:px-4.5'>
									<img
										src={getFinalImageUrl(inf.profile_image) || defaultAvatar}
										className='h-auto w-full aspect-square object-cover rounded-full'
									/>
								</div>
								<p className='text-sm lg:text-base font-semibold mt-2.5 break-all'>{`@${inf.user_name}`}</p>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return null;
};

export default React.memo(CreatorsListView);
