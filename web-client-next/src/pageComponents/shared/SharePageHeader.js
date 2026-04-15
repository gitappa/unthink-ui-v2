import React from "react";
import { Image } from "antd";
import { useRouter } from 'next/router';

import Logo from "../../images/staticpageimages/logo.png";

const SharePageHeader = () => {
	const router = useRouter();
	const navigate = (path) => router.push(path);
	return (
		<div className='container m-auto pt-4 md:px-0 px-4 flex'>
			<div className='grid md:grid-cols-3 grid-cols-1 w-full items-end'>
				<div className='md:block hidden'></div>
				<div className='self-center'>
					<div
						className='md:flex hidden justify-center'
						onClick={() => navigate("/store/")}>
						<Image
							src={Logo}
							preview={false}
							height={28}
							className='cursor-pointer'
						/>
					</div>
					<div className='md:hidden flex justify-center'>
						<Image
							src={Logo}
							preview={false}
							width={120}
							className='cursor-pointer'
						/>
					</div>
				</div>

				<div className='md:flex justify-end hidden'>
					<a
						className='unthink-share-collection__more-products-btn bg-primary border-primary'
						onClick={() => navigate("/store/")}>
						More Products
					</a>
				</div>
			</div>
		</div>
	);
};

export default SharePageHeader;
