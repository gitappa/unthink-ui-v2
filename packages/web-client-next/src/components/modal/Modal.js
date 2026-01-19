import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";

import {
	makeBodyOverflowHidden,
	makeBodyOverflowUnset,
} from "../../helper/utils";

const unthinkNextGenModalClass = "un-next-gen-modal";

const Modal = ({
	isOpen,
	children,
	onClose,
	maskClosable = true,
	size = "md",
	headerText,
	subText,
	subTextClassName ='lg:text-base text-sm mt-2',
	contentWrapperSpacingClassName = "px-8 py-4",
	zIndexClassName = "z-40",
	headerTextSpacingClassName = "py-6 px-4",
	headerTextClassName = "text-xl-1.5 font-semibold",
	closeClassName = "text-xl-1.5",
}) => {
	const [showChatModal, showWishlistModal] = useSelector((state) => [
		state.chatV2.showChatModal,
		state.appState.wishlist.showWishlistModal,
	]); // modals isOpen states which are completely custom and handled by redux, using it to manage body scroll Behavior

	useEffect(() => {
		if (isOpen) {
			makeBodyOverflowHidden();

			return () => {
				if (
					// make the body overflow unset only when this will the last modal
					window?.document?.getElementsByClassName(unthinkNextGenModalClass)
						?.length === 0 &&
					!showChatModal &&
					!showWishlistModal
				) {
					makeBodyOverflowUnset();
				}
			};
		}

		return () => {};
	}, [isOpen]);

	const maxWidthClassName = useMemo(() => {
		switch (size) {
			case "xs":
				return "max-w-480 mx-4 tablet:mx-0";

			case "sm":
				return "max-w-480 mx-4 tablet:mx-0 desktop:max-w-704";

			case "x-sm":
				return "mx-4 tablet:mx-0 max-w-964";

			case "md":
			default:
				return "max-w-480 mx-4 tablet:mx-0 tablet:max-w-704 desktop:max-w-1260";
		}
	}, [size]);

	const showHeader = useMemo(	
		() => headerText || onClose,
		[headerText, onClose]
	);

	if (isOpen) {
		return (
			<div
				// unthinkNextGenModalClass class added to handle body overflow scroll bar
				className={`${unthinkNextGenModalClass} fixed flex justify-center items-center w-full h-screen overflow-auto left-0 top-0 backdrop-filter backdrop-blur-xs bg-gray-102 ${zIndexClassName}`}
				onClick={() => maskClosable && onClose && onClose()}>
				<div
					className={`max-h-screen w-full mx-auto ${maxWidthClassName} pt-5`}
					onClick={(e) => e.stopPropagation()} // to avoid click on backDrop // prevent bubbling
				>
					<div className='pb-5'>
						{showHeader ? (
							<div
								className={`modal-header flex justify-between bg-white rounded-t-xl ${headerTextSpacingClassName} ${subText ?'items-start': ''}` }>
								<div>
									{headerText && (
										<h2 className={`${headerTextClassName}`}>{headerText}</h2>
									)}
									{subText && (
										<p className={`${subTextClassName}`}>{subText}</p>
									)}
								</div>
								<div className='flex'>
									{onClose && (
										<CloseOutlined
											onClick={onClose}
											className={`close flex items-center font-semibold cursor-pointer ${closeClassName}`}
											role='button'
										/>
									)}
								</div>
							</div>
						) : null}
						<div
							className={`modal-body bg-slate-200 ${
								showHeader ? "rounded-b-xl" : "rounded-xl"
							} ${contentWrapperSpacingClassName}`}>
							{children}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default React.memo(Modal);
