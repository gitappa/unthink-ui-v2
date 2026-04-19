import React from "react";
import { Result } from "antd";

export default function MaintenancePage() {
	return (
		<Result
			status='warning'
			title="We'll be back soon!"
			subTitle="We're performing some maintenance at the moment. Sorry for the inconvenience."
		/>
	);
}
