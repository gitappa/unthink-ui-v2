import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Image } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider from "react-slick";

import TitleSuffix from "./TitleSuffix";
import leftImage from "../../images/carousel-left.svg";
import rightImage from "../../images/carousel-right.svg";
import { SocketContext } from "../../context/socket";
import { searchTextOnStore } from "../../helper/utils";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomArrow = (props) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={`${className} slider-custom-arrow -right-2`}
			style={{ ...style, display: "block" }}
			onClick={onClick}>
			<Image src={props.src} preview={false} />
		</div>
	);
};
const { Text } = Typography;
const Category = (props) => {
	const [categoryState, mute] = useSelector((state) => [
		state.home.category,
		state?.chat?.mute,
	]);
	const categoryData = categoryState.data ?? [];
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const handleCategoryClick = (data) => {
		const messageData = data.action_string ?? `search ${data.sub_category}`;
		searchTextOnStore(messageData);
	};
	return (
		categoryData?.length > 0 && (
			<div>
				{categoryData.map((data) => {
					return <CategoryList data={data} handleClick={handleCategoryClick} />;
				})}
			</div>
		)
	);
};

const CategoryList = (props) => {
	const data = props.data ?? {};
	const sliderSettings = {
		className: "w-full px-4",
		dots: false,
		infinite: false,
		centerMode: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		variableWidth: true,
		nextArrow: <CustomArrow src={rightImage} />,
		prevArrow: <CustomArrow src={leftImage} />,
	};
	return (
		data.subcategories && (
			<div className='w-full-80px bg-gray-100 mx-auto my-3 shadow py-4'>
				<Text className='uppercase font-bold p-8 box-border'>
					{data.category}
				</Text>
				<div className='p-4'>
					<Slider {...sliderSettings}>
						{data.subcategories.map((d) => {
							if (d.image) {
								return (
									<div
										className='w-200px px-2 flex flex-col gap-2 cursor-pointer'
										onClick={() => {
											props.handleClick(d);
										}}>
										<div className='h-180px bg-white text-center'>
											<LazyLoadImage
												src={d.image}
												alt={d["sub_category"] ?? "Product"}
												width={"100%"}
												height={"100%"}
												effect='blur'
												className='object-contain h-full'
											/>
										</div>
										<Text className='capitalize text-center font-medium w-full'>
											<TitleSuffix
												title={d["sub_category"]}
												title_suffix={d.title_suffix}
											/>
										</Text>
									</div>
								);
							}

							return null;
						})}
					</Slider>
				</div>
			</div>
		)
	);
};

export default Category;
