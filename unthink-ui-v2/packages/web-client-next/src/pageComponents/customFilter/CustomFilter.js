import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Select } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import { isEmpty } from "../../helper/utils";

export const CustomFilter = ({
	handleSaveEditCustomFilter,
	customFilterStringData = "",
	hashtagsThemeClassName = "text-gray-103",
	customFilter,
	setCustomFilter,
	handleCustomFilterChange,
	isButtonVisible = true,
	isCustomFilterInputVisible = false, // flag for show select box always
	showCustomFilterInput,
	setShowCustomFilterInput,
	checkAndShowContainer,
}) => {
	const [storeData] = useSelector((state) => [state.store.data]);

	const { catalog_attributes = [] } = storeData;

	const savedCustomFilter = useMemo(
		() => (customFilterStringData ? customFilterStringData?.split(",") : []),
		[customFilterStringData]
	);

	const customFilterStoreData = useMemo(
		() => catalog_attributes?.find((c) => c.key === "custom_filter"),
		[catalog_attributes]
	);

	useEffect(() => {
		setCustomFilter(savedCustomFilter);
	}, [customFilterStringData]);

	const closeCustomFilterInput = () => {
		setShowCustomFilterInput(false);
	};

	const handleGoClick = () => {
		closeCustomFilterInput();
		handleSaveEditCustomFilter(customFilter);
	};

	const handleCancelClick = () => {
		closeCustomFilterInput();
		setCustomFilter(savedCustomFilter);
	};

	const handleDeleteCustomFilterClick = (e, hashtag) => {
		e.stopPropagation();

		if (hashtag) {
			const newCustomFilter =
				customFilter?.filter((h) => !hashtag.includes(h)) || [];
			setCustomFilter(newCustomFilter);
			handleSaveEditCustomFilter(newCustomFilter);
		}
	};

	return (
		<>
			<div className='flex flex-col justify-center w-full'>
				<div className='flex flex-row gap-2'>
					{showCustomFilterInput || isCustomFilterInputVisible ? (
						<>
							<label
								className={`font-medium items-center text-base capitalize whitespace-nowrap leading-38 ${hashtagsThemeClassName}`}>
								{customFilterStoreData.label} :
							</label>
							<div className='flex flex-col gap-2 w-full'>
								<Select
									mode='tags'
									className='w-full text-base tag-select-input'
									placeholder={`Enter hashtags`}
									value={customFilter}
									onChange={(value) => handleCustomFilterChange(value)}
									size='large'
									dropdownStyle={{ display: "none" }}
								/>
								{isButtonVisible ? (
									<div className='flex flex-col-reverse md:flex-row gap-2 justify-between'>
										<div className='flex gap-2 ml-auto md:ml-0'>
											<button
												onClick={handleGoClick}
												className={`py-0 px-3 text-white rounded-lg h-6 cursor-pointer bg-indigo-600`}
												title='Click to apply'>
												Go
											</button>
											<button
												onClick={handleCancelClick}
												className='py-0 px-3 text-white rounded-lg h-6 bg-indigo-600'>
												Cancel
											</button>
										</div>
									</div>
								) : null}
							</div>
						</>
					) : (
						<div className='flex flex-wrap gap-3 overflow-auto'>
							<div>
								<label
									className={`font-medium items-center text-base capitalize whitespace-nowrap ${hashtagsThemeClassName}`}>
									{customFilterStoreData.label} :
								</label>
							</div>
							{!isEmpty(customFilter) ? (
								<>
									{customFilter.map((hashtag) => (
										<div
											key={hashtag}
											className={`flex items-center rounded-full shadow
											 px-2 py-0.75 sm:px-3 w-max bg-slate-200`}
											role='button'>
											<span
												level={5}
												className={`m-0 font-normal text-xs md:text-sm text-black-102`}>
												#{hashtag}
											</span>
											<button
												type='button'
												onClick={(e) =>
													handleDeleteCustomFilterClick(e, [hashtag])
												}>
												<CloseOutlined className='flex pl-2' />
											</button>
										</div>
									))}
								</>
							) : null}
							<div
								className='flex justify-center items-center cursor-pointer'
								title={`Add or remove hashtags`}>
								<PlusOutlined
									className={`text-base flex justify-center items-center stroke-current stroke-13 ${hashtagsThemeClassName}`}
									onClick={() => {
										checkAndShowContainer({ isShowCustomFilterInput: true });
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};
