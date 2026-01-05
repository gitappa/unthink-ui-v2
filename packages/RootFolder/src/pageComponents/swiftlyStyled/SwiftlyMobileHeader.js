import React, { useMemo } from "react";
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";

import searchIcon from "../../images/swiftly-styled/Aura - Search.svg";
import userIcon from "../../images/swiftly-styled/User.svg";

import useTheme from "../../hooks/chat/useTheme";
import { setShowChatModal } from "../../hooks/chat/redux/actions";
import { PATH_ROOT, STORE_USER_NAME_SWIFTLYSTYLED } from "../../constants/codes";
import { current_store_name, is_store_instance } from "../../constants/config";

const SwiftlyMobileHeader = ({ showProfileIcon, setShowMenu }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const navigate = (path) => router.push(path);
	const { themeCodes } = useTheme();

	const isSwiftlyStyledInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED,
		[]
	);

	return (
		<>
			<div
				className='w-full px-2 py-1 text-center text-[11px] leading-4 tracking-[0.5px]'
				style={{
					background: themeCodes.header.announcement_bar_bg,
					color: themeCodes.header.announcement_bar_text,
				}}>
				<span className='block whitespace-normal break-words'>
					EVERY OUTFIT HAS A LOVE STORY – LET’S CREATE YOURS TOGETHER!
				</span>
			</div>
			<div
				className='flex items-center px-3 text-white'
				style={{ height: "56px", background: themeCodes.header.header_bg }}>
				<button
					type='button'
					className='w-10 flex items-center justify-start'
					onClick={() => dispatch(setShowChatModal(true))}
					aria-label='Search'>
					<img
						src={searchIcon}
						alt='searchIcon'
						className='h-6 w-6'
						style={{ filter: "invert(1)" }}
					/>
				</button>

				<div className='flex-1 min-w-0 text-center'>
					<span
						className='cursor-pointer text-white font-medium truncate block'
						onClick={() => navigate(PATH_ROOT)}>
						{isSwiftlyStyledInstance ? "SwiftlyStyled" : "DoTheLook"}
					</span>
				</div>

				<div className='w-10 flex items-center justify-end'>
					{showProfileIcon ? (
						<button
							type='button'
							className='w-10 flex items-center justify-end'
							onClick={() => setShowMenu(true)}
							aria-label='Open profile menu'>
							<img
								src={userIcon}
								alt='userIcon'
								className='h-6 w-6'
								style={{ filter: "invert(1)" }}
							/>
						</button>
					) : null}
				</div>
			</div>
		</>
	);
};

export default SwiftlyMobileHeader;
