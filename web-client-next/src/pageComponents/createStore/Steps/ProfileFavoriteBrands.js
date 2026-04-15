import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Button, Checkbox, Typography } from "antd";
import { useSelector } from "react-redux";

import SelectBrands from "./SelectBrands";
import styles from "./ProfileFavoriteBrands.module.scss";
import { socket, SocketContext } from "../../../context/socketV2";
import { 
	getTTid, 
	getSid, 
	getPrevSid, 
	isDebugCookie
} from "../../../helper/getTrackerInfo";
import { getParams } from "../../../helper/utils";
import { access_key, is_store_instance, current_store_name } from "../../../constants/config";

const { Title } = Typography;

const ProfileFavoriteBrands = ({
	nextStep,
	prevStep,
	brandList,
	profileData,
	handleChange,
}) => {
	const [hasError, setHasError] = useState(false);
	const [allSelected, setAllSelected] = useState(false);
	
	const { sendSocketClientMessage } = useContext(SocketContext);
	const [user, socketId, showChatLoader, chatMessage] = useSelector((state) => [
		state.auth.user,
		state.chatV2.socketId,
		state.chatV2.showChatLoader,
		state.chatV2.chatMessage,
	]);

	const handleBrandsChange = (brands) => {
		setHasError(false);
		handleChange("brands", brands);
	};
	// console.log(profileData.brands);

	const onContinue = () => {
		if (profileData.brands.length) {	
			// console.log(profileData.brands);
			
			// Trigger socket userInfo emission
			if (user && socketId) {
				const userInfo = {
					access_key,
					userId: getTTid(),
					language: "en-US",
					sessionId: getSid(),
					prevSessionId: getPrevSid(),
				};

				if (getParams("unthink_internal") === "true" || isDebugCookie()) {
					userInfo["debug"] = true;
				}

				userInfo["enableai"] = true;

				if (user?.data.filters && user?.data.filters?.[current_store_name]?.strict?.brand?.length) {
					userInfo["filters"] =profileData.brands;
				}

				if (window.localStorage.getItem("search_priority")) {
					userInfo.search_priority = window.localStorage.getItem("search_priority");
				}

				if (is_store_instance) {
					userInfo.store = current_store_name;
				}

				const search_alg = localStorage.getItem("search_alg");
				if (search_alg) {
					userInfo.search_alg = search_alg;
				}

				const method = localStorage.getItem("method");
				if (method) {
					userInfo.method = method;
				}

				socket.emit("userInfo", userInfo);

				// Resend message if applicable
				if (showChatLoader && chatMessage) {
					sendSocketClientMessage({ message: chatMessage });
				}
			}
			nextStep();
		} else {
			setHasError(true);
		}
	};

	const selectAllChange = (e) => {
		const { checked } = e.target;
		setAllSelected(checked);
		if (checked) {
			const allBrands = brandList.map((brand) => brand.brand);
			handleChange("brands", allBrands);
			setHasError(false);
		} else {
			handleChange("brands", []);
		}
	};

	useEffect(() => {
		if (brandList.length === profileData.brands.length) {
			setAllSelected(true);
		} else {
			setAllSelected(false);
		}
	}, [profileData.brands]);

	return (
		<div>
			<Row justify='space-between' className={styles['headerRow']}>
				<Col span={24} className={styles['buttonCol']}>
					<Button type='primary' onClick={onContinue}>
						Continue
					</Button>
				</Col>
			</Row>
			<Title className={styles['title']} level={4} style={{color:"white"}}>
				Pick the brands that you would like to choose products from
			</Title>
			<div className={styles['selectAllWrapper']}>
				<Checkbox
					className={styles['selectAllCheckbox']}
					onChange={selectAllChange}
					checked={allSelected}>
					Select all
				</Checkbox>
			</div>
			<div className={styles['errorContainer']}>
				{hasError && (
					<p className={styles['errorText']}>Please select at-least one brand</p>
				)}
			</div>
			<SelectBrands
				brandList={brandList}
				selectedBrands={profileData.brands}
				handleBrandsChange={handleBrandsChange}
			/>
		</div>
	);
};

export default ProfileFavoriteBrands;
