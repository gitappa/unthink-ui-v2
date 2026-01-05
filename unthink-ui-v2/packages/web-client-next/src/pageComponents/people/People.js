import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import temp_influencer_profile from "../../images/profilePage/temp_influencer_profile.png";
import CollectionCard from "./CollectionCard";
import { generateRoute } from "../../helper/utils";
import { useNavigate } from "../../helper/useNavigate";

const People = ({ data, closePeople }) => {
	const navigate = useNavigate();
	const redirectToInfluencerPage = () => {
		const route = generateRoute(data?.user_id, data?.user_name);
		navigate(route);
		closePeople();
	};

	return (
		<div className='pt-6 lg:pt-12'>
			<div className='pb-1 md:pb-4'>
				<h1
					className='text-xl md:text-xl-2 font-semibold cursor-pointer max-w-max'
					onClick={redirectToInfluencerPage}>
					{data?.first_name} {data?.last_name}
				</h1>
			</div>
			<div className='flex flex-col lg:flex-row'>
				<div className='w-full grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-5 pt-2 lg:pt-0'>
					<div
						className='h-134 md:h-200 lg:h-700 lg:max-w-480 col-span-2 md:col-span-3 lg:col-span-1 lg:row-span-2 flex-grow cursor-pointer'
						onClick={redirectToInfluencerPage}>
						<LazyLoadImage
							src={data?.profile_image || temp_influencer_profile} // used dummy image
							width='100%'
							height='100%'
							className='object-cover rounded-xl h-134 md:h-200 lg:h-700'
						/>
					</div>

					{data?.collection.map((collection) => (
						<div key={collection.collection_id}>
							<CollectionCard
								collection={collection}
								handleCollectionClick={redirectToInfluencerPage}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default People;
