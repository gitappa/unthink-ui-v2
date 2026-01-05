import React, { useMemo, useEffect } from "react";
import { Select, Input, Checkbox } from "antd";
import { isValidNumber } from "../../helper/utils";

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
}) => {
	const handlePriceChange = (name, value) => {
		if (isValidNumber(value) || value === "") {
			handleAdditionalAttributesChange("price", {
				...attributesData?.price,
				[name]: value ? parseInt(value) : undefined,
			});
		}
	};

	console.log("additionalAttributesToShow", additionalAttributesToShow);
	console.log("attributesData", attributesData);
	console.log("attributesDataTags", attributesDataTags);
	console.log("productDatasss", productData);
	console.log("collectionValue", collectionValue);

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

	console.log("productData?.additionalAttributes", attributesData);

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

	console.log("savedCustomFilter", savedCustomFilter);

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
			<div className='grid grid-cols-1 tablet:grid-cols-2 2xl:grid-cols-3 gap-3'>
				{additionalAttributesToShow.map((attr) => {
					return (
						<React.Fragment key={attr.key}>
							{attr.input_type === "single_select" ? (
								<div>
									<div className='flex justify-between'>
										<label
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={attributesData?.optional_filters?.includes(
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
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={attributesData?.optional_filters?.includes(
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

							{attr.input_type === "multi_custom_input" ||
							attr.key === "custom_filter" ? (
								 
								<div>
									<div className='flex justify-between'>
										<label
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={attributesData?.optional_filters?.includes(
														attr.key
													)}></Checkbox>
											</div>
										) : null}
									</div>
									<Select
										mode='tags'
										className={`w-full product-filters-select-input ${fontSizeTheme}`}
										placeholder={`Enter ${attr.key}`}
										value={
											attr.key === "custom_filter"
												? savedCustomFilter
												: (attributesData && attributesData[attr.key]) ?? []
										}
										size={selectBoxSize}
										onChange={(values) =>
											handleAdditionalAttributesChange(attr.key, values)
										}
										dropdownStyle={{ display: "none" }}></Select>
								</div>
							) : null}

							{attr.input_type === "custom_input" ? (
								<div>
									<div className='flex justify-between'>
										<label
											className={`block ${fontColorTheme} ${fontSizeTheme} capitalize`}>
											{attr.label}
										</label>
										{isShowOptional ? (
											<div className='flex items-center'>
												<label className={`mr-1 block ${fontColorTheme}`}>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() => handleFiltersOptionalChange(attr.key)}
													checked={attributesData?.optional_filters?.includes(
														attr.key
													)}></Checkbox>
											</div>
										) : null}
									</div>
									<input
										className='text-left placeholder-gray-101 outline-none px-3 h-8 rounded-xl w-full border border-solid border-gray-107'
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
										<label className={`text-base block ${fontColorTheme}`}>
											Price range
										</label>
										<div className='flex items-center'>
											<label className={`mr-1 block ${fontColorTheme}`}>
												Optional
											</label>
											<Checkbox
												className='text-gray-103'
												onChange={() => handleFiltersOptionalChange("price")}
												checked={attributesData?.optional_filters?.includes(
													"price"
												)}></Checkbox>
										</div>
									</div>
									<div className='flex flex-row'>
										<Input
											type='text'
											className='outline-none px-3 h-10 rounded-xl w-full'
											placeholder='Minimum'
											value={attributesData?.price?.min || ""}
											onChange={(e) => handlePriceChange("min", e.target.value)}
											name='priceRange-min'
										/>
										<span
											className={`flex justify-center items-center text-base mx-5 ${fontColorTheme}`}>
											to
										</span>
										<Input
											type='text'
											className='outline-none px-3 h-10 rounded-xl w-full'
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
