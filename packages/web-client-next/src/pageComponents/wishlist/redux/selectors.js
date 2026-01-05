export const influencerState = (state) => state.influencer.user.data;

export const authState = (state) => state.auth.user.data;

export const enablePlist = (state) => state.auth.user.enablePlist;

export const plistDataState = (state) =>
	state.appState.wishlist.blogCollection.productList;

export const plistNameState = (state) =>
	state.appState.wishlist.blogCollection.plist_name;

export const plistNextUrlState = (state) =>
	state.appState.wishlist.blogCollection.plistNextUrl;
