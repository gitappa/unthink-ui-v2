import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Typography } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { FreeMode, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { getFinalImageUrl } from "../../helper/utils";
import carousel_arrow_icon from "../../images/carousel_arrow_icon.png";

import styles from './Carousal.module.scss';
import cssStyles from './CarouselContainer.module.css';
import ReactPlayer from "react-player";

const { Text } = Typography;
SwiperCore.use([FreeMode, Mousewheel]);

function CarousalContainer({
	items,
	handleItemClick,
	hideTitle = false,
	showOuterTitle = false,
	description,
	collection_image_list,
}) {
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const swiperRef = useRef(null);

	const handlePrevArrowClick = () => {
		swiperRef.current?.slidePrev(0);
	};

	const handleNextArrowClick = () => {
		swiperRef.current?.slideNext(0);
	};

	const handleCardClick = (item) => {
		if (!handleItemClick) return;
		if (swiperRef.current && !swiperRef.current.allowClick) return;
		handleItemClick(item);
	};

	const handlePreviewImageClick = (event, imageUrl) => {
		if (swiperRef.current && !swiperRef.current.allowClick) return;
		event.stopPropagation();
		setPreviewImage(imageUrl);
		setPreviewVisible(true);
	};
	useEffect(() => {
		if (previewVisible) {
			document.body.style.overflow = "hidden";   // disable scroll
		} else {
			document.body.style.overflow = "auto";     // enable scroll
		}
	}, [previewVisible]);

	const [hoveredIndex, setHoveredIndex] = useState(null);

	const handleMouseEnter = (index) => {
		setHoveredIndex(index);
	};

	const handleMouseLeave = () => {
		setHoveredIndex(null);
	};

	const isSocialMediaVideo = (url) => {
		return (
			typeof url === "string" &&
			(url.includes("facebook.com") || url.includes("instagram.com"))
		);
	};

	return (
		<>


			{showOuterTitle && (
				<>
					<div className={cssStyles.outerTitleWrapper}>
						<h1 className={cssStyles.outerTitle}>
							Featured Collections
						</h1>
						{description ? (
							<div className={cssStyles.descriptionBlock}>
								<Text className={cssStyles.descriptionText}>
									{description}
								</Text>
							</div>
						) : null}
					</div>
				</>
			)}
			<div className={cssStyles.overflowHidden}>
				<div className={styles.un_bt_gallery}>
					{!hideTitle && (
						<div className={styles.un_bt_carousel_title_container}>
							<h1 className={`${styles.un_bt_carousel_main_title} collection_title`}>
								Featured Collections
							</h1>
							{/* <h1 className='un_bt_carousel_sub_title'>
								Whether you’re blocking out your seatmate’s snoring or trying to
								catch every last word of your favorite podcast, a solid set of
								headphones is non-negotiable.
							</h1> */}
						</div>
					)}

						<div className={`${styles.un_bt_gallery_container} ${cssStyles.selectNone}`}>
							<Swiper
								onSwiper={(swiper) => {
									swiperRef.current = swiper;
								}}
								modules={[FreeMode, Mousewheel]}
								slidesPerView='auto'
								spaceBetween={16}
								speed={480}
								allowTouchMove={true}
								simulateTouch={true}
								followFinger={true}
								touchRatio={1.15}
								threshold={3}
								touchStartPreventDefault={false}
								touchReleaseOnEdges={true}
								freeMode={{
									enabled: true,
									momentum: true,
									momentumRatio: 0.9,
									momentumVelocityRatio: 0.85,
									minimumVelocity: 0.05,
									momentumBounce: false,
									sticky: false,
								}}
								mousewheel={{
									forceToAxis: false,
									releaseOnEdges: true,
									sensitivity: 1,
									thresholdDelta: 2,
									thresholdTime: 40,
								}}
								grabCursor={true}
								breakpoints={{
									0: {
										spaceBetween: 10,
									},
									768: {
										spaceBetween: 12,
									},
									1024: {
										spaceBetween: 16,
									},
								}}
								className={styles.un_bt_swiper}>
								{items?.map((item, i) => (
									<SwiperSlide key={i} className={styles.un_bt_swiper_slide}>
										<div
											className={styles.un_bt_gallery_item_swiper}
											onMouseEnter={() => handleMouseEnter(i)}
											onMouseLeave={handleMouseLeave}
											onClick={() => handleCardClick(item)}>
										{/* Show video if hovered, otherwise show image */}
										{collection_image_list ? (
											<div className={cssStyles.relativeFullSize}>
											<Image
												src={getFinalImageUrl(item)}
												alt={item?.title || 'carousel-image'}
												className={`${styles.un_bt_cover_image} ${cssStyles.coverImageFull}`}
													draggable={false}
													fill
													style={{ objectFit: 'cover' }}
													onClick={(event) =>
														handlePreviewImageClick(event, getFinalImageUrl(item))
													}
												/>
											</div>
									) : item.cover_image ? (
										hoveredIndex === i &&
											item.video_url &&
											!isSocialMediaVideo(item.video_url) ? (
											<>
												<ReactPlayer
													className={`${cssStyles.videoPlayer} Video_player`}
													url={item.video_url}
													playing={true} // Autoplay video on hover
													muted={true}
													loop={true}
													width='100%'
													height='100%'
													controls={false}
													playsinline
												/>
												{/* Transparent overlay to block interaction with the video */}
													<div
														className={`${cssStyles.videoOverlay} ${handleItemClick ? cssStyles.cursorPointer : ""
															}`}
														onClick={() =>
															handleCardClick(item)
														} // Redirect to details page on click
													/>
											</>
										) : (
											<div className={styles.relative}>
												<Image
													src={getFinalImageUrl(item?.cover_image?.src || item?.cover_image)}
													alt={item?.title || 'carousel-cover'}
													className={`${styles.un_bt_cover_image} ${styles.w_full}`}
													draggable={false}
													fill
													style={{ objectFit: 'cover' }}
												/>
											</div>
										)
									) : item.video_url && !isSocialMediaVideo(item.video_url) ? (
										<>
											<ReactPlayer
												className={`${cssStyles.videoPlayer} Video_player`}
												url={item.video_url}
												playing={hoveredIndex === i} // Play video only on hover
												muted={true}
												loop={true}
												width='100%'
												height='100%'
												controls={false}
												playsinline
											/>
											{/* Transparent overlay to block interaction with the video */}
												<div
													className={`${cssStyles.videoOverlay} ${handleItemClick ? cssStyles.cursorPointer : ""
														}`}
													onClick={() => handleCardClick(item)} // Redirect to details page on click
												/>
										</>
									) : null}

									{/* Title Gradient */}
									<div className={styles.un_bt_title_gradiant}></div>

									{/* Card Title */}
									<div className={styles.un_bt_card_title}>
											<h1 className={styles.text_white} title={item?.title}>
												<span>{item?.title}</span>
											</h1>
										</div>
										</div>
									</SwiperSlide>
								))}
							</Swiper>
								<button
									type='button'
									aria-label='Previous slide'
									className={`${styles.un_bt_gallery_controls} ${styles.un_bt_gallery_controls_previous}`}
									onClick={handlePrevArrowClick}>
								<div className={styles.un_bt_gallery_controls_inner_container}>
								<Image
									src={carousel_arrow_icon}
									alt='previous arrow'
									width={40}
									height={40}
									className={styles.un_bt_gallery_arrow_icon}
								/>
							</div>
						</button>
								<button
									type='button'
									aria-label='Next slide'
									className={`${styles.un_bt_gallery_controls} ${styles.un_bt_gallery_controls_next}`}
									onClick={handleNextArrowClick}>
							<div className={styles.un_bt_gallery_controls_inner_container}>
								<Image
									src={carousel_arrow_icon}
									alt='next arrow'
									width={40}
									height={40}
									className={styles.un_bt_gallery_arrow_icon}
								/>
							</div>
						</button>
					</div>
				</div>


			</div>

			<div  >
				{previewVisible &&
					<div className="product-image-modal-overlay" >
						<div className="product-image-modal-container" style={{ minHeight: '85vh', overflow: 'hidden' }}>
							<button onClick={() => { setPreviewVisible(false), setPreviewImage('') }} className={cssStyles.previewCloseBtn}  >X</button>
							<div className={cssStyles.previewImageWrapper}>
								<Image
									src={previewImage}
									alt='preview image'
									fill
									style={{ objectFit: 'contain' }}
								/>
							</div>
						</div>
					</div>

				}
			</div>
		</>
	);
}

export default CarousalContainer;
