import React from "react";
import { Row, Col, Button, Select } from "antd";
import { templatesLabelToShow } from "../../../constants/codes";

const { Option } = Select;

const ProfileAdditionalBrands = ({
	nextStep,
	prevStep,
	profileData,
	handleChange,
	isSaving,
	templatesKey,
	updatedTemplates,
	handleTemplatesChange,
	isAdminLoggedIn,
}) => {
	const handleWishlist_brandsChange = (value) => {
		if (!profileData.brands.includes(value[value.length - 1])) {
			handleChange("wishlist_brands", value);
		}
	};

	return (
		<div className='additional-brands-wrapper'>
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
			{/* <Row className='block mt-5'>
				<Col span={24}>
					<span className='text-white text-base'>
						Would you like us to sign up any other brands that you did not find
						in the list?
					</span>
					<h1 className='text-white font-normal m-0 text-sm'>
						Enter the URLs separated by space or commas
					</h1>
					<Select
						mode='tags'
						className='w-full bg-transparent mt-2 text-base'
						placeholder='Enter brands name'
						value={profileData.wishlist_brands}
						onChange={handleWishlist_brandsChange}>
						{profileData.wishlist_brands.map((brand) => (
							<Option key={brand}>{brand}</Option>
						))}
					</Select>
				</Col>
			</Row> */}
			{isAdminLoggedIn ? (
				<Row className='mt-5'>
					<Col span={24} className='border-4 border-red-500'>
						<p className='text-white text-xl font-semibold m-4'>
							Final Templates{" "}
							<span className='text-lg text-red-300'>
								(Don't edit until you are sure. It's not for trial and test.)
							</span>
						</p>
						<div className='grid grid-cols-1 gap-4 justify-center bg-slate-200 px-4 py-4'>
							<div className='grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4'>
								{templatesKey.map((key) => (
									<div key={key}>
										<label className='text-base flex h-14'>
											<b>{templatesLabelToShow?.[key] || key}</b>
										</label>
										<textarea
											name={key}
											rows={15}
											className='w-full rounded-lg px-1'
											placeholder='Type two lines here for Description template'
											value={updatedTemplates?.[key]}
											onChange={handleTemplatesChange}
										/>
									</div>
								))}
							</div>
						</div>
					</Col>
				</Row>
			) : null}

			<div className='text-center text-secondary underline text-lg cursor-pointer mt-3'>
				<span onClick={nextStep}>Skip and continue</span>
			</div>
		</div>
	);
};

export default ProfileAdditionalBrands;
