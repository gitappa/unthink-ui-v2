import React from "react";
import { Result, Button } from "antd";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);

import { MY_PROFILE } from "../../constants/codes";

const UserNotFound = () => {
	return (
		<div>
			<Result
				title='User does not exist'
				extra={
					<Button type='primary' onClick={() => navigate(MY_PROFILE)}>
						Back to my profile
					</Button>
				}
			/>
		</div>
	);
};

export default UserNotFound;
