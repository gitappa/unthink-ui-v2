import React, { useState, useEffect } from "react";
import { Tooltip, Upload, Spin } from "antd";
import {
  ReloadOutlined,
  FormOutlined,
  HistoryOutlined,
  PlusOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import styles from "./ChatProducts.module.css";

const AuraInputBox = ({
  isShowTryAgain = false,
  showChatLoader = false,
  handleTryAgainClick = () => {},
  handleGoBack = () => {},
  isShopByThemeOptionActive = false,
  isCompleteTheLookOptionActive = false,
  uploadImageProps = {},
  chatImageUrl = "",
  activeSearchOption = {},
  chatTypeKey = "",
  inputRef = null,
  localChatMessage = "",
  handleInputChange = () => {},
  handlePromptKeyDown = () => {},
  handlePromptUtilityClick = () => {},
  page_info = "",
  isShopALookOptionActive = false,
  handleSubmitChatInput = () => {},
  setIsHistoryOpen,
  followUpQuery,
  hideActions = false,

}) => {
    console.log('followUpQueryd',followUpQuery);
    
  //   const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  //    console.log('activeSearchOption',activeSearchOption?.allow_image_search);

  // auto-resize textarea to fit content (target the actual textarea element)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let el = null;
    if (inputRef?.current && inputRef.current.tagName === "TEXTAREA") {
      el = inputRef.current;
    } else {
      el = document.getElementById(`chat_search_input_bottom_${chatTypeKey}`);
    }
    if (el && el.style) {
      try {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      } catch (err) {
        // element might not support style/scrollHeight; ignore safely
      }
    }
  }, [localChatMessage, inputRef, chatTypeKey]);

  const onTextareaKeyDown = (e) => {
    // Handle Enter: send on Enter (no Shift), newline on Shift+Enter
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmitChatInput();
      }
      // don't forward Enter to parent handler (it sends unconditionally)
      return;
    }

    if (typeof handlePromptKeyDown === "function") {
      handlePromptKeyDown(e);
    }
  };

  return (
    <div className={styles["chat-products-bottom-input-wrapper"]}>
       
      {!hideActions && (
        <div className={styles["chat-products-above-input-actions"]}>
          <div className={styles["chat-products-icon-buttons-group"]}>
            
            {isShowTryAgain && (
              <Tooltip title="Redo">
                <button
                  type="button"
                  className={styles["chat-products-icon-action-btn"]}
                  onClick={handleTryAgainClick}
                  disabled={showChatLoader}
                >
                  <ReloadOutlined />
                </button>
              </Tooltip>
            )}
            <Tooltip title="New chat">
              <button
                type="button"
                className={styles["chat-products-icon-action-btn"]}
                onClick={handleGoBack}
                disabled={showChatLoader}
              >
                <FormOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Past chats">
              <button
                type="button"
                className={styles["chat-products-icon-action-btn"]}
                onClick={() => setIsHistoryOpen(true)}
                disabled={showChatLoader}
              >
                <HistoryOutlined />
              </button>
            </Tooltip>
          </div>
          {showChatLoader && (
            <div className={styles["chat-products-inline-loader"]}>
              <Spin size="small" />
              <span>Searching...</span>
            </div>
          )}
        </div>
      )}
      <div
        className={`${styles["chat-products-bottom-input-card"]} ${
          isShopByThemeOptionActive || isCompleteTheLookOptionActive
            ? styles["chat-products-bottom-input-card-shop-theme"]
            : ""
        }`}
      >
        <div className={styles["chat-products-bottom-input-row-wrapper"]}>
          {activeSearchOption?.allow_image_search && (
            <div
              className={styles["chat-products-bottom-plus-upload-container"]}
            >
              <Upload {...uploadImageProps} showUploadList={false}>
                <button
                  type="button"
                  className={`${styles["chat-products-bottom-plus-btn"]} ${chatImageUrl ? "bg-[#7268ec] text-white" : ""}`}
                  title="Upload image"
                >
                  <PlusOutlined />
                </button>
              </Upload>
            </div>
          )}
          <textarea
            id={`chat_search_input_bottom_${chatTypeKey}`}
            ref={inputRef}
            rows={1}
            placeholder={
              typeof activeSearchOption?.text_placeholder === "string"
                ? activeSearchOption?.text_placeholder
                : activeSearchOption?.text_placeholder?.[0] ||
                  "Describe your product idea"
            }
            name="chat_message"
            value={localChatMessage}
            onChange={handleInputChange}
            onKeyDown={handlePromptKeyDown}
            className={`${styles["chat-products-bottom-input"]} ${activeSearchOption?.allow_image_search ? "" : " pl-1 "}  ${
              isShopByThemeOptionActive || isCompleteTheLookOptionActive
                ? styles["chat-products-bottom-input-shop-theme"]
                : ""
            }`}
            style={{ paddingRight: "85px", resize: "none", overflow: "hidden" }}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {!(isShopByThemeOptionActive || isCompleteTheLookOptionActive) && (
              <button
                type="button"
                className="bg-transparent border-none p-1 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                title="Open assistant settings"
                onClick={handlePromptUtilityClick}
              >
                <img
                  src={page_info?.src || page_info}
                  alt="Assistant settings"
                  className="w-5 h-5 object-contain"
                />
              </button>
            )}
            <button
              type="button"
              className={`${styles["chat-products-bottom-submit"]} shrink-0 ${
                isShopByThemeOptionActive || isCompleteTheLookOptionActive
                  ? styles["chat-products-bottom-submit-shop-theme"]
                  : ""
              } ${
                (
                  isShopALookOptionActive
                    ? !chatImageUrl
                    : !localChatMessage && !chatImageUrl
                )
                  ? styles["chat-products-bottom-submit-disabled"]
                  : ""
              }`}
              onClick={handleSubmitChatInput}
              disabled={
                isShopALookOptionActive
                  ? !chatImageUrl
                  : !localChatMessage && !chatImageUrl
              }
            >
              <ArrowUpOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuraInputBox;
