import React, { useEffect, useState } from "react";
import { Row, Col, Button, Checkbox, Typography } from "antd";

import SelectBrands from "./SelectBrands";
import styles from "./ProfileFavoriteBrands.module.scss";

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
			<Row justify='space-between' className={styles['headerRow']}>
				<Col span={24} className={styles['buttonCol']}>
					<Button type='primary' onClick={onContinue}>
						Continue
					</Button>
				</Col>
			</Row>
			<Title className={styles['title']} level={4} style={{color:"white"}}>
				Pick the brands that you would like to choose products from
			</Title>
			<div className={styles['selectAllWrapper']}>
				<Checkbox
					className={styles['selectAllCheckbox']}
					onChange={selectAllChange}
					checked={allSelected}>
					Select all
				</Checkbox>
			</div>
			<div className={styles['errorContainer']}>
				{hasError && (
					<p className={styles['errorText']}>Please select at-least one brand</p>
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
