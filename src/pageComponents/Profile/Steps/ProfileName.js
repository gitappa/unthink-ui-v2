import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
	Input,
	Upload,
	Row,
	Col,
	Typography,
	Button,
	Spin,
	notification,
	Select,
} from "antd";
import {
	UserOutlined,
	LoadingOutlined,
	PictureOutlined,
} from "@ant-design/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";

import facebookIcon from "../../../images/staticpageimages/facebookIcon.png";
import instagramIcon from "../../../images/staticpageimages/instagramIcon.png";
import { profileAPIs } from "../../../helper/serverAPIs";
import { AdminCheck, getFinalImageUrl } from "../../../helper/utils";
import {
	// COLLECTION_COVER_IMG_SIZES,
	PROFILE_COVER_IMG_SIZES,
} from "../../../constants/codes";
import {
	adminUserId,
	current_store_name,
	super_admin,
} from "../../../constants/config";

const { Title } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;

const ProfileName = ({
	profileData,
	sellerDetails,
	handleChange,
	handleSellerDetailsChange,
	user,
	isSellerLoggedIn,
	error,
	onContinue,
	admin_list,
	isCreaterAccount
}) => {
	const [isUploading, setIsUploading] = useState({
		profile_image: false,
		cover_image: false,
	});

	console.log("sellerDetails", sellerDetails);

	//to store previous image on image change so can show previous image on cancel
	const [savedImages, setSavedImages] = useState({
		cover_image: "",
		profile_image: "",
	});

	useEffect(() => {
		setSavedImages({
			cover_image: user?.cover_image,
			profile_image: user?.profile_image,
		});
	}, [user?.cover_image, user?.profile_image]);

	useEffect(() => {
		const errorTextElement = document.querySelector(".error-text");
		if (errorTextElement) {
			errorTextElement.scrollIntoView({ block: "center" });
		}
	}, [error]);

	const uploadProps = {
		accept: "image/*",
		multiple: false,
		customRequest: async (info) => {
			try {
				setIsUploading((currentValue) => ({
					...currentValue,
					[info.filename]: true,
				}));
				if (info?.file) {
					const response = await profileAPIs.uploadImage({
						file: info.file,
						custom_size: PROFILE_COVER_IMG_SIZES,
					});
					if (response?.data?.data) {
						if (response.data.data[0]) {
							handleChange(
								info?.filename,
								// response.data.data[0]?.other_dimensions?.[
								// 	PROFILE_COVER_IMG_SIZES
								// ]?.[0]?.url ||
								response.data.data[0]?.url
							);
							setSavedImages((currentValue) => ({
								...currentValue,
								[info.filename]: response?.data?.data[0].url,
							}));
						}
					}
				}
			} catch (error) {
				notification["error"]({
					message: "Failed to upload image",
				});
			}
			setIsUploading((currentValue) => ({
				...currentValue,
				[info.filename]: false,
			}));
		},
	};

	const handleDataChange = (e) => {
		const { name, value } = e.target;
		handleChange(name, value);
	};

	const handleSellerDataChange = (e) => {
		const { name, value } = e.target;
		handleSellerDetailsChange(name, value);
	};

	const onCoverImageCancel = (e) => {
		e.stopPropagation();
		handleChange("cover_image", savedImages.cover_image);
	};

	const onProfileImageCancel = (e) => {
		e.stopPropagation();
		handleChange("profile_image", savedImages.profile_image);
	};

	const isUploadingImg = isUploading.profile_image || isUploading.cover_image;

	const isAdminLoggedIn = AdminCheck(user, current_store_name, adminUserId, admin_list);

	console.log(isAdminLoggedIn);

	const isStoreAdminLoggedIn = useMemo(
		() => user.user_name && user.user_name === super_admin,
		[user.user_name]
	);

	const showCoverImage = useMemo(
		() =>
			(isStoreAdminLoggedIn) ||
			isAdminLoggedIn ||
			isSellerLoggedIn || isCreaterAccount,
		[isStoreAdminLoggedIn, isAdminLoggedIn, isSellerLoggedIn, isCreaterAccount]
	);

	return (
		<div className='profile-detail-container xl:px-44 lg:px-28'>
			<Row>
				<Col span={24} className='flex justify-end'>
					<Button
						type='primary'
						className={isUploadingImg && "text-blue-105 bg-blue-107"}
						onClick={onContinue}
						disabled={isUploadingImg}>
						Continue
					</Button>
				</Col>
			</Row>

			{isSellerLoggedIn || isCreaterAccount || isAdminLoggedIn ? (
				<>
					<Title className='text-white text-center my-7' level={4}>
						Your Brand Details
					</Title>
					<Row gutter={[20, 20]}>
						<Col xs={24}>
							<Input
								name='brandName'
								className='bg-transparent mt-1 text-white'
								placeholder='Enter brand name'
								value={sellerDetails.brandName}
								onChange={handleSellerDataChange}
							/>
							{error.brand_name && (
								<div className='h-3 error-text'>
									<span className='text-red-500'>{error.brand_name}</span>
								</div>
							)}
						</Col>
						<Col span={24}>
							<TextArea
								name='description'
								className='bg-transparent text-white'
								rows={6}
								placeholder='Enter brand description'
								value={profileData.description}
								onChange={handleDataChange}
							/>
						</Col>
						<Col span={24}>
							<Select
								name="currency"
								className="bg-transparent mt-1 w-full text-white"
								placeholder="Select Currency"
								value={sellerDetails.currency}
								onChange={(value) => handleSellerDetailsChange("currency", value)}
							>
								<Option value="INR">INR</Option>
								<Option value="USD">USD</Option>
							</Select>
							{error.currency && (
								<div className="h-3 error-text">
									<span className="text-red-500">{error.currency}</span>
								</div>
							)}
						</Col>
					</Row>
				</>
			) : (
				<>
					<Title className='text-white text-center my-7' level={3}>
						Your Profile Details
					</Title>
					<Row gutter={[20, 20]} className='mt-6'>
						<Col xs={24} md={12}>
							<Input
								name='first_name'
								className='bg-transparent'
								placeholder='Enter your first name'
								value={profileData.first_name}
								onChange={handleDataChange}
							/>
							<div className='h-3'>
								{error.first_name && (
									<span className='text-red-500 error-text'>
										{error.first_name}
									</span>
								)}
							</div>
						</Col>
						<Col xs={24} md={12}>
							<Input
								name='last_name'
								className='bg-transparent'
								placeholder='Enter your last name'
								value={profileData.last_name}
								onChange={handleDataChange}
							/>
						</Col>
					</Row>
				</>
			)}

			{/* for admin only cover image from edit profile and profile page */}
			{showCoverImage ? (
				<Row className='block mt-6'>
					<Col span={24}>
						{isUploading.cover_image && (
							<div className='h-24 md:h-32 flex items-center justify-center'>
								<Spin
									className='w-full mx-auto'
									indicator={
										<LoadingOutlined
											style={{ fontSize: 30 }}
											className='text-blue-700'
											spin
										/>
									}
									spinning={isUploading.cover_image}
								/>
							</div>
						)}
						{!isUploading.cover_image &&
							(profileData.cover_image ? (
								<div className='flex flex-col items-center justify-center'>
									<div className='w-full'>
										<LazyLoadImage
											src={profileData.cover_image}
											height='100%'
											width='100%'
											effect='blur'
											className='object-cover rounded-2xl'
											style={{ aspectRatio: "3.1/1" }}
										/>
									</div>
									<div className='text-center text-secondary underline text-lg cursor-pointer'>
										<span onClick={() => handleChange("cover_image", "")}>
											remove or change Cover
										</span>
									</div>
								</div>
							) : (
								<Dragger
									className='bg-transparent'
									{...uploadProps}
									name='cover_image'
									showUploadList={false}>
									<p className='ant-upload-drag-icon mb-3'>
										<PictureOutlined />
									</p>
									<p className='ant-upload-text text-white'>
										Click or drag a cover image to this area
									</p>
									<p className='ant-upload-text text-sm text-white'>
										(Recommended size : 1240 * 400)
									</p>
									{savedImages?.cover_image && (
										<p
											className='text-secondary underline max-w-max mx-auto'
											onClick={onCoverImageCancel}>
											Cancel
										</p>
									)}
								</Dragger>
							))}
					</Col>
				</Row>
			) : null}
			<Row className='mt-6'>
				<Col span={24}>
					{isUploading.profile_image && (
						<div className='h-36 flex items-center justify-center'>
							<Spin
								className='w-full mx-auto'
								indicator={
									<LoadingOutlined
										style={{ fontSize: 30 }}
										className='text-blue-700'
										spin
									/>
								}
								spinning={isUploading.profile_image}
							/>
						</div>
					)}
					{!isUploading.profile_image &&
						(profileData.profile_image ? (
							<div className='flex flex-col items-center justify-center'>
								<div className='max-w-s-1 w-120 lg:w-200 h-120 lg:h-200'>
									<LazyLoadImage
										src={getFinalImageUrl(profileData.profile_image)}
										height='100%'
										width='100%'
										effect='blur'
										className='object-cover rounded-xl max-w-s-1 w-120 lg:w-200 h-120 lg:h-200'
									/>
								</div>
								<div className='text-center text-secondary underline text-lg cursor-pointer'>
									<span onClick={() => handleChange("profile_image", "")}>
										remove or change Avatar
									</span>
								</div>
							</div>
						) : (
							<div className='flex flex-col items-center justify-center'>
								<Dragger
									className='bg-transparent h-40 w-56'
									{...uploadProps}
									name='profile_image'
									showUploadList={false}>
									<p className='ant-upload-drag-icon'>
										<UserOutlined />
									</p>
									<p className='w-4/6 mx-auto text-white'>
										Click or drag file to this area to upload Avatar
									</p>
									{savedImages?.profile_image && (
										<p
											className='text-secondary underline max-w-max mx-auto'
											onClick={onProfileImageCancel}>
											Cancel
										</p>
									)}
								</Dragger>
							</div>
						))}
				</Col>
			</Row>

			{isSellerLoggedIn || isCreaterAccount || isAdminLoggedIn ? (
				<>
					<Title className='text-white text-center my-7' level={4}>
						Social Media
					</Title>
					<Row gutter={[20, 20]} className='mt-6'>
						<Col xs={24}>
							<div className='flex items-center'>
								<Image src={instagramIcon} width={28} height={28} alt='Instagram' />
								<Input
									name='instagramUrl'
									className='bg-transparent ml-3 text-white'
									placeholder='Enter Instagram URL'
									value={sellerDetails.instagramUrl}
									onChange={handleSellerDataChange}
								/>
							</div>
							{error.instagramUrl && (
								<div className='h-3  ml-10 error-text'>
									<span className='text-red-500'>{error.instagramUrl}</span>
								</div>
							)}
						</Col>
						<Col xs={24}>
							<div className='flex items-center'>
								<Image src={facebookIcon} width={30} height={30} alt='Facebook' />
								<Input
									name='facebookUrl'
									className='bg-transparent ml-3 text-white'
									placeholder='Enter facebook URL'
									value={sellerDetails.facebookUrl}
									onChange={handleSellerDataChange}
								/>
							</div>
							{error.facebookUrl && (
								<div className='h-3  ml-10 error-text'>
									<span className='text-red-500'>{error.facebookUrl}</span>
								</div>
							)}
						</Col>
					</Row>
				</>
			) : (
				<>
					<Title className='text-white text-center my-7' level={4}>
						Write something about yourself
					</Title>
					<Row gutter={[20, 20]}>
						<Col span={24}>
							<TextArea
								name='description'
								className='bg-transparent mt-1'
								rows={6}
								placeholder='Enter description'
								value={profileData.description}
								onChange={handleDataChange}
							/>
						</Col>
					</Row>
				</>
			)}

			<div className='text-center text-secondary underline text-lg cursor-pointer mt-3'>
				<span onClick={onContinue}>Continue</span>
			</div>
		</div>
	);
};

export default ProfileName;
