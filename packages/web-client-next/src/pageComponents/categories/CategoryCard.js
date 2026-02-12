import React from "react";
import styles from "./categoryCard.module.scss";

const CategoryCard = ({ categoryData, handleCategoryClick }) => (
	<div
		className={styles.card}
		onClick={() => handleCategoryClick(categoryData)}>
		<div className={styles.imageWrapper}>
			<img
				loading='lazy'
				src={categoryData.image_url}
				width='100%'
				className={styles.image}
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
