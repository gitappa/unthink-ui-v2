// import { Image } from "antd";
// import React, { useState, useEffect } from "react";
// import Slider from "react-slick";
// import "./Popup.css";
// import { Modal } from "antd";

//Images and Icons

// import VectorCross from "../../images/popupImages/VectorCross.svg";
// import Aura from "../../images/popupImages/Aura.svg";

// const Popup = () => {
// 	const [open, setOpen] = useState(
// 		window.localStorage.getItem("popup") ? false : true
// 	);
// 	useEffect(() => {
// 		if (!window.localStorage.getItem("popup"))
// 			window.localStorage.setItem("popup", 1);
// 	}, []);
// 	const settings = {
// 		dots: true,
// 		infinite: true,
// 		speed: 500,
// 		slidesToShow: 1,
// 		slidesToScroll: 1,
// 	};
// 	return (
// 		<Modal
// 			title='Unthink Modal'
// 			visible={open}
// 			onOk={() => setOpen(false)}
// 			onCancel={() => setOpen(false)}
// 			footer={null}
// 			closable={false}
// 			title=''
// 			style={{ width: 860 }}>
// 			<div
// 				onClick={() => setOpen(false)}
// 				className='flex justify-end text-xl cursor-pointer'>
// 				<Image src={VectorCross} preview={false} className='cursor-pointer' />
// 			</div>
// 			<Slider {...settings} className='mb-12'>
// 				<div>
// 					<div className='grid grid-cols-3 justify-center items-center'>
// 						<div>
// 							<Image
// 								height='351'
// 								width='273'
// 								src={Aura}
// 								preview={false}
// 								className='cursor-pointer'
// 							/>
// 						</div>

// 						<div className='border-2 p-4 col-span-2 border-yellow-500'>
// 							<p className='text-base bg-yellow-500 py-7 px-9 text-center m-0'>
// 								Hi! I am Aura, your virtual shopping concierge. You can interact
// 								with me with voice or text.
// 							</p>
// 						</div>
// 					</div>
// 				</div>

// 				<div>
// 					<div className='grid grid-cols-3 justify-center items-center'>
// 						<div>
// 							<Image
// 								height='351'
// 								width='273'
// 								src={Aura}
// 								preview={false}
// 								className='cursor-pointer'
// 							/>
// 						</div>

// 						<div className='border-2 p-4 col-span-2 border-yellow-500'>
// 							<p className='text-base bg-yellow-500 py-7 px-9 text-center m-0'>
// 								We are now live with our first store with apparel and
// 								accessories for men and women. Come and check it out!
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 			</Slider>
// 		</Modal>
// 	);
// };

// export default Popup;
