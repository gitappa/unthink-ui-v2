import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { Drawer, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import ProductCard from "../../components/singleCollection/ProductCard";
import LeftArrow from "../../components/carouselArrows/LeftArrow";
import RightArrow from "../../components/carouselArrows/RightArrow";
import useWindowSize from "../../helper/useWindowSize";
import { handleRecProductClick } from "../recommendations/redux/actions";
import { setShowSimilar } from "./redux/actions";
import { filterAvailableProductList } from "../../helper/utils";
import { SIMILAR_MODAL_Z_INDEX } from "../../constants/codes";
import { is_store_instance } from "../../constants/config";

import styles from "./SimilarProducts.module.css";

const sliderSettings = {
	className: styles.sliderWrapper,
	dots: false,
	infinite: false,
	centerMode: false,
	slidesToShow: 1,
	slidesToScroll: 1,
	variableWidth: true,
	nextArrow: <RightArrow />,
	prevArrow: <LeftArrow />,
};

const SimilarProductsSkeleton = ({ isLoading }) =>
	isLoading ? (
		<div className={styles.skeletonContainer}>
			<Skeleton.Input active className={styles.skeletonItem} />
			<Skeleton.Input active className={styles.skeletonItem} />
			<Skeleton.Input active className={styles.skeletonItemDesktop} />
			<Skeleton.Input active className={styles.skeletonItemDesktop} />
		</div>
	) : null;

const SimilarProductsNotFound = ({ isProductsNotFound }) =>
	isProductsNotFound ? (
		<div className={styles.notFoundContainer}>
			<h2 className={styles.notFoundText}>Products Not Found</h2>
		</div>
	) : null;

const SimilarProducts = ({
	enableClickTracking = false,
	pageUser,
	trackCollectionId,
	trackCollectionName,
	trackCollectionCampCode,
	trackCollectionICode,
}) => {
	const [showSimilar, similarProducts, isFetching, authUser, isUserLogin] =
		useSelector((state) => [
			state?.appState.similarProducts.showSimilar,
			filterAvailableProductList(
				state?.appState.similarProducts.similarProducts || []
			),
			state?.appState.similarProducts.isFetching,
			state.auth.user.data,
			state.auth.user.isUserLogin,
		]);
	const dispatch = useDispatch();

	const products = useMemo(
		() => similarProducts.filter((p) => p.image),
		[similarProducts]
	);

	const onSimilarClose = () => {
		dispatch(setShowSimilar(false));
	};

	const onProductClick = () => {
		if (enableClickTracking) {
			dispatch(handleRecProductClick());
		}
	};

	const { width } = useWindowSize();
	const isMobile = width < 1024;

	return (
		<Drawer
			placement='bottom'
			closable={false}
			onClose={onSimilarClose}
			open={showSimilar}
			height={isMobile ? "282px" : "442px"}
			styles={{
				body: {
					paddingLeft: isMobile ? "12px" : "24px",
					paddingRight: isMobile ? "12px" : "24px",
					paddingTop: "24px",
					paddingBottom: "18px",
				}
			}}
			zIndex={SIMILAR_MODAL_Z_INDEX}
			key='bottom'>
			<div className={styles.drawerContent}>
				<div className={styles.drawerHeader}>
					<h1 className={styles.title}>Similar Products</h1>
					<CloseOutlined onClick={onSimilarClose} className={styles.closeIcon} />
				</div>
				<SimilarProductsSkeleton isLoading={isFetching} />
				<SimilarProductsNotFound
					isProductsNotFound={!isFetching && !products.length}
				/>
				{!isFetching && products.length ? (
					<div className={styles.sliderContainer}>
						<Slider {...sliderSettings}>
							{products.map((product) => (
								<div
									className={styles.productCardWrapper}
									key={product.mfr_code}>
									<ProductCard
										product={product}
										hideViewSimilar
										enableClickTracking={enableClickTracking}
										onProductClick={onProductClick}
										productClickParam={{
											iCode: authUser.influencer_code,
											campCode: trackCollectionCampCode,
											collectionId: trackCollectionId,
											collectionName: trackCollectionName,
											collectionICode: trackCollectionICode,
										}}
										hideAddToWishlist={is_store_instance && !isUserLogin}
									/>
								</div>
							))}
						</Slider>
					</div>
				) : null}
			</div>
		</Drawer>
	);
};

export default SimilarProducts;
