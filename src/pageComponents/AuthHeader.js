import React from "react";
import Link from 'next/link';
import { useNavigate } from "../helper/useNavigate";
import { Image, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import Logo from "../images/staticpageimages/logo_white.png";
import HeaderUser from "../images/staticpageimages/auth_header_user.svg";
import { is_store_instance, current_store_name } from "../constants/config";
import { PATH_ROOT, PATH_STORE, MY_PROFILE, PROFILE } from "../constants/codes";

export default function AuthHeader({
	userTextLink,
	hideProfile,
	showBackToStore,
}) {
	const navigate = useNavigate();
	return (
		<Row className='bg-blue-105 bg-opacity-80 items-center h-full mb-3 pt-3'>
			<Col md={8} span={24} className='mt-3 md:mt-0'>
				{showBackToStore && (
					<HomeOutlined
						className='text-white text-2xl ml-6 lg:ml-14 cursor-pointer'
						onClick={() => navigate(is_store_instance ? PATH_ROOT : PATH_STORE)}
					/>
				)}
			</Col>
			<Col md={8} span={24} className='flex justify-center items-center mt-3'>
				{is_store_instance && current_store_name !== "unthink_ai" && (
					<span className='text-white'>Powered By</span>
				)}
				<Link href='/' className='flex'>
					<Image
						src={Logo?.src || Logo}
						preview={false}
						height={22}
						className='cursor-pointer pl-2'
					/>
				</Link>
			</Col>
			{!hideProfile && (
				<Col
					md={8}
					span={24}
					className='flex justify-end items-center pr-5 lg:pr-14 mt-3'>
					{userTextLink && userTextLink.to && (
						<>
							{MY_PROFILE && (
								<Link className='text-white' href={MY_PROFILE}>
									{userTextLink.text}
								</Link>
							)}

							{PROFILE && (
								<Link className='text-white' href={PROFILE}>
									{userTextLink.text}
								</Link>
							)}
						</>
					)}
					<Image src={HeaderUser?.src || HeaderUser} preview={false} height={33} />
				</Col>
			)}
		</Row>
	);
}
