import React, { useEffect, useMemo, useRef, useState } from "react";
import { Result, Popover, Tooltip } from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";

import { generateOnContactFormSubmit } from "../../helper/utils";

import styles from './askQuestionComponent.module.scss';

const AskQuestionComponent = ({
	id,
	email,
	WrapperComponent = ({ children }) => <div>{children}</div>,
}) => {
	const [isSuccess, setIsSuccess] = useState(false); // make ot null to hide full component
	const [popoverVisible, setPopoverVisible] = useState(false); // make ot null to hide full component
	const [popoverTooltipVisible, setPopoverTooltipVisible] = useState(false); // make ot null to hide full component

	const onSuccess = () => {
		setIsSuccess(true);
	};

	const handlePopoverTooltipVisibleChange = (value) => {
		setPopoverTooltipVisible(value);
	};

	const handlePopoverVisibleChange = (value) => {
		setPopoverVisible(value);
		handlePopoverTooltipVisibleChange(false);
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();

		event.target &&
			generateOnContactFormSubmit(id, false, onSuccess).apply(event.target, [
				event,
			]);
	};

	useEffect(() => {
		if (!popoverTooltipVisible) {
			isSuccess && setIsSuccess(false);
		}
	}, [popoverTooltipVisible]);

	// useEffect(() => {
	// 	if (popoverVisible) {
	// 		document
	// 			.getElementById(id)
	// 			?.addEventListener(
	// 				"submit",
	// 				generateOnContactFormSubmit(id, false, onSuccess)
	// 			);

	// 		return () => {
	// 			document
	// 				.getElementById(id)
	// 				?.removeEventListener(
	// 					"submit",
	// 					generateOnContactFormSubmit(id, false, onSuccess)
	// 				);
	// 		};
	// 	}

	// 	return () => {};
	// }, []);

	// useEffect(() => {
	// 	if (isSuccess) {
	// 		const timer = setTimeout(() => {
	// 			setIsSuccess(null);
	// 		}, 5000);

	// 		return () => {
	// 			clearTimeout(timer);
	// 		};
	// 	}

	// 	return () => {};
	// }, [isSuccess]);

	// if (isSuccess === null) {
	// 	return null;
	// }

	const popoverContent = useMemo(
		() => (
			<WrapperComponent>
				<div>
					{isSuccess ? (
						<Result
							className='mx-auto'
							status='success'
							title={<span className='text-white'>Thanks for submitting!</span>}
							subTitle={
								<span className='text-white'>
									We will get back to you as soon as possible
								</span>
							}
						/>
					) : (
						<form id={id} onSubmit={handleFormSubmit}>
							<input name='email' type='hidden' value={email} />
							<input name='contact_number' type='hidden' />
							<input
								name='page_url'
								type='hidden'
								value={typeof window !== "undefined" ? window.location?.href : ""}
							/>
							<input name='page_section' type='hidden' value={id} />

							<div>
								<p className='md:leading-none font-normal flex items-center justify-between mb-0 text-white'>
									<span className='text-2xl tablet:text-4xl desktop:text-display-l font-semibold break-word-only ellipsis_1'>
										Stuck?
									</span>
									<CloseOutlined
										id='ask_question_close_icon'
										onClick={() => handlePopoverVisibleChange(false)}
										className='flex text-2xl cursor-pointer text-white'
									/>
								</p>
							</div>

							<div>
								<div className='tablet:flex tablet:justify-between mt-6 mb-6 text-gray-103'>
									<p className='mb-0 text-xl'>
										Drop in a question and we will get back to you!
									</p>
								</div>
								<div>
									<textarea
										rows={10}
										name='question'
										placeholder='Type your question or query here..'
										className='text-left placeholder-gray-101 bg-slate-100 outline-none px-3 pt-3 rounded-xl w-full overflow-hidden'
										required
									/>
								</div>
							</div>

							<div className='mt-6 text-right'>
								<button
									type='submit'
									className='bg-indigo-600 rounded text-white py-2 font-normal text-base px-5 tablet:mt-0 whitespace-nowrap h-min self-end'>
									Submit
								</button>
							</div>
						</form>
					)}
				</div>
			</WrapperComponent>
		),
		[id, email, isSuccess]
	);

	return (
		<div className='z-30 fixed bottom-2 right-2 md:bottom-20 lg:bottom-8 md:right-3 lg:right-8 mb-20 tablet:mb-0'>
			<Popover
				placement='topRight'
				content={popoverContent}
				open={popoverVisible}
				trigger='click'
				onOpenChange={handlePopoverVisibleChange}
				arrow={{ pointAtCenter: true }}
				overlayClassName='ask-question-popover-overlay'
				destroyOnHidden={false}>
				<Tooltip
					placement='left'
					title={"Stuck?"}
					open={popoverTooltipVisible && !popoverVisible}
					onOpenChange={handlePopoverTooltipVisibleChange}>
					<div
						className='flex cursor-pointer bg-indigo-600 rounded-full text-lg tablet:text-4xl text-white p-2 tablet:p-4'
						role='button'>
						<QuestionCircleOutlined className='m-auto' />
					</div>
				</Tooltip>
			</Popover>
		</div>
	);
};

export default React.memo(AskQuestionComponent);
