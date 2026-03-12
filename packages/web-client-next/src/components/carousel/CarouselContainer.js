import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "antd";
// import tocca from "tocca"; // to import tocca script when this component loads // removed library because it was causing build error

import {
	resetCollectionCarouselAction,
	setCollectionCarouselAction,
} from "./redux/action";
import { getFinalImageUrl } from "../../helper/utils";
import carousel_arrow_icon from "../../images/carousel_arrow_icon.png";

import styles from './Carousal.module.scss';
import cssStyles from './CarouselContainer.module.css';
import ReactPlayer from "react-player";
import Modal from "../modal/Modal";

const { Text } = Typography;
const CAROUSEL_TRANSITION_MS = 720;

function CarousalContainer({
	items,
	handleItemClick,
	hideTitle = false,
	showOuterTitle = false,
	description,
	collection_image_list,
}) {

	const dispatch = useDispatch();
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState("");

	const [carouselAction] = useSelector((state) => [
		state.appState.carousel.action,
	]);
	const [totalItems, setTotalItems] = useState([]);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const containerRef = useRef(null);
	const transitionTimerRef = useRef(null);
	const interactionLockedRef = useRef(false);
	const dragStartXRef = useRef(null);
	const isPointerDownRef = useRef(false);

	useEffect(() => {
		setTotalItems(() => {
			let array = items?.map((item, i) => i + 1);
			return array.slice(-2).concat(array.slice(0, -2));
		});
	}, [items]);

	const onNavigationChange = () => {
		const currentItemsOrder = [...totalItems];
		if (carouselAction?.action === "next") {
			currentItemsOrder.push(currentItemsOrder.shift());
		} else {
			currentItemsOrder.unshift(currentItemsOrder.pop());
		}
		setTotalItems(currentItemsOrder);
		dispatch(resetCollectionCarouselAction());
	};

	useEffect(() => {
		if (carouselAction?.action && carouselAction?.type) {
			onNavigationChange();
		}
	}, [carouselAction]);

	const lockInteraction = () => {
		interactionLockedRef.current = true;
		setIsTransitioning(true);
		if (transitionTimerRef.current) {
			clearTimeout(transitionTimerRef.current);
		}
		transitionTimerRef.current = setTimeout(() => {
			interactionLockedRef.current = false;
			setIsTransitioning(false);
		}, CAROUSEL_TRANSITION_MS);
	};

	const triggerNavigation = (direction) => {
		if (interactionLockedRef.current) return;
		lockInteraction();

		dispatch(
			setCollectionCarouselAction({
				type: "navigation",
				action: direction,
				metadata: {},
			})
		);
	};

	const handlePrevArrowClick = () => {
		triggerNavigation("previous");
	};

	const handleNextArrowClick = () => {
		triggerNavigation("next");
	};

	useEffect(() => {
		return () => {
			if (transitionTimerRef.current) {
				clearTimeout(transitionTimerRef.current);
				transitionTimerRef.current = null;
			}
			interactionLockedRef.current = false;
			dragStartXRef.current = null;
			isPointerDownRef.current = false;
		}
	}, []);

	const handleCarouselWheel = (event) => {
		const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
		if (Math.abs(delta) < 12) return;
		event.preventDefault();
		if (delta > 0) {
			handleNextArrowClick();
		} else {
			handlePrevArrowClick();
		}
	};

	const handlePointerDown = (event) => {
		isPointerDownRef.current = true;
		dragStartXRef.current = event.clientX;
	};

	const handlePointerUp = (event) => {
		if (!isPointerDownRef.current || dragStartXRef.current === null) {
			isPointerDownRef.current = false;
			dragStartXRef.current = null;
			return;
		}

		const deltaX = event.clientX - dragStartXRef.current;
		if (Math.abs(deltaX) >= 55) {
			if (deltaX < 0) {
				handleNextArrowClick();
			} else {
				handlePrevArrowClick();
			}
		}

		isPointerDownRef.current = false;
		dragStartXRef.current = null;
	};
	useEffect(() => {
		if (previewVisible) {
			document.body.style.overflow = "hidden";   // disable scroll
		} else {
			document.body.style.overflow = "auto";     // enable scroll
		}
	}, [previewVisible])

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
		<  >


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

					<div
						ref={containerRef}
						className={`${styles.un_bt_gallery_container} ${cssStyles.selectNone} ${isTransitioning ? styles.is_transitioning : ""}`}
						onWheel={handleCarouselWheel}
						onPointerDown={handlePointerDown}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerUp}
						onPointerLeave={handlePointerUp}>
						{items?.map((item, i) => {
							const displayItems = [...totalItems].splice(0, 5);
							const positionIndex = displayItems.includes(i + 1)
								? displayItems.indexOf(i + 1) + 1
								: null;

							return (
								<div
									key={i}
									className={`${styles.un_bt_gallery_item} ${positionIndex ? styles[`un_bt_gallery_item_${positionIndex}`] : ""
										}`}
									onMouseEnter={() => handleMouseEnter(i)}
									onMouseLeave={handleMouseLeave}
									onClick={() => handleItemClick && handleItemClick(item)}>
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
												onClick={() => {
													setPreviewImage(getFinalImageUrl(item))
												 
													setPreviewVisible(true)
												}}
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
														handleItemClick && handleItemClick(item)
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
												onClick={() => handleItemClick && handleItemClick(item)} // Redirect to details page on click
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
							);
						})}
							<button
								type='button'
								aria-label='Previous slide'
								disabled={isTransitioning}
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
								disabled={isTransitioning}
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
