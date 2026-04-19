import React from "react";
import Slider from "react-slick";

const sliderSettings = {
	className: "w-full text-white opacity-50",
	dots: false,
	slidesToShow: 5,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2000,
	arrows: false,
	swipe: false,
	responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 3,
				infinite: true,
			},
		},
		{
			breakpoint: 700,
			settings: {
				slidesToShow: 2,
			},
		},
		{
			breakpoint: 500,
			settings: {
				slidesToShow: 1,
			},
		},
	],
};

const BrandsListCarousel = () => {
	return (
		<div>
			<Slider {...sliderSettings}>
				<div className='tracking-widest_6 text-lg text-center'>PERRY ELLIS</div>
				<div className='tracking-widest_2 font-semibold text-xl text-center'>
					FORZIERI
				</div>
				<div className='font-medium text-xl text-center'>JCPenney</div>
				<div className='font-semibold text-2xl text-center'>Hurley</div>
				<div className='font-normal text-xl text-center transform scale-x-150 scale-y-100'>
					bebe
				</div>
			</Slider>
		</div>
	);
};

export default BrandsListCarousel;
