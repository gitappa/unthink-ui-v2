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
import { isEmpty } from "../../helper/utils";
import styles from './AuraResponseProductsWithTags.module.css';

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
		<div className={styles['aura-tags-container']} id='aura-response-products-with-tags-container'>
			{title ? (
				<h1
					id='_data_widget_text'
					className={styles['aura-tags-title']}
					dangerouslySetInnerHTML={{
						__html: title,
					}}
				/>
			) : null}

			<div className={styles['aura-tags-wrapper']}>
				{!isEmpty(allProductList) && tags.length > 1 ? (
					<div
						key='All'
						className={`${styles['aura-tag-item']} ${!selectedTag && isAllEnabled
							? styles['aura-tag-selected']
							: isAllEnabled
								? styles['aura-tag-enabled']
								: styles['aura-tag-disabled']
							}`}
						onClick={() => isAllEnabled && handleSuggestionClick("")}>
						<h5
							className={styles['aura-tag-text']}>
							All
						</h5>
						{!isAllEnabled ? (
							<Skeleton.Button
								className={styles['aura-tag-loading-skeleton']}
								active
								shape='round'
								block
							/>
						) : null}
					</div>
				) : null}
				{tags?.map((suggestion, index) => (
					<div
					id={`tag-${suggestion}`}
					key={suggestion}
					className={`${styles['aura-tag-item']} ${suggestion === selectedTag
						? styles['aura-tag-selected']
						: checkIsTagEnabled(suggestion)
							? styles['aura-tag-enabled']
							: styles['aura-tag-disabled']
						} ${tags.length > 1 ? styles['aura-tag-text-multiple'] : ''}`}>
					<h5
						className={`${styles['aura-tag-text']} ${tags.length === 1 ? styles['aura-tag-text-single'] : ''}`}
							onClick={() =>
								checkIsTagEnabled(suggestion) &&
								handleSuggestionClick(suggestion)
							}>
							{suggestion}
						</h5>
						{tags.length > 1 ? (
							<CloseOutlined
								className={styles['aura-tag-close-icon']}
								role='button'
								onClick={() =>
									checkIsTagEnabled(suggestion) &&
									handleRemoveTagData(suggestion)
								}
							/>
						) : null}
						{!checkIsTagEnabled(suggestion) ? (
							<Skeleton.Button
								className={styles['aura-tag-loading-skeleton']}
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
