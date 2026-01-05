import React from "react";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);
import { Result, Button } from "antd";

import { PATH_ROOT, PATH_STORE } from "../../constants/codes";
import { is_store_instance } from "../../constants/config";

const BlogPageNotFound = () => {
	return (
		<div>
			<Result
				status='404'
				title='Page not found'
				subTitle='You may have reached a collection page that has not been published yet or is undergoing changes. If this URL was shared with you by the author, please check with them.'
				// icon={<ExclamationCircleFilled className='text-primary' />}
				extra={
					<Button
						type='primary'
						className='bg-primary border-primary'
						onClick={() => {
							if (is_store_instance) {
								navigate(PATH_ROOT);
							} else {
								navigate(PATH_STORE);
							}
						}}>
						Back
					</Button>
				}
				className='max-w-2xl mx-auto'
			/>
		</div>
	);
};

export default BlogPageNotFound;
