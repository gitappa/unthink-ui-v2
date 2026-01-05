import React from "react";
import { useSelector } from "react-redux";
import AllBlogPages from "../pageComponents/collectionPage/AllBlogPages";
import { COLLECTIONS_ID } from "../constants/codes";

const Blog = () => {
	const authUser = useSelector((state) => state.auth.user);
	const authUserCollections = useSelector((state) => state.auth.user.collections);
	const influencerUserCollections = useSelector((state) => state.influencer.collections);

	return (
		<div className="static_page_bg min-h-screen">
			<AllBlogPages
				enableClickTracking={false}
				pageUserCollections={authUserCollections.data || []}
				pageUser={authUser}
				isPageLoading={false}
				authUser={authUser}
				isUserLogin={!!authUser}
				isStoreHomePage={false}
				isBTInstance={false}
				isSamskaraInstance={false}
				selectedSortOption={null}
				handleSortOptionChange={() => {}}
				onShowMoreClick={() => {}}
				isLoading={false}
				setIsLoading={() => {}}
				dataEmpty={[]}
				authUserCollections={authUserCollections}
				influencerUserCollections={influencerUserCollections}
				showWishlistModal={false}
			/>
		</div>
	);
};

export default Blog;
