import React, { useState, useEffect } from "react";
import { Tooltip, Upload, Spin } from "antd";
import {
  CloseCircleFilled,
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
  chatHistory,
  hideActions = false,
  isFollowUpQuery,
  isMobile = false,
  isDrawer = false,
}) => {
     
    // console.log('chatHistory',chatHistory.length >2);
    
  //   const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  //    console.log('activeSearchOption',activeSearchOption?.allow_image_search);

  // auto-resize textarea to fit content (target the actual textarea element)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let el = null;
    if (inputRef?.current && inputRef.current.tagName === "TEXTAREA" && !isDrawer) {
      el = inputRef.current;
    } else {
      el = document.getElementById(isDrawer ? `chat_search_input_bottom_${chatTypeKey}_drawer` : `chat_search_input_bottom_${chatTypeKey}`);
    }
    if (el && el.style) {
      try {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      } catch (err) {
        // element might not support style/scrollHeight; ignore safely
      }
    }
  }, [localChatMessage, inputRef, chatTypeKey, isDrawer]);

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
            {isMobile || isDrawer ? (
              isShowTryAgain && (
                <div className="flex items-center gap-1.5 cursor-pointer animate-in fade-in duration-200" onClick={handleTryAgainClick}>
                  <button
                    type="button"
                    className={styles["chat-products-icon-action-btn"]}
                    disabled={showChatLoader}
                    title="Redo"
                  >
                    <ReloadOutlined style={{ fontSize: "15px", color: "#1a1a1a" }} />
                  </button>
                  <span className="text-sm font-semibold text-[#1a1a1a]">Redo</span>
                </div>
              )
            ) : (
              <>
                {isShowTryAgain && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className={styles["chat-products-icon-action-btn"]}
                      onClick={handleTryAgainClick}
                      disabled={showChatLoader}
                      title="Redo"
                    >
                      <ReloadOutlined />
                    </button>
                    <span className="text-xs font-semibold text-[#555d74] cursor-pointer" onClick={handleTryAgainClick}>Redo</span>
                  </div>
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
              </>
            )}
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
        className={`${isDrawer ? "w-full !border !border-[#7268ec]/25 !rounded-[18px] !bg-white !py-2 !px-3 !shadow-[0_4px_12px_rgba(114,104,236,0.06)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] box-border focus-within:!border-[#7268ec] focus-within:!shadow-[0_4px_16px_rgba(114,104,236,0.15)]" : styles["chat-products-bottom-input-card"]} ${
          isShopByThemeOptionActive || isCompleteTheLookOptionActive
            ? styles["chat-products-bottom-input-card-shop-theme"]
            : ""
        }`}
      >
        <div className={styles["chat-products-bottom-input-row-wrapper"]}>
    
          <textarea
            id={isDrawer ? `chat_search_input_bottom_${chatTypeKey}_drawer` : `chat_search_input_bottom_${chatTypeKey}`}
            ref={isDrawer ? null : inputRef}
            rows={1}
            placeholder={
              typeof activeSearchOption?.text_placeholder === "string" && !isFollowUpQuery
                ? activeSearchOption?.text_placeholder
                : chatHistory[chatHistory.length-1] 
            }
            name="chat_message"
            value={localChatMessage}
            onChange={handleInputChange}
            onKeyDown={handlePromptKeyDown}
            className={`${isDrawer ? "w-full !min-h-[38px] !max-h-[120px] !text-sm !font-medium !leading-relaxed !py-1 !px-0 !text-[#1a1a1a] !bg-transparent !border-none !outline-none !resize-none placeholder:!text-[#8a8fa3] placeholder:!text-[13px] placeholder:!font-normal" : `${styles["chat-products-bottom-input"]} w-full border-none outline-none bg-transparent text-[#1a1a1a] font-medium text-base leading-6 pt-1 pb-1`} ${activeSearchOption?.allow_image_search ? "" : "  "} ${
              isShopByThemeOptionActive || isCompleteTheLookOptionActive
                ? styles["chat-products-bottom-input-shop-theme"] 
                : ""
            }`}
            style={{ resize: "none", overflow: "hidden" }}
          />
          { !( isCompleteTheLookOptionActive || activeSearchOption?.allow_image_search) && 
              <button
              type="button"
              className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5  ${styles["chat-products-bottom-submit"]} shrink-0 ${
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
                showChatLoader ||
                (isShopALookOptionActive
                  ? !chatImageUrl
                  : !localChatMessage && !chatImageUrl)
              }
            >
              <ArrowUpOutlined />
            </button>
          }
          {( activeSearchOption?.allow_image_search || isCompleteTheLookOptionActive ) &&
          <div className={`flex justify-between items-center border-t ${isDrawer ? "border-gray-200" : "border-gray-500"} pt-1.5`}>
              <div className="flex gap-3 items-center">

                {activeSearchOption?.allow_image_search && (
            <div
              className={styles["chat-products-bottom-plus-upload-container"]}
            >
              <Upload {...uploadImageProps} showUploadList={false}>
                <button
                  type="button"
                  className={`${styles["chat-products-bottom-plus-btn"]} ${chatImageUrl ? " text-black" : ""}`}
                  title="Upload image"
                >
                  <PlusOutlined />
                </button>
              </Upload>
            </div>
            
          )}
              {!(isShopByThemeOptionActive || isCompleteTheLookOptionActive) && (
              <button
                type="button"
                className="bg-transparent border-none p-1 flex items-center justify-center cursor-pointer hover:opacity-80"
                title="Open assistant settings"
                onClick={handlePromptUtilityClick}
              >
                <img
                  src={page_info?.src || page_info}
                  alt="Assistant settings"
                  className=" object-contain h-8 w-8 "
                />
              </button>
            )}
              </div>

          <div className="    flex items-center gap-1.5 pr-2">
            {/* {localChatMessage && (
              <CloseCircleFilled
                className="text-gray-400 hover:text-[#7268ec] cursor-pointer text-sm mx-1 transition-colors z-10"
                onClick={() => handleInputChange({ target: { value: "" } })}
              />
            )} */}
        
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
                showChatLoader ||
                (isShopALookOptionActive
                  ? !chatImageUrl
                  : !localChatMessage && !chatImageUrl)
              }
            >
              <ArrowUpOutlined />
            </button>
          </div>
          </div>
}

        </div>
      </div>
    </div>
  );
};

export default AuraInputBox;
