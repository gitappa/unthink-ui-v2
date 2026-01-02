import React from "react";

export async function getServerSideProps() {
	return {
		redirect: {
			destination: "https://unthink.ai/blog/",
			permanent: false,
		},
	};
}

const BlogPage = () => {
	return null;
};

export default BlogPage;
