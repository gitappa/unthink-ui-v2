// created for loading chat modal in iFrame as AURA chat page for heroesVillains.com
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setShowChatModal } from "../../hooks/chat/redux/actions";
import ChatContainer from "../storePage/ChatContainer";

const AuraChatPage = ({ isAuraChatPage, serverData }) => {
	const dispatch = useDispatch();

	const [showChatModal] = useSelector((state) => [state.chatV2.showChatModal]);

	useEffect(() => {
		dispatch(setShowChatModal(true));
	}, []);

	if (!showChatModal) return null;

	return (
		<div>
			<ChatContainer
				disabledOutSideClick={true}
				config={serverData.config}
				trackCollectionData={{}}
				isBTInstance={false}
				isAuraChatPage={isAuraChatPage}
			/>
		</div>
	);
};

export default AuraChatPage;
