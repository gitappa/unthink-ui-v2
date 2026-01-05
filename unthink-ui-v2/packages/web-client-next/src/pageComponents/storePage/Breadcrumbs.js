import React, { useMemo } from "react";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "../../helper/useNavigate";

import {
	capitalFirstLetter,
	isEmpty,
	getSubDomain,
	generateRoute,
	getThemeCollectionsPagePath,
} from "../../helper/utils";
import { MAIN_SITE_URL, PATH_ROOT, PATH_STORE } from "../../constants/codes";
import { current_store_name } from "../../constants/config";

const Breadcrumbs = ({
	isRootPage: isInspirationDisable,
	isCollectionPage,
	isCollectionReviewPage,
	isMyProfilePage,
	isCustomProductsPage,
	is_store_instance,
	currentCollectionName,
	currentCollectionId,
	collectionsBy,
	theme,
	userName,
	user_id,
}) => {
	const navigate = useNavigate();
	const subDomain = typeof window !== 'undefined' ? getSubDomain(window.location.hostname) : null;

	const breadCrumbs = useMemo(() => {
		let breadCrumbItems = [];

		if (subDomain) {
			breadCrumbItems.push({ label: subDomain });
			if (!isInspirationDisable) {
				breadCrumbItems[0].url = PATH_ROOT;
			}
		}

		if (isMyProfilePage) {
			breadCrumbItems.push({ label: "My profile" });
		}

		if (isCustomProductsPage) {
			breadCrumbItems.push({ label: "My products" });
		}

		const addUserName = userName;
		const isCollectionOrReviewPage = isCollectionPage || isCollectionReviewPage;
		const checkForPageNoFond = !isCollectionOrReviewPage || currentCollectionId; // not showing user_name and theme breadcrumb on collection page if data not found

		if (addUserName && checkForPageNoFond) {
			breadCrumbItems.push({
				label: userName,
				url: isCollectionOrReviewPage ? generateRoute(user_id, userName) : undefined,
			});
		}

		if (!addUserName && theme && checkForPageNoFond) {
			breadCrumbItems.push({
				label: theme,
				url: isCollectionOrReviewPage ? getThemeCollectionsPagePath(theme) : undefined,
			});
		}

		if (isCollectionOrReviewPage) {
			breadCrumbItems.push({ label: currentCollectionName });
		}

		return breadCrumbItems;
	}, [
		isInspirationDisable,
		isCollectionPage,
		isCollectionReviewPage,
		isMyProfilePage,
		isCustomProductsPage,
		currentCollectionName,
		collectionsBy,
		subDomain,
		theme,
		userName,
		user_id,
	]);

	const isHomeDisable = useMemo(() => isEmpty(breadCrumbs), [breadCrumbs]);

	const mainSiteUrl = useMemo(() => MAIN_SITE_URL[current_store_name], []);

	return (
		<div className='lg:container lg:mx-auto pt-12'>
			<div
				className={`${isInspirationDisable ? "max-w-s-3 sm:max-w-lg-1" : "max-w-6xl-1 px-3"
					} lg:max-w-3xl-2 2xl:max-w-6xl-2 lg:px-0 mx-auto`}>
				<div className='flex items-center gap-3 text-base lg:text-lg'>
					{/* Back Button for Collection Review Page */}
					{isCollectionReviewPage && (
						<>
							<ArrowLeftOutlined
								className="cursor-pointer text-lg lg:text-xl-1 mb-1.25 text-gray-600"
								onClick={() => window.history.back()}
							/>
							<div>/</div>
						</>
					)}
					{/* Home Icon */}
					<HomeOutlined
						className={`flex text-lg lg:text-xl-1 mb-1.25 ${isHomeDisable ? "text-gray-106 cursor-default" : "cursor-pointer"
							}`}
						onClick={() =>
							!isHomeDisable &&
							(subDomain && mainSiteUrl
								? navigate(mainSiteUrl)
								: navigate(is_store_instance ? PATH_ROOT : PATH_STORE))
						}
					/>
					{/* Breadcrumb Items */}
					{breadCrumbs?.map((item) => {
						return item?.label ? (
							<React.Fragment key={item.label}>
								<div>/</div>
								<div
									className={`${item.url
										? "cursor-pointer hover:underline"
										: "text-gray-106 ellipsis_1"
										}`}
									onClick={() => {
										item.url && navigate(item?.url);
									}}>
									{capitalFirstLetter(item.label)}
								</div>
							</React.Fragment>
						) : null;
					})}
				</div>
			</div>
		</div>
	);
};

export default Breadcrumbs;
