import React, { useEffect, useMemo, useRef, useState } from "react";
import { Result, Popover, Tooltip } from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";

import { generateOnContactFormSubmit } from "../../helper/utils";

import styles from './AskQuestionComponent.module.css';

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

	const popoverContent = useMemo(
		() => (
			<WrapperComponent>
				<div>
					{isSuccess ? (
						<Result
							className={styles.successResultWrapper}
							status='success'
							title={<span className={styles.successTitle}>Thanks for submitting!</span>}
							subTitle={
								<span className={styles.successSubtitle}>
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
								<p className={styles.formHeader}>
									<span className={`${styles.formTitle} ellipsis_1`}>
										Stuck?
									</span>
									<CloseOutlined
										id='ask_question_close_icon'
										onClick={() => handlePopoverVisibleChange(false)}
										className={styles.closeIcon}
									/>
								</p>
							</div>

							<div>
								<div className={styles.formContentWrapper}>
									<p className={styles.formDescription}>
										Drop in a question and we will get back to you!
									</p>
								</div>
								<div>
									<textarea
										rows={10}
										name='question'
										placeholder='Type your question or query here..'
										className={styles.formTextarea}
										required
									/>
								</div>
							</div>

							<div className={styles.submitWrapper}>
								<button
									type='submit'
									className={styles.submitButton}>
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
		<div className={styles.wrapper}>
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
						className={styles.triggerButton}
						role='button'>
						<QuestionCircleOutlined className={styles.triggerIcon} />
					</div>
				</Tooltip>
			</Popover>
		</div>
	);
};

export default React.memo(AskQuestionComponent);

