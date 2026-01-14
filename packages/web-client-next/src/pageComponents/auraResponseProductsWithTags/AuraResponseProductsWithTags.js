// changes made
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import AuraResponseProducts from "./AuraResponseProducts";
import {
	setSuggestionsSelectedTag,
	removeSuggestionDataTag,
	setRecommendationSelectedTag,
	setMoreSearchSelectedTag,
} from "../../hooks/chat/redux/actions";

import styles from './chatSuggestionsWithProducts.module.scss';
import { isEmpty } from "../../helper/utils";

const AuraResponseProductsWithTags = ({
	enableClickFetchRec,
	enableClickTracking,
	trackCollectionCampCode,
	trackCollectionId,
	trackCollectionName,
	trackCollectionICode,
	chatTypeKey,
	widgetHeader,
	widgetImage,
	isAuraChatPage,
	handleLoadMore,
	localChatMessage

}) => {
	const [suggestionsWithProducts, recommendationsWithProducts, moreProducts] = useSelector((state) => [
		state.chatV2.suggestions,
		state.chatV2.recommendations,
		state.chatV2.moreProducts,
	]);


	const dispatch = useDispatch();

	const {
		suggestions: { tags = [], title = "" },
		products: suggestionsProducts,
		selectedTag,
		allProductList,
	} = suggestionsWithProducts;

	const {
		recommendations: { tags: RecTags = [], title: RecTitle = "" },
		products: recommendationsProducts,
		selectedTag: recommendationsSelectedTag,
		allProductList: recommendationsallProductList,
	} = recommendationsWithProducts;

	const {
		moreProducts: { tags: moreProductsTags = [], title: moreProductsTitle = "" },
		products: moreAuraProducts,
		selectedTag: moreProductsSelectedTag,
		allProductList: moreProductsallProductList,
	} = moreProducts;

	// // Select the first tag as default if no tag is selected and "All" is not selected
	useEffect(() => {
		if (tags.length === 1) {
			if (selectedTag === "" && !isEmpty(allProductList)) return; // Do nothing if "All" is selected
			if (!selectedTag && tags.length) {
				dispatch(setSuggestionsSelectedTag(tags[0])); // Set first tag as default
			}
		}
	}, [selectedTag, tags, dispatch, allProductList]);

	const tagToShow = useMemo(() => selectedTag, [selectedTag]);
	const recommendationsTagToShow = useMemo(() => recommendationsSelectedTag, [recommendationsSelectedTag]);
	const moreProductsTagToShow = useMemo(() => moreProductsSelectedTag, [moreProductsSelectedTag]);

	const productsToShow = useMemo(() => {
		// If "All" is selected, show all products
		return selectedTag
			? suggestionsProducts[tagToShow]
			: {
				product_lists: allProductList,
			};
	}, [suggestionsProducts[tagToShow], selectedTag, allProductList]);


	// for more products product show

	const moreProductToShow = useMemo(() => {
		// If "All" is selected, show all products
		return moreProductsSelectedTag
			? moreAuraProducts[moreProductsTagToShow]
			: {
				product_lists: moreProductsallProductList,
			};
	}, [moreAuraProducts[moreProductsTagToShow], moreProductsSelectedTag, moreProductsallProductList]);

	// for recommendations product show

	const recommendationsproductsToShow = useMemo(() => {
		// If "All" is selected, show all products
		return recommendationsSelectedTag
			? recommendationsProducts[recommendationsTagToShow]
			: {
				product_lists: recommendationsallProductList,
			};
	}, [recommendationsProducts[recommendationsTagToShow], recommendationsSelectedTag, recommendationsallProductList]);


	const tagsProductsFetched = useMemo(
		() => tags.filter((tag) => !!suggestionsProducts[tag]),
		[tags, JSON.stringify(suggestionsProducts)]
	);

	const RecomtagsProductsFetched = useMemo(
		() => tags.filter((tag) => !!recommendationsProducts[tag]),
		[tags, JSON.stringify(recommendationsProducts)]
	);

	const moreProductsTagsProductsFetched = useMemo(
		() => tags.filter((tag) => !!moreAuraProducts[tag]),
		[tags, JSON.stringify(moreAuraProducts)]
	);


	const isAllEnabled = useMemo(
		() => !isEmpty(allProductList), // "All" is enabled only if there are products in `allProductList`
		[allProductList]
	);

	const checkIsTagEnabled = useCallback(
		(tag) => tagsProductsFetched.includes(tag),
		[tagsProductsFetched]
	);

	const RecomCheckIsTagEnabled = useCallback(
		(tag) => RecomtagsProductsFetched.includes(tag),
		[RecomtagsProductsFetched]
	);

	const moreProductsCheckIsTagEnabled = useCallback(
		(tag) => moreProductsTagsProductsFetched.includes(tag),
		[moreProductsTagsProductsFetched]
	);

	const handleSuggestionClick = (tag) => {
		dispatch(setSuggestionsSelectedTag(tag));
		// dispatch(setRecommendationSelectedTag(tag));
		// dispatch(setMoreSearchSelectedTag(tag));
	};

	const handleRemoveTagData = (tag = "") => {
		if (tag) {
			if (tag === selectedTag) {
				handleSuggestionClick("");
			}
			dispatch(removeSuggestionDataTag({ tag })); // remove tag data
		}
	};

	const isTagEnabled = checkIsTagEnabled(tagToShow) || tagToShow === "";
	const RecomIsTagEnabled = RecomCheckIsTagEnabled(recommendationsTagToShow) || recommendationsTagToShow === "";
	const moreProductsIsTagEnabled = moreProductsCheckIsTagEnabled(moreProductsTagToShow) || moreProductsTagToShow === "";

	if (!isTagEnabled && !tags?.length) {
		return null;
	}
	if (!RecomIsTagEnabled && !RecTags?.length) {
		return null;
	}
	if (!moreProductsIsTagEnabled && !moreProductsTags?.length) {
		return null;
	}

	return (
		<div className='grid grid-cols-1 gap-4' id='aura-response-products-with-tags-container'>
			{title ? (
				<h1
					id='_data_widget_text'
					className='text-black-102 text-lg lg:text-xl font-bold'
					dangerouslySetInnerHTML={{
						__html: title,
					}}
				/>
			) : null}

			<div className='flex flex-wrap gap-3'>
				{!isEmpty(allProductList) && tags.length > 1 ? (
					<div
						key='All'
						className={`top-tag-wrapper rounded-full shadow w-max min-w-16 flex justify-center items-center ${!selectedTag && isAllEnabled
							? "bg-indigo-600"
							: isAllEnabled
								? "bg-lightgray-102"
								: "bg-white"
							} ${isAllEnabled ? "cursor-pointer" : "cursor-not-allowed"}`}
						onClick={() => isAllEnabled && handleSuggestionClick("")}>
						<h5
							className={`m-0 px-2 sm:px-4 py-1 font-normal text-xs md:text-sm ${!selectedTag && isAllEnabled
								? "text-white"
								: isAllEnabled
									? "text-black-103"
									: "text-black-103"
								}`}>
							All
						</h5>
						{!isAllEnabled ? (
							<Skeleton.Button
								className='tag-loading-skeleton'
								active
								shape='round'
								block
							/>
						) : null}
					</div>
				) : null}
				{tags?.map((suggestion, index) => (
					<div
						id={`tag-${suggestion}`} // Unique ID for scrolling
						key={suggestion}
						
						className={`top-tag-wrapper rounded-full shadow w-max min-w-16 flex justify-center items-center gap-2 ${suggestion === selectedTag
							? "bg-indigo-600"
							: checkIsTagEnabled(suggestion)
								? "bg-lightgray-102"
								: "bg-white"
							} ${!checkIsTagEnabled(suggestion) && "cursor-not-allowed"}`}>
						<h5
							className={`font-normal text-xs md:text-sm ml-3.5 py-1 ${suggestion === selectedTag
								? "text-white"
								: checkIsTagEnabled(suggestion)
									? "text-black-103"
									: "text-black-103"
								} ${checkIsTagEnabled(suggestion) && "cursor-pointer"} ${tags.length === 1 && "mr-3.5"
								} `}
							onClick={() =>
								checkIsTagEnabled(suggestion) &&
								handleSuggestionClick(suggestion)
							}>
							{suggestion}
						</h5>
						{tags.length > 1 ? (
							<CloseOutlined
								className={`flex items-center text-xs mr-3 py-1 ${suggestion === selectedTag
									? "text-white"
									: checkIsTagEnabled(suggestion)
										? "text-black-103"
										: "text-black-103"
									} ${checkIsTagEnabled(suggestion) && "cursor-pointer"}`}
								role='button'
								onClick={() =>
									checkIsTagEnabled(suggestion) &&
									handleRemoveTagData(suggestion)
								}
							/>
						) : null}
						{!checkIsTagEnabled(suggestion) ? (
							<Skeleton.Button
								className='tag-loading-skeleton'
								active
								shape='round'
								block
							/>
						) : null}
					</div>
				))}
			</div>

			<AuraResponseProducts
				handleLoadMore={handleLoadMore}
				products={productsToShow}
				selectedTag={selectedTag}
				recommendationsProducts={recommendationsproductsToShow}
				moreProducts={moreProductToShow}
				RecomTag={recommendationsTagToShow}
				tag={tagToShow}
				suggestionsProducts={suggestionsProducts}
				isTagEnabled={isTagEnabled}
				enableClickFetchRec={enableClickFetchRec}
				enableClickTracking={enableClickTracking}
				trackCollectionCampCode={trackCollectionCampCode}
				trackCollectionId={trackCollectionId}
				trackCollectionName={trackCollectionName}
				trackCollectionICode={trackCollectionICode}
				elementId={`${tagToShow}`}
				chatTypeKey={chatTypeKey}
				widgetHeader={widgetHeader}
				widgetImage={widgetImage}
				allProductList={allProductList}
				isAuraChatPage={isAuraChatPage}
				localChatMessage={localChatMessage}
			/>
		</div>
	);
};

export default AuraResponseProductsWithTags;
