import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { setShowChatModal } from "../../hooks/chat/redux/actions";
import { getCurrentTheme } from "../../helper/utils";

// import auraImageRound from "../../images/chat/aura-image-round.png";

const AskAuraCard = ({ size = "medium" }) => {
	const dispatch = useDispatch();

	const handleTileClick = useCallback(() => {
		// perform chat click on header // open chat on header
		dispatch(setShowChatModal(true));
	}, []);

	return (
		<div className={`${getCurrentTheme()} h-180 w-full lg:h-340`}>
			<div
				className={`overflow-hidden ${
					size === "small" ? "w-40 lg:w-180" : "w-40 sm:w-180 lg:w-80"
				} relative cursor-pointer h-full rounded-xl product_card_container shadow-3xl bg-slat-101 text-white`}
				onClick={handleTileClick}>
				{/* <img src={auraImageRound} /> */}
				<div className='h-full flex text-center flex-col justify-center'>
					<p className='text-sm sm:text-lg'>Want to find more products?</p>
					<p className='text-base sm:text-3xl font-bold underline'>Ask Aura</p>
				</div>
			</div>
		</div>
	);
};

export default React.memo(AskAuraCard);
