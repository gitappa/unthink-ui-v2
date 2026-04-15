import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import styles from '../../style/home/auraSuggestions.module.scss';
const { Text } = Typography;
const AuraSuggestions = (props) => {
	const auraSuggestions = useSelector((state) => state?.chat?.auraSuggestions);
	return (
		<>
			{auraSuggestions && (
				<div className='unthink-aura-suggestions static'>
					<>
						<Text className='medium'>{auraSuggestions}</Text>
					</>
				</div>
			)}
		</>
	);
};

export default AuraSuggestions;
