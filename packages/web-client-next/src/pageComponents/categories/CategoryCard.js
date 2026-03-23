import React from "react";
import Image from "next/image";
import styles from "./categoryCard.module.scss";

const CategoryCard = ({ categoryData, handleCategoryClick }) => (
	// console.log('categoryData',categoryData.image_url),
	
	<div
		className={styles.card}
		onClick={() => handleCategoryClick(categoryData)}>
		<div className={styles.imageWrapper}>
			<Image
				src={categoryData?.image_url}
				alt={categoryData?.title || 'Category'}
				fill
				className={styles.image}
				style={{ objectFit: 'cover' }}
			/>
			{/* <LazyLoadImage
				src={categoryData?.image_url}
				width='100%'
				className='rounded-xl aspect-square h-auto object-cover'
			/> */}
		</div>
		{/* category card footer */}
		<div className={`${styles.footer} category-card-footer`}>
			<p
				title={categoryData?.title}
				className={`${styles.title} category-title`}>
				{categoryData?.title}
			</p>
		</div>
	</div>
);

export default React.memo(CategoryCard);
