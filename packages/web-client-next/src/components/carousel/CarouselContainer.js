import React, { useEffect, useRef, useState, useMemo } from "react";
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
import ReactPlayer from "react-player";
import Modal from "../modal/Modal";

const { Text } = Typography;

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

	const containerRef = useRef(null);

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

	const handlePrevArrowClick = () => {
		dispatch(
			setCollectionCarouselAction({
				type: "navigation",
				action: "previous",
				metadata: {},
			})
		);
	};

	const handleNextArrowClick = () => {
		dispatch(
			setCollectionCarouselAction({
				type: "navigation",
				action: "next",
				metadata: {},
			})
		);
	};

	useEffect(() => {
		const containerElement = containerRef.current;
		if (containerElement) {
			// commented out the swipe feature on carousal // enable it when needed
			// containerElement.addEventListener("swiperight", handlePrevArrowClick);
			// containerElement.addEventListener("swipeleft", handleNextArrowClick);
			// return () => {
			// 	containerElement.removeEventListener(
			// 		"swiperight",
			// 		handlePrevArrowClick
			// 	);
			// 	containerElement.removeEventListener("swipeleft", handleNextArrowClick);
			// };
		}

		return () => {};
	}, [containerRef.current]);
useEffect(() => {
  if (previewVisible) {
    document.body.style.overflow = "hidden";   // disable scroll
  } else {
    document.body.style.overflow = "auto";     // enable scroll
  }}, [previewVisible])
  
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
					<div className='max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto lg:mb-8'>
						<h1 className='text-display-l font-semibold'>
							Featured Collections
						</h1>
						{description ? (
							<div className='block w-full mt-2 lg:mt-3'>
								<Text className='text-sm lg:text-lg leading-6 max-w-3xl-1 w-full whitespace-pre-line'>
									{description}
								</Text>
							</div>
						) : null}
					</div>
				</>
			)}
			<div className='overflow-hidden'>
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

					<div className={`${styles.un_bt_gallery_container} select-none`}>
						{items?.map((item, i) => {
							const displayItems = [...totalItems].splice(0, 5);
							const positionIndex = displayItems.includes(i + 1)
								? displayItems.indexOf(i + 1) + 1
								: null;

							return (
								<div
									key={i}
									className={`${styles.un_bt_gallery_item} ${
										positionIndex ? styles[`un_bt_gallery_item_${positionIndex}`] : ""
									}`}
									onMouseEnter={() => handleMouseEnter(i)}
									onMouseLeave={handleMouseLeave}
									onClick={() => handleItemClick && handleItemClick(item)}>
									{/* Show video if hovered, otherwise show image */}
									{collection_image_list ? (
										<div className='relative w-full h-full'>
											<Image
												src={getFinalImageUrl(item)}
												alt={item?.title || 'carousel-image'}
												className={`${styles.un_bt_cover_image} w-full`}
												draggable={false}
												fill
												style={{ objectFit: 'cover' }}
												onClick={() => {
													setPreviewImage(getFinalImageUrl(item))
													console.log("getFinalImageUrl", getFinalImageUrl(item))
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
													className='absolute top-0 left-0 w-full h-full Video_player'
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
													className={`absolute top-0 left-0 w-full h-full z-10 ${
														handleItemClick ? "cursor-pointer" : ""
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
												className='absolute top-0 left-0 w-full h-full Video_player'
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
												className={`absolute top-0 left-0 w-full h-full z-10 ${
													handleItemClick ? "cursor-pointer" : ""
												}`}
												onClick={() => handleItemClick && handleItemClick(item)} // Redirect to details page on click
											/>
										</>
									) : null}

									{/* Title Gradient */}
									<div className='un_bt_title_gradiant'></div>

									{/* Card Title */}
									<div className={styles.un_bt_card_title}>
										<h1 className={styles.text_white} title={item?.title}>
											<span>{item?.title}</span>
										</h1>
									</div>
								</div>
							);
						})}
						<div
							className={`${styles.un_bt_gallery_controls} ${styles.un_bt_gallery_controls_previous}`}
							onClick={handlePrevArrowClick}>
							<div className={styles.un_bt_gallery_controls_inner_container}>
								<Image 
									src={carousel_arrow_icon} 
									alt='previous arrow'
									width={40}
									height={40}
								/>
							</div>
						</div>
						<div
							className={`${styles.un_bt_gallery_controls} ${styles.un_bt_gallery_controls_next}`}
							onClick={handleNextArrowClick}>
							<div className={styles.un_bt_gallery_controls_inner_container}>
								<Image 
									src={carousel_arrow_icon} 
									alt='next arrow'
									width={40}
									height={40}
								/>
							</div>
						</div>
					</div>
				</div>

			 
			</div>
			 
			<div  >	
				{previewVisible && 
				<div className="product-image-modal-overlay" >
				 <div className=" product-image-modal-container overflow-hidden " style={{minHeight:'85vh'}}>
					<button onClick={()=>{setPreviewVisible(false), setPreviewImage('') }} className="text-white cursor-pointer text-xl font-semibold  text-right  mb-3  absolute top-3 right-5 "  >X</button>
					<div className='relative w-full h-img-popup'>
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
