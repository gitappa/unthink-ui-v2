import React from "react";
import { useNavigate } from "../../helper/useNavigate";
import { INFLUENCER_SHARED } from "../../constants/codes";

const TitleSuffix = ({ title, title_suffix }) => {
	const navigate = useNavigate();
	if (title_suffix) {
		switch (title_suffix.type) {
			case "shared_page":
				if (title_suffix.user_id) {
					return (
						<>
							<span>{`${title} `}</span>
							<span
								className='underline'
								onClick={(e) => {
									e.stopPropagation();
									navigate(`${INFLUENCER_SHARED}${title_suffix.user_id}`);
								}}>
								{title_suffix.text}
							</span>
						</>
					);
				}
				break;

			default:
				break;
		}
	}

	return <span>{title}</span>;
};

export default TitleSuffix;
