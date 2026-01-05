import React, { useState, useContext } from "react";
import { Typography } from "antd";
const { Text } = Typography;
const ProfileRow = (props) => {
	const [showAll, setShowAll] = useState(false);
	const toggleView = () => {
		setShowAll((prevState) => !prevState);
	};
	const onChipClick = () => {};
	return (
		<div className='unthink-user-profile-row'>
			<div className='unthink-user-profile-row__header'>
				<Text>{props?.data?.attribute ?? ""}</Text>
			</div>
			<div className='unthink-user-profile-row__content'>
				{props.data?.values?.map((value, index) => {
					if (index > 5 && !showAll) return null;
					return (
						<div className={value.priority === "high" ? "red" : ""}>
							<Text
								alt={value.value}
								onClick={() => onChipClick(value.value)}>
								<Text ellipsis={{ tooltip: value.value }}>{value.value}</Text>
							</Text>
						</div>
					);
				})}
			</div>
			<div className='unthink-user-profile-row__footer'>
				{props.data.values?.length > 6 && (
					<Text onClick={toggleView}>{showAll ? "hide all" : "show all"}</Text>
				)}
			</div>
		</div>
	);
};

export default ProfileRow;
