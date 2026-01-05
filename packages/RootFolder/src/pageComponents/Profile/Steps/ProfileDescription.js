import React, { useMemo } from "react";
import { Input, Typography, Row, Col, Button, Select } from "antd";

import {
	is_store_instance,
	current_store_name,
} from "../../../constants/config";
import {
	CURRENCY_INR,
	CURRENCY_USD,
	ONLINE_SELLING_PLATFORM_SHOPIFY,
	ONLINE_SELLING_PLATFORM_WOO_COMMERCE,
} from "../../../constants/codes";

const { Title } = Typography;
const { Option } = Select;

const ProfileDescription = ({
	nextStep,
	prevStep,
	sellerDetails,
	handleChange,
	isSaving,
}) => {
	let platforms = [
		{
			key: ONLINE_SELLING_PLATFORM_SHOPIFY,
			title: "Shopify",
			value: ONLINE_SELLING_PLATFORM_SHOPIFY,
		},
	];

	let currency = [CURRENCY_USD, CURRENCY_INR];

	const store = useMemo(
		() => is_store_instance && current_store_name,
		[is_store_instance, current_store_name]
	);

	if (store) {
		platforms = [
			...platforms,
			{
				key: store,
				title: "Contact seller",
				value: store,
			},
		];
	}
	const handleDataChange = (e) => {
		const { name, value } = e.target;
		handleChange(name, value);
	};

	return (
		<div className='profile-detail-container xl:px-44 lg:px-28'>
			<Row justify='space-between'>
				<Col span={24} className='flex justify-between'>
					<Button type='primary' onClick={prevStep}>
						Back
					</Button>
					<Button
						className='loading-button'
						type='primary'
						onClick={nextStep}
						loading={isSaving}>
						Continue
					</Button>
				</Col>
			</Row>
			{/* <Title className='text-white text-center my-7' level={4}>
				Connect your content
			</Title>
			<Row gutter={[20, 20]} className='mt-6'>
				<Col xs={24}>
					<label>Blog Url</label>
					<Input
						name='blogUrl'
						className='bg-transparent mt-1'
						placeholder='Enter blog URL'
						value={sellerDetails.blogUrl}
						onChange={handleDataChange}
					/>
				</Col>
				<Col xs={24}>
					<label>Video Url</label>
					<Input
						name='videoUrl'
						className='bg-transparent mt-1'
						placeholder='Enter video URL'
						value={sellerDetails.videoUrl}
						onChange={handleDataChange}
					/>
				</Col>
			</Row> */}

			<Title className='text-white text-center my-7' level={4}>
				Fulfillment options
			</Title>
			<Row gutter={[20, 20]} className='mt-6'>
				<Col span={24}>
					<label>Connect your online store</label>
					<Select
						className='w-full mt-2 text-base'
						placeholder='Select platform'
						value={sellerDetails.platform}
						onChange={(value) => handleChange("platform", value)}>
						{platforms.map((p) => (
							<Option key={p.key} value={p.value}>
								{p.title}
							</Option>
						))}
					</Select>
				</Col>
				{sellerDetails.platform === ONLINE_SELLING_PLATFORM_SHOPIFY ? (
					<Col xs={24}>
						<label>Shopify website Url</label>
						<Input
							name='vendor_url'
							className='bg-transparent mt-1'
							placeholder='Enter shopify website url'
							value={sellerDetails.vendor_url}
							onChange={handleDataChange}
						/>
					</Col>
				) : null}
				<Col xs={24}>
					<label>Currency</label>
					<Select
						className='w-full mt-2 text-base'
						placeholder='Select platform'
						value={sellerDetails.currency}
						onChange={(value) => handleChange("currency", value)}>
						{currency.map((value) => (
							<Option key={value}>{value}</Option>
						))}
					</Select>
				</Col>
			</Row>
			{sellerDetails.platform === store ? (
				<>
					<Title className='text-white text-center my-7' level={4}>
						Contact seller Details
					</Title>
					<Row gutter={[20, 20]} className='mt-6'>
						<Col xs={24}>
							<label>Contact title</label>
							<Input
								name='title'
								className='bg-transparent mt-1'
								placeholder='Enter contact title'
								value={sellerDetails.title}
								onChange={handleDataChange}
							/>
						</Col>
						<Col xs={24}>
							<label>Email Id</label>
							<Input
								name='email'
								className='bg-transparent mt-1'
								placeholder='Enter email id'
								value={sellerDetails.email}
								onChange={handleDataChange}
							/>
						</Col>
						<Col xs={24}>
							<label>Contact No.</label>
							<Input
								name='contact'
								className='bg-transparent mt-1'
								placeholder='Enter contact number'
								value={sellerDetails.contact}
								onChange={handleDataChange}
							/>
						</Col>
					</Row>

					<Title className='text-white text-center my-7' level={4}>
						Coupon info
					</Title>
					<Row gutter={[20, 20]} className='mt-6'>
						<Col xs={24}>
							<label>Coupon code</label>
							<Input
								name='couponCode'
								className='bg-transparent mt-1'
								placeholder='Enter coupon code'
								value={sellerDetails.couponCode}
								onChange={handleDataChange}
							/>
						</Col>
						<Col xs={24}>
							<label>Coupon info.</label>
							<Input
								name='info'
								className='bg-transparent mt-1'
								placeholder='Enter coupon info'
								value={sellerDetails.info}
								onChange={handleDataChange}
							/>
						</Col>
					</Row>

					<Title className='text-white text-center my-7' level={4}>
						Payment info
					</Title>
					<Row gutter={[20, 20]} className='mt-6'>
						<Col xs={24}>
							<label>Payment link (comma-separated links)</label>
							<Input
								name='paymentMethod'
								className='bg-transparent mt-1'
								placeholder='Enter payment links (comma-separated)'
								value={sellerDetails.paymentMethod}
								onChange={handleDataChange}
							/>
						</Col>
						<Col xs={24}>
							<label>Payment Details</label>
							<Input
								name='paymentDetails'
								className='bg-transparent mt-1'
								placeholder='Enter payment details'
								value={sellerDetails.paymentDetails}
								onChange={handleDataChange}
							/>
						</Col>
					</Row>

					<Title className='text-white text-center my-7' level={4}>
						Shipping info
					</Title>
					<Row gutter={[20, 20]} className='mt-6'>
						<Col xs={24}>
							<label>Shipping Details</label>
							<Input
								name='shippingDetails'
								className='bg-transparent mt-1'
								placeholder='Enter shipping details'
								value={sellerDetails.shippingDetails}
								onChange={handleDataChange}
							/>
						</Col>
					</Row>
				</>
			) : null}
			<div className='text-center text-secondary underline text-lg cursor-pointer mt-3'>
				<span onClick={nextStep}>Continue</span>
			</div>
		</div>
	);
};

export default ProfileDescription;
