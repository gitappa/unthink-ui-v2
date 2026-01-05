import React from "react";

const CategoryCard = ({ categoryData, handleCategoryClick }) => (
	<div
		className='flex flex-col cursor-pointer bg-slate-100 rounded-xl p-3 shadow-m'
		onClick={() => handleCategoryClick(categoryData)}>
		<div className='w-full'>
			<img
				loading='lazy'
				src={categoryData.image_url}
				width='100%'
				className='rounded-xl aspect-square h-auto object-cover'
			/>
			{/* <LazyLoadImage
				src={categoryData?.image_url}
				width='100%'
				className='rounded-xl aspect-square h-auto object-cover'
			/> */}
		</div>
		{/* category card footer */}
		<div className='w-full mt-3 rounded-b-xl category-card-footer'>
			<p
				title={categoryData?.title}
				className='text-base category-title lg:text-xl font-semibold text-black-200 overflow-hidden overflow-ellipsis capitalize h-14 text-center'>
				{categoryData?.title}
			</p>
		</div>
	</div>
);

export default React.memo(CategoryCard);
