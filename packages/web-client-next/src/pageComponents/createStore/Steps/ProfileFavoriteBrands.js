import React, { useEffect, useState } from "react";
import { Row, Col, Button, Checkbox, Typography } from "antd";

import SelectBrands from "./SelectBrands";

const { Title } = Typography;

const ProfileFavoriteBrands = ({
	nextStep,
	prevStep,
	brandList,
	profileData,
	handleChange,
}) => {
	const [hasError, setHasError] = useState(false);
	const [allSelected, setAllSelected] = useState(false);

	const handleBrandsChange = (brands) => {
		setHasError(false);
		handleChange("brands", brands);
	};

	const onContinue = () => {
		if (profileData.brands.length) {
			nextStep();
		} else {
			setHasError(true);
		}
	};

	const selectAllChange = (e) => {
		const { checked } = e.target;
		setAllSelected(checked);
		if (checked) {
			const allBrands = brandList.map((brand) => brand.brand);
			handleChange("brands", allBrands);
			setHasError(false);
		} else {
			handleChange("brands", []);
		}
	};

	useEffect(() => {
		if (brandList.length === profileData.brands.length) {
			setAllSelected(true);
		} else {
			setAllSelected(false);
		}
	}, [profileData.brands]);

	return (
		<div>
			<Row justify='space-between' className='xl:px-44 lg:px-28'>
				<Col span={24} className='flex justify-end'>
					<Button type='primary' onClick={onContinue}>
						Continue
					</Button>
				</Col>
			</Row>
			<Title className='text-white text-center my-7' level={4}>
				Pick the brands that you would like to choose products from
			</Title>
			<div className='flex justify-between pt-3'>
				<Checkbox
					className='text-white text-base'
					onChange={selectAllChange}
					checked={allSelected}>
					Select all
				</Checkbox>
			</div>
			<div className='h-6 mb-2 mt-1'>
				{hasError && (
					<p className='text-red-500 m-0'>Please select at-least one brand</p>
				)}
			</div>
			<SelectBrands
				brandList={brandList}
				selectedBrands={profileData.brands}
				handleBrandsChange={handleBrandsChange}
			/>
		</div>
	);
};

export default ProfileFavoriteBrands;
