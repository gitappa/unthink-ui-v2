import React, { useMemo } from "react";
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";

import styles from './mainContent.module.scss';

import { setShowChatModal } from "../../../hooks/chat/redux/actions";
import { getThemeCollectionsPagePath } from "../../../helper/utils";
import { ErasBar } from "./ErasBar";
import { THEME_ALL } from "../../../constants/themeCodes";
import { STORE_USER_NAME_SWIFTLYSTYLED } from "../../../constants/codes";
import { current_store_name, is_store_instance } from "../../../constants/config";

export const MainContent = () => {

	const isSwiftlyStyledInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED,
		[]
	);


	const dispatch = useDispatch();
  const router = useRouter();
  const navigate = (path) => router.push(path);
	return (
		<section id='swiftly-styled-main-content'>
			<div className='main-content'>
				<div className='headline'>
					<h1>PERFECT OUTFITS </h1>
					<h1>
						FROM ACROSS ALL <span className='flash-text'>ERAS</span>
					</h1>
					<h2>
						<span className='highlight'>{isSwiftlyStyledInstance ? "Swiftly Style" : "Do The Look"}</span> your outfit for the{" "}
						<span className='highlight'>Eras Tour!</span>
					</h2>
				</div>
				<div className='subheadline'>
					<p>
						Got a <span className='italic'>Blank Space</span> in your wardrobe?
					</p>
					<p>
						Discover <span className='italic'>Enchanted</span> fashion ideas
						beyond your <span className='italic'>Wildest Dreams</span>!
					</p>
				</div>
				<div className='buttons'>
					<button
						className='button explore-btn'
						// redirect on categories/all page
						onClick={() => navigate(getThemeCollectionsPagePath(THEME_ALL))}>
						EXPLORE COLLECTIONS
					</button>
					<button
						className='button search-btn'
						onClick={() => dispatch(setShowChatModal(true))}>
						SEARCH OUTFITS
					</button>
				</div>
				{
					isSwiftlyStyledInstance ? <p className='footer'>
						<p className='whitespace-nowrap'>KARMA IS YOUR FLAWLESS ATTIRE.</p>
					</p> : ""
				}
				<div className='erasbar-main'>
					<ErasBar />
				</div>
			</div>
		</section>
	);
};
