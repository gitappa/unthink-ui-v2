const getRecentlyViewed = () => {
	const data = window?.localStorage.getItem("cem.recentlyViewed");
	return data?.split ? data.split(",") : [];
};

export default getRecentlyViewed;
