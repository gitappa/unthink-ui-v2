import React, { useRef, useState, useEffect } from "react";
import { Select } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Addmore from "../../images/addmore2.svg";
import { TAGS_TITLE } from "../../constants/codes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import SwiperCore, { FreeMode } from "swiper";
import { PlusOutlined } from "@ant-design/icons";
// Initialize Swiper modules
SwiperCore.use([FreeMode]);

const CollectionEditTags = ({
	currentCollectionTags,
	selectedTags,
	editTagsValue,
	editTagsError,
	enableTagSelection = false,
	showEditTagsInput,
	onClearSelectedTagsClick,
	handleTagClick,
	handleDeleteTagClick,
	handleEditTagsBtnClick,
	handleEditTagsSaveClick,
	handleEditTagsCancel,
	handleEditTagsChange,
	handleAddKeywords,
}) => {
	const tagInputRef = useRef(null);

	// scroll for tags

	const swiperRef = useRef(null); // To store Swiper instance
	const [isOverflowing, setIsOverflowing] = useState(false);

	const checkOverflow = () => {
		if (swiperRef.current && swiperRef.current.wrapperEl) {
			const { scrollWidth, clientWidth } = swiperRef.current.wrapperEl;
			setIsOverflowing(scrollWidth > clientWidth);
		}
	};

	useEffect(() => {
		// Initial check
		checkOverflow();

		// Recheck on resize
		window.addEventListener("resize", checkOverflow);
		return () => {
			window.removeEventListener("resize", checkOverflow);
		};
	}, [currentCollectionTags]);


	return (
		<div className="flex w-full flex-wrap relative">
			<div className="w-full lg:flex lg:justify-between">
				{showEditTagsInput ? (
					<div className="mt-2 w-full">
						<Select
							mode="tags"
							className="w-full text-base tag-select-input"
							placeholder={`Enter ${TAGS_TITLE}`}
							value={editTagsValue}
							onChange={handleEditTagsChange}
							size="large"
							ref={tagInputRef}
							dropdownStyle={{ display: "none" }}
						/>
						{editTagsError && <p className="text-red-500 font-normal">{editTagsError}</p>}
					</div>
				) : (
					<>
						{/* Add more kewords button */}
						{
							handleAddKeywords && (
								<div className="flex md:hidden w-full justify-end mb-5">
									<div
										className='gap-0.5 text-xs rounded-2xl lead cursor-pointer bg-violet-100 text-white px-3 py-2 Add_to_keyword'
										title={`Click to edit ${TAGS_TITLE}, You can update the ${TAGS_TITLE} and get the products`}
										onClick={handleEditTagsBtnClick}>
										{/* <PlusOutlined className='stroke-current stroke-13' /> */}
										<span> <PlusOutlined /> Edit Keywords</span>
									</div>
								</div>
							)
						}
						<div className={`flex w-full justify-end md:justify-between items-center flex-col-reverse md:flex-row`}>
							<div className={`relative ${handleAddKeywords ? " w-full md:w-3/4 desktop:w-4/5" : "w-full"}`}>
								<Swiper
									slidesPerView="auto"
									spaceBetween={10}
									freeMode={true}
									onSwiper={(swiper) => (swiperRef.current = swiper)}
									className="pb-1 pr-10 mr-5"
								>
									{currentCollectionTags?.length ? (
										<>
											{enableTagSelection && (
												<SwiperSlide style={{ width: "auto" }}>
													<div
														key="All"
														className={`flex items-center rounded-22 border border-violet-100 text-slat-104 shadow px-2 py-0.75 sm:px-4 w-max h-30 ${selectedTags.length === 0 ? "bg-violet-100 text-white" : "bg-transparent"
															}`}
														onClick={() => onClearSelectedTagsClick()}
														role="button"
													>
														<span level={5}
															className={`m-0 font-normal text-xs md:text-sm cursor-pointer whitespace-nowrap  ${selectedTags.length === 0 ? "text-white" : "text-slat-104"} `}>
															All
														</span>
													</div>
												</SwiperSlide>
											)}
											{currentCollectionTags.map((tag) => (
												<SwiperSlide key={tag} style={{ width: "auto" }}>
													<div
														className={`flex items-center border border-violet-100 rounded-22 shadow px-2 py-0.75 sm:px-4 w-max h-30 ${selectedTags.includes(tag) ? "bg-violet-100 text-white" : "bg-transparent"
															}`}
														onClick={() => handleTagClick({ tag })}
														role="button"
													>
														<span
															level={5}
															className={`m-0 font-normal text-xs md:text-sm cursor-pointer whitespace-nowrap  ${selectedTags.includes(tag) ? "text-white" : "text-slat-104"} `}
														>
															{tag}
														</span>
														<button type="button" onClick={(e) => handleDeleteTagClick(e, [tag])}>
															<CloseCircleOutlined className="flex ml-1" />
														</button>
													</div>
												</SwiperSlide>
											))}
										</>
									) : null}
								</Swiper>
								{isOverflowing && (
									<div
										className="absolute right-0 addmore_image_edit top-0"
										style={{ cursor: "pointer", zIndex: 10 }}
										onClick={() => {
											if (swiperRef.current) {
												swiperRef.current.slideNext();
											}
										}}
									>
										<img className="" src={Addmore} alt="Scroll Right" />
									</div>
								)}
							</div>
							{/* Add more kewords button */}
							{
								handleAddKeywords && (
									<div
										className='md:flex hidden items-center gap-0.5 text-xs rounded-2xl lead cursor-pointer bg-violet-100 text-white px-3 py-2 Add_to_keyword'
										title={`Click to edit ${TAGS_TITLE}, You can update the ${TAGS_TITLE} and get the products`}
										onClick={handleEditTagsBtnClick}>
										{/* <PlusOutlined className='stroke-current stroke-13' /> */}
										<span> <PlusOutlined /> Edit Keywords</span>
									</div>
								)
							}
						</div>
					</>
				)
				}

				{
					showEditTagsInput && (
						<div className="text-right pt-2 lg:pl-2">
							<div className="grid grid-cols-2 lg:grid-cols-1 gap-2 w-max ml-auto">
								<button onClick={() => handleEditTagsSaveClick()} className="py-0 px-3 text-white rounded-lg h-6 bg-indigo-103">
									Save
								</button>
								<button onClick={handleEditTagsCancel} className="py-0 px-3 text-white rounded-lg h-6 bg-indigo-103">
									Cancel
								</button>
							</div>
						</div>
					)
				}
			</div >
		</div >
	);
};

export default CollectionEditTags;
