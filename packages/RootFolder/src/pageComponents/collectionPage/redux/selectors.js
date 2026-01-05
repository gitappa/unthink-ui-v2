export const pListState = (state) => state.collectionPage.pList_name;

export const plistDataState = (state) => state.collectionPage.pListData;

export const pListNextUrlState = (state) => state.collectionPage.plistNextUrl;

export const authUserState = (state) => state.auth.user;

export const sharedUserState = (state) => state.influencer.user;

export const currentCollectionPageState = (state) =>
	state.collectionPage.collection;

export const selectedCollectionPageState = (state) =>
	state.appState.wishlist.blogCollection.selectedBlogCollection;
