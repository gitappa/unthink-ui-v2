// REMOVE
import React, { useState } from "react";
import Link from "next/link";
import { CaretRightFilled } from "@ant-design/icons";

import CarousalContainer from "../../components/carousel/CarouselContainer";

// import try_it_now from "../../images/newStaticPageImages/productsPage/try_it_now.svg";
import collection_cover_1 from "../../images/newStaticPageImages/productsPage/collection_cover_1.png";
import collection_cover_2 from "../../images/newStaticPageImages/productsPage/collection_cover_2.png";
import collection_cover_3 from "../../images/newStaticPageImages/productsPage/collection_cover_3.png";
import collection_cover_4 from "../../images/newStaticPageImages/productsPage/collection_cover_4.png";
import collection_cover_5 from "../../images/newStaticPageImages/productsPage/collection_cover_5.png";
import styles from "./RootStatic.module.css";

const carouselItems = [
	{
		title: "BT Collection",
		cover_image: collection_cover_1,
	},
	{
		title: "11 In-Flight Essentials",
		cover_image: collection_cover_2,
	},
	{
		title: "Backpacks & Rugsacks",
		cover_image: collection_cover_3,
	},
	{
		title: "Campaign Collection",
		cover_image: collection_cover_4,
	},
	{
		title: "Travel Essentials",
		cover_image: collection_cover_5,
	},
];

const RootStatic = () => {
	const [playVideo, setPlayVideo] = useState(true);

	return (
		<div className={styles.container}>
			<section className={styles.introSection}>
				<div className={styles.introContent}>
					<h1 className={styles.introTitle}>
						Revolutionizing Consumer
						{/* <br /> Experiences With AI */}
					</h1>
					<p className={styles.introSubtitle}>
						Welcome to the future of retail and e-commerce, <br /> where
						technology and real people come together to create a seamless and
						personalized shopping experience.
					</p>
				</div>
			</section>

			<section className={styles.collectionSection}>
				{/* <img
					alt='try_it_now'
					src={try_it_now}
					className='absolute -top-24 md:-top-20 lg:-top-36 w-24 lg:w-auto'
				/> */}
				<div className={styles.collectionContent}>
					<div>
						<h1 className={styles.collectionTitle}>
							My collections and products
						</h1>
					</div>
					<div className={styles.tagsContainer}>
						<div className={styles.tagItem}>
							<h5 className={styles.tagText}>
								Footwear
							</h5>
						</div>
						<div className={styles.tagItem}>
							<h5 className={styles.tagText}>
								Chess
							</h5>
						</div>
						<div className={styles.tagItem}>
							<h5 className={styles.tagText}>
								Summer Collection
							</h5>
						</div>
						<div className={styles.tagItem}>
							<h5 className={styles.tagText}>
								Daily Driver
							</h5>
						</div>
					</div>
				</div>
				{carouselItems?.length >= 5 ? (
					<div className={styles.carouselSection}>
						<CarousalContainer items={carouselItems} hideTitle />
					</div>
				) : null}
			</section>

			<section className={styles.discoverySection}>
				<div className={styles.discoveryContent}>
					<div className={styles.discoveryTextContainer}>
						<h1 className={styles.discoveryTitle}>
							<span className={styles.boldText}>
								Contextual <br /> product discovery <br /> powered by AI and
								<br /> real people
							</span>{" "}
						</h1>
					</div>

					<div className={styles.videoContainer}>
						{playVideo ? (
							<video
								autoPlay
								loop
								muted
								id='home_page_video'
								playsInline // to make it auto play on iphone
								poster='https://cdn.unthink.ai/img/unthink_ai/POSTER_BRANDS_INTRO.png'
								// poster='https://cdn.yfret.com/static/img/POSTER_BRANDS_INTRO.webp'
								className={styles.videoElement}>
								<source
									src='https://cdn.unthink.ai/video/GIF_BRANDS_INTRO.mp4'
									// src='https://cdn.yfret.com/static/vid/GIF_BRANDS_INTRO.webm'
									type='video/mp4'
								/>
							</video>
						) : (
							<>
								<img
									id='home_page_poster'
									src='https://cdn.unthink.ai/img/unthink_ai/POSTER_BRANDS_INTRO.png'
									className={styles.videoElement}
								/>

								<div
									className={styles.playOverlay}
									onClick={() => setPlayVideo(true)}>
									<CaretRightFilled className={styles.playIcon} />
								</div>
							</>
						)}
					</div>
				</div>
			</section>

			<section className={styles.linksSection}>
				<div className={styles.linksContainer}>
					<Link
						className={styles.linkItem}
						href='/brands'>
						Brands(Online and Offline)
					</Link>
					<Link
						className={styles.linkItem}
						href='/publishers'>
						Publishers, Influencers & Shopify brands
					</Link>
					<Link
						className={styles.linkItem}
						href='/pop-up-store'>
						Online Pop-up Store
					</Link>
				</div>
			</section>
		</div>
	);
};

export default RootStatic;
