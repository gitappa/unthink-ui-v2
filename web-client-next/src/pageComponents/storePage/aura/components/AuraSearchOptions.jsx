import React from "react";
import { CaretDownFilled } from "@ant-design/icons";

import { CHAT_SEARCH_OPTION_ID } from "../../../../constants/codes";
const getImageSrc = (image) => image?.src || image;

const AuraSearchOptions = ({
  activeSearchOption,
  cardCollageVariants,
  displaySearchOptions = [],
  fallbackImages = [],
  handleSetSearchOption,
  handleTryExampleClick,
  isBTNormalUserLoggedIn = false,
  isSearchOptionManuallySelected = false,
  isSearchOptionsVisible = true,
  searchOptionPreviewImages = {},
  setIsSearchOptionsVisible,
  shouldHighlightActiveSearchOption = false,
}) => {
  return (
    <div className={"relative mb-0 w-full"}>
      {isSearchOptionManuallySelected && !isSearchOptionsVisible ? (
        <>
          <div
            className={`${"sticky top-0 z-[100] mb-2 flex w-full justify-center bg-transparent pointer-events-none"} ${"flex max-lg:hidden"}`}
          >
            <div
              className={"pointer-events-auto flex h-8 w-[70px] cursor-pointer items-center justify-center rounded-b-full border-[1.5px] border-t-0 border-secondary bg-gray-light-2 text-brand shadow-[0_6px_15px_rgba(203,198,244,0.8)] transition-all duration-200 hover:translate-y-0.5 hover:bg-secondary hover:shadow-[0_8px_20px_rgba(184,175,255,0.9)]"}
              onClick={() => setIsSearchOptionsVisible(!isSearchOptionsVisible)}
              title={
                isSearchOptionsVisible
                  ? "Collapse search options"
                  : "Expand search options"
              }
            >
              <CaretDownFilled
                className={`${"text-[28px] transition-transform duration-300"} ${
                  !isSearchOptionsVisible ? "" : "rotate-180"
                }`}
              />
            </div>
          </div>
          <div
            className={`${"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"} ${"hidden max-lg:flex"} w-full gap-1 overflow-x-auto justify-center py-2 px-1 mb-2`}
          >
            {displaySearchOptions?.map((option, index) => {
              const isOptionActive = option?.id === activeSearchOption?.id;
              const previewImage =
                searchOptionPreviewImages[option.id] ||
                fallbackImages[index % fallbackImages.length];

              return (
                <div
                  key={`mini-${option.id}`}
                  className={`flex-1 min-w-[58px] max-w-[130px] flex flex-col items-center justify-center p-1 rounded-xl cursor-pointer transition-all border ${
                    isOptionActive
                      ? "border-brand bg-tertiary"
                      : "border-slate-200 bg-white hover:bg-gray-50"
                  }`}
                  style={{ height: "70px" }}
                  onClick={() => handleSetSearchOption(option)}
                >
                  <div className="w-6 h-6 rounded bg-tertiary flex items-center justify-center mb-1">
                    <img
                      src={getImageSrc(previewImage)}
                      className="w-4 h-4 object-contain"
                      alt={option.title}
                    />
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] text-center leading-tight font-medium ${
                      isOptionActive ? "text-secondary" : "text-slate-600"
                    }`}
                  >
                    {option.title}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      <div
        className={`${"overflow-hidden max-h-[1000px] opacity-100 transition-[max-height,opacity,margin] duration-300 ease-in-out"} ${
          !isSearchOptionsVisible ? "max-h-0 opacity-0 m-0 pointer-events-none" : ""
        }`}
      >
    

        {!isBTNormalUserLoggedIn ? (
          <div
            className={`grid ${
              displaySearchOptions?.length === 1
                ? "grid-cols-1"
                : displaySearchOptions?.length === 2
                  ? "lg:grid-cols-2 grid-cols-1"
                  : displaySearchOptions?.length === 3
                    ? "lg:grid-cols-3 grid-cols-1"
                    : displaySearchOptions?.length === 4
                      ? "lg:grid-cols-4 grid-cols-1"
                      : "lg:grid-cols-5 grid-cols-1"
            }  w-full gap-4 lg:gap-5 py-2 `}
          >
            {displaySearchOptions?.map((option, index) => {
              const isOptionActive =
                option?.id === activeSearchOption?.id &&
                shouldHighlightActiveSearchOption;
              const previewImage =
                searchOptionPreviewImages[option.id] ||
                fallbackImages[index % fallbackImages.length];
              const collageVariantClass =
                cardCollageVariants[option.id] ||
                "translate-y-0";

              return (
               <div
  key={option.id}
  className={`group relative flex cursor-pointer items-center gap-4
    overflow-hidden rounded-2xl border-2 border-transparent bg-white
    px-4 py-3 text-left shadow-sm   max-lg:max-w-[550px]
    ${isOptionActive ? "gradient" : "option-card transition-all duration-300 hover:-translate-y-1 hover:shadow-md"}`}

                  onClick={() => handleSetSearchOption(option)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleSetSearchOption(option);
                    }
                  }}
                >
                  <div
                    className={`${"relative mb-0 mr-0 transition-transform duration-300 max-lg:h-8 max-lg:w-8"} ${collageVariantClass} flex-shrink-0`}
                  >
                    <img
                      src={getImageSrc(previewImage)}
                      className={"block h-14 w-14 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 max-lg:h-8 max-lg:w-8"}
                      alt={option.title}
                    />
                  </div>
                  <div className={"contents"}>
                    <div
                      className={`${"flex flex-col gap-1.5 p-0"} ${
                        isOptionActive
                          ? "text-white"
                          : ""
                      }`}
                    >
                      <div
                        className={`${"m-0 text-base max-lg:text-sm leading-tight font-extrabold uppercase text-neutral-900"} ${
                          isOptionActive
                            ? "text-white"
                            : ""
                        }`}
                      >
                        {option.title}
                      </div>
                      <div
                        className={`${"m-0 line-clamp-2 overflow-hidden text-sm max-lg:text-xs leading-snug font-medium text-slate-500"} ${
                          isOptionActive
                            ? "text-white/95"
                            : ""
                        } `}
                      >
                        {option.subTitle}
                      </div>
                    
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AuraSearchOptions;





