import React from "react";
import { useSelector } from "react-redux";
import ProfileRow from "./profileRow";
import styles from './userProfile.module.scss';
const UserProfile = (props) => {
	const data = useSelector((state) => state.home.userProfile ?? []);
	return (
		<div className='unthink-user-profile'>
			{data.map((rowData, index) => (
				<ProfileRow key={`profileRow-${index}`} data={rowData} />
			))}
		</div>
	);
};

export default UserProfile;
