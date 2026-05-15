import React, { useMemo, useEffect } from "react";
import { Select, Input, Checkbox, Button } from "antd";
import { isValidNumber } from "../../helper/utils";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AdditionalAttributes = ({
	additionalAttributesToShow,
	attributesDataTags,
	attributesData,
	handleAdditionalAttributesChange,
	handleFiltersOptionalChange,
	isShowOptional = true,
	selectBoxSize = "large",
	fontColorTheme = "text-gray-103",
	fontSizeTheme = "text-base",
	setProductData,
	productData,
	collectionValue,
	isModalOpen,
	gridClassName,
}) => {
	const hashtagAttr = useMemo(() => {
		return additionalAttributesToShow?.find((attr) => attr.key === "custom_filter");
	}, [additionalAttributesToShow]);

	const otherAttributes = useMemo(() => {
		return additionalAttributesToShow?.filter((attr) => attr.key !== "custom_filter");
	}, [additionalAttributesToShow]);

	const handlePriceChange = (name, value) => {
		if (isValidNumber(value) || value === "") {
			handleAdditionalAttributesChange("price", {
				...attributesData?.price,
				[name]: value ? parseInt(value) : undefined,
			});
		}
	};

 

	// ✅ Sync attributesDataTags → productData.additionalAttributes.custom_filter
	useEffect(() => {
		if (attributesDataTags?.length) {
			setProductData((prev) => ({
				...prev,
				additionalAttributes: {
					...prev.additionalAttributes,
					custom_filter: attributesDataTags,
				},
			}));
		}
	}, [attributesDataTags, setProductData]);

	useEffect(() => {
		if (attributesDataTags?.length) {
			setProductData((prev) => ({
				...prev,
				additionalAttributes: {
					...prev.additionalAttributes,
					// collection_type: [collectionValue],
				},
			}));
		}
	}, [collectionValue]);

	// console.log("productData?.additionalAttributes", attributesData);

	// ✅ Always use productData.additionalAttributes.custom_filter
	const savedCustomFilter = useMemo(() => {
		const customFilter =
			productData?.additionalAttributes?.custom_filter ||
			attributesData?.custom_filter;
		if (Array.isArray(customFilter)) return customFilter;
		if (typeof customFilter === "string") {
			return customFilter.split(",").map((s) => s.trim());
		}
		return [];
	}, [productData?.additionalAttributes?.custom_filter, attributesData]);

	// console.log("savedCustomFilter", savedCustomFilter);

	// useEffect(() => {
	// 	if (productData) {
	// 		setProductData((prev) => ({
	// 			...prev,
	// 			collection_type: [...(prev.collection_type || []),collectionValue],
	// 		}));
	// 		console.log("productDatachangeds", productData);
	// 	}
	// }, [collectionValue,isModalOpen]);

	return (
		<>
			{hashtagAttr && (
				<div className="w-full mb-4">
					<div className='flex justify-between'>
						<label
							className={`block ${fontColorTheme} ${fontSizeTheme} capitalize mb-1`}>
							{hashtagAttr.label}
						</label>
					</div>
					<div className="relative">
						<Select
							mode="tags"
							open={false}
							suffixIcon={null}
							showSearch
							className={`w-full product-filters-select-input ${fontSizeTheme}`}
							placeholder={`Enter ${hashtagAttr.key}`}
							value={savedCustomFilter}
							size={selectBoxSize}
							onChange={(values) =>
								handleAdditionalAttributesChange(hashtagAttr.key, values)
							}
						/>
						<Button
							type="text"
							className="no-effect-btn absolute top-1/2 -translate-y-1/2 right-0 opacity-35 text-black"
							icon={<PlusOutlined />}
						/>
					</div>
				</div>
			)}
			<div className={`grid gap-3 ${gridClassName || 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3'}`}>
				{otherAttributes.map((attr) => {
					return (
						<React.Fragment key={attr.key}>
							{attr.input_type === "single_select" ? (
								<div>
									<div className='flex justify-between'>
										<label
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize mb-1`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Mandatory
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={!attributesData?.optional_filters?.includes(
														attr.key
													)}></Checkbox>
											</div>
										) : null}
									</div>
									<Select
										name={attr.key}
										className={`w-full product-filters-select-single-input ${fontSizeTheme}`}
										placeholder={`Select ${attr.key}`}
										value={(attributesData && attributesData[attr.key]) ?? []}
										size={selectBoxSize}
										onChange={(values) =>
											handleAdditionalAttributesChange(attr.key, values)
										}>
										{attr?.display_value?.map((a) => (
											<Option key={a} value={a}>
												{a}
											</Option>
										))}
									</Select>
								</div>
							) : null}

							{attr.input_type === "multi_select" ? (
								<div>
									<div className='flex justify-between'>
										<label
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize mb-1`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Mandatory
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={!attributesData?.optional_filters?.includes(
														attr.key
													)}></Checkbox>
											</div>
										) : null}
									</div>
									<Select
										mode='multiple'
										name={attr.key}
										className={`w-full product-filters-select-input ${fontSizeTheme}`}
										placeholder={`Select ${attr.key}`}
										value={(attributesData && attributesData[attr.key]) ?? []}
										size={selectBoxSize}
										onChange={(values) =>
											handleAdditionalAttributesChange(attr.key, values)
										}>
										{attr?.display_value?.map((a) => (
											<Option key={a} value={a}>
												{a}
											</Option>
										))}
									</Select>
								</div>
							) : null}

							{attr.input_type === "multi_custom_input" ? (

								<div>
									<div className='flex justify-between'>
										<label
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize mb-1`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Mandatory
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={!attributesData?.optional_filters?.includes(
														attr.key
													)}></Checkbox>
											</div>
										) : null}
									</div>
									<div className="relative">

									<Select
										mode="tags"
										open={false}
										suffixIcon={null}
										showSearch
										className={`w-full product-filters-select-input ${fontSizeTheme}`}
										placeholder={`Enter ${attr.key}`}
										value={
											(attributesData && attributesData[attr.key]) ?? []
										}
										size={selectBoxSize}
										onChange={(values) =>
											handleAdditionalAttributesChange(attr.key, values)
										}
									/>
  <Button
  type="text"
  className="no-effect-btn absolute top-1/2 -translate-y-1/2 right-0 opacity-35 text-black"
  icon={<PlusOutlined />}
/>
									</div>

									
								</div>
							) : null}

							{attr.input_type === "custom_input" ? (
								<div>
									<div className='flex justify-between'>
										<label
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize mb-1`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Mandatory
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={!attributesData?.optional_filters?.includes(
														attr.key
													)}></Checkbox>
											</div>
										) : null}
									</div>
									<input
										className='text-left placeholder-gray-101 outline-none px-3 h-8 rounded-xl bg-white border-none w-full    '
										placeholder={`Enter ${attr.key}`}
										name={attr.key}
										type='text'
										value={(attributesData && attributesData[attr.key]) ?? []}
										size={selectBoxSize}
										onChange={(e) =>
											handleAdditionalAttributesChange(attr.key, e.target.value)
										}
									/>
								</div>
							) : null}

							{attr.input_type === "price_range" ? (
								<div>
									<div className='flex justify-between'>
										<label className={`${fontSizeTheme} block ${fontColorTheme} mb-1`}>
											Price range
										</label>
										<div className='flex items-center'>
											<label className={`mr-1 block ${fontColorTheme}`}>
												Mandatory
											</label>
											<Checkbox
												className='text-gray-103'
												onChange={() => handleFiltersOptionalChange("price")}
												checked={!attributesData?.optional_filters?.includes(
													"price"
												)}></Checkbox>
										</div>
									</div>
									<div className='flex flex-row'>
										<Input
											type='text'
											className='outline-none px-3 h-8 rounded-xl w-full text-sm'
											placeholder='Minimum'
											value={attributesData?.price?.min || ""}
											onChange={(e) => handlePriceChange("min", e.target.value)}
											name='priceRange-min'
										/>
										<span
											className={`flex justify-center items-center text-sm mx-2 ${fontColorTheme}`}>
											to
										</span>
										<Input
											type='text'
											className='outline-none px-3 h-8 rounded-xl w-full text-sm'
											placeholder='Maximum'
											value={attributesData?.price?.max || ""}
											onChange={(e) => handlePriceChange("max", e.target.value)}
											name='priceRange-max'
										/>
									</div>
								</div>
							) : null}
						</React.Fragment>
					);
				})}
			</div>
		</>
	);
};

export default AdditionalAttributes;