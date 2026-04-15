import React, { useContext } from "react";
import { Typography, Space, Skeleton, Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

import { SocketContext } from "../../context/socket";
import { setChatProducts } from "./redux/actions";
import {
	resetHomeWidgets,
	resetCategory,
	setUserProfile,
} from "../Home/redux/actions";
import leftImage from "../../images/carousel-left.svg";
import rightImage from "../../images/carousel-right.svg";
import { searchTextOnStore } from "../../helper/utils";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

const CustomArrow = (props) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={`${className} slider-custom-arrow flex items-center`}
			style={{ ...style, display: "block" }}
			onClick={onClick}>
			<Image src={props.src} preview={false} />
		</div>
	);
};
const ChatSuggestions = ({
	suggestions = [],
	isLoaderEnabled = false,
	tileClassName,
	tileTextClassName,
	hideNavigation = false,
}) => {
	const dispatch = useDispatch();
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
		arrows: !hideNavigation,
	};
	const socket = useContext(SocketContext);
	const [mute, showLoader] = useSelector((state) => [
		state?.chat?.mute,
		state.chat.showLoader,
	]);

	const handleSuggestion = (text) => {
		searchTextOnStore(text);
		dispatch(resetHomeWidgets());
		// dispatch(resetCategory());
		dispatch(setUserProfile([]));
		// dispatch(setChatProducts());
	};
	return (
		<div className='flex w-full-60px'>
			{isLoaderEnabled && showLoader ? (
				<div className='flex m-2 flex-nowrap flex-shrink-0'>
					<Space wrap>
						<Skeleton.Input style={{ width: 90 }} active />
						<Skeleton.Input style={{ width: 150 }} active />
						<Skeleton.Input style={{ width: 120 }} active />
						<Skeleton.Input style={{ width: 80 }} active />
					</Space>
				</div>
			) : (
				<Slider {...sliderSettings}>
					{suggestions?.map &&
						suggestions.map((suggestion, index) => {
							return (
								<div
									key={`chat-suggestion-${index}`}
									onClick={() => handleSuggestion(suggestion)}
									className={`transition ease-in-out duration-500 cursor-pointer rounded-full border border-solid m-1 hover:bg-primary hover:border-white w-max ${
										tileClassName || ""
									}`}>
									<Title
										level={5}
										className={`m-0 p-t-3px p-b-3px p-l-10px p-r-10px  hover:text-white font-normal text-sm ${
											tileTextClassName || ""
										}`}>
										{suggestion}
									</Title>
								</div>
							);
						})}
				</Slider>
			)}
		</div>
	);
};

export default ChatSuggestions;
