import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import ChatContainer from "../src/pageComponents/storePage/ChatContainer";
import { setShowChatModal } from "../src/hooks/chat/redux/actions";
import { current_store_name, is_store_instance } from "../src/constants/config";
import { STORE_USER_NAME_BUDGETTRAVEL } from "../src/constants/codes";

const AURA_CHAT_PROPS_STORAGE_KEY = "auraChatContainerProps";

const AuraModel = () => {
  const dispatch = useDispatch();
 
  const isBTInstance = useMemo(
    () =>
      is_store_instance && current_store_name === STORE_USER_NAME_BUDGETTRAVEL,
    []
  );
   useEffect(() => {
    dispatch(setShowChatModal(true));

    return () => {
      dispatch(setShowChatModal(false));
    };
  }, [dispatch]);

 

  return <ChatContainer isBTInstance ={isBTInstance} disabledOutSideClick={true}   isAuraChatPage={true} />;
};

export default AuraModel;