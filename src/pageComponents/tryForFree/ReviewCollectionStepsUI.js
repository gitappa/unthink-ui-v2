import React from "react";
import { EditOutlined, ShoppingCartOutlined, SendOutlined } from "@ant-design/icons";
import { Steps } from "antd";
import header_aura from "../../images/chat/header_aura_image_transparent.png";

const ReviewCollectionStepsUI = ({
	currentView,
	STEPS,
	handleChangeView,
	disabledSteps = [],
	enableHelpStep = false,
	isSamskaraInstance,
}) => {

	const MobileViewStep = ({ text, step }) => (
		<div
			className={`flex items-center ${disabledSteps.includes(step)
				? "text-indigo-105 cursor-not-allowed"
				: "cursor-pointer"
				} ${currentView === step
					? "active bg-slat-103 py-0.75 px-3 rounded-full text-white"
					: ""
				}`}
			role='button'
			onClick={() => handleChangeView(step)}>
			{text}
		</div >
	);

	const steps = [
		// {
		// 	title: "Help",
		// 	icon: (
		// 		<img
		// 			src={header_aura}
		// 			className="rounded-full bg-orange-100 cursor-pointer"
		// 			alt="Help"
		// 		/>
		// 	),
		// 	onClick: () => handleChangeView(STEPS.HELP),
		// 	disabled: disabledSteps.includes(STEPS.HELP),
		// 	key: STEPS.HELP,
		// },
		{
			title: "Content",
			icon: <EditOutlined className="steps_icons" />,
			onClick: () => handleChangeView(STEPS.CONTENT),
			disabled: disabledSteps.includes(STEPS.CONTENT),
			key: STEPS.CONTENT,
		},
		{
			title: "Products",
			icon: <ShoppingCartOutlined className="steps_icons" />,
			onClick: () => handleChangeView(STEPS.PRODUCTS),
			disabled: disabledSteps.includes(STEPS.PRODUCTS),
			key: STEPS.PRODUCTS,
		},
		{
			title: "Publish",
			icon: <SendOutlined className="steps_icons" />,
			onClick: () => handleChangeView(STEPS.PUBLISH),
			disabled: disabledSteps.includes(STEPS.PUBLISH),
			key: STEPS.PUBLISH,
		},
	];

	// Custom progressDot function to add image above the dot and remove description
	const progressDotRender = (dot, { status, index }) => {
		const currentStep = steps[index];
		const isActive = currentView === currentStep.key;
		const isFinished = index < Object.values(STEPS).indexOf(currentView);

		return (
			<div style={{ position: "relative" }}>
				{/* Image displayed above the dot */}
				<div
					className={`steps-icon ${isActive ? "active" : ""} ${isFinished ? "finished" : ""}`}
					onClick={!currentStep.disabled ? currentStep.onClick : undefined}
				>
					{currentStep.icon}
				</div>
				{dot}
			</div>
		);
	};

	return (
		<>
			{/* Mobile View */}
			<div className='flex md:hidden mb-2'>
				<div className='flex text-indigo-103 mx-auto max-w-287 w-full my-3 justify-between text-base font-semibold mobile-view-steps'>
					<MobileViewStep text='Content' step={STEPS.CONTENT} />
					<div className='flex items-center'>{">"}</div>
					<MobileViewStep text='Products' step={STEPS.PRODUCTS} />
					<div className='flex items-center'>{">"}</div>
					<MobileViewStep text='Publish' step={STEPS.PUBLISH} />
				</div>
			</div>
			{/* <div className='hidden z-30 fixed top-0 left-0 lg:flex items-center min-h-screen h-full'>
				<div
					className={`grid grid-cols-1 gap-3 text-2xl text-white ${isSamskaraInstance ? "mt-36" : "mt-0"
						}`}>
					{enableHelpStep ? (
						<div
							className={`flex cursor-pointer collections-step ${currentView === STEPS.HELP ? "active" : ""
								} ${disabledSteps.includes(STEPS.HELP)
									? "bg-indigo-400"
									: "bg-indigo-600"
								}`}
							role='button'
							onClick={() => handleChangeView(STEPS.HELP)}>
							<div className='m-auto flex flex-col items-center p-2'>
								<img
									src={header_aura}
									className='rounded-full bg-orange-100 cursor-pointer'
								/>
							</div>
						</div>
					) : null}
				</div>
			</div> */}
			{/* Desktop View */}
			<div className="hidden md:flex items-center my-10 steps_bar_div">
				<div
					className={`w-full text-2xl text-white`}
				>
					<Steps
						className="w-full text-black-100"
						current={
							currentView === STEPS.HELP
								? -1
								: currentView === STEPS.CONTENTUserNotFound
									? 0
									: currentView === STEPS.PRODUCTS
										? 1
										: currentView === STEPS.PUBLISH
											? 2
											: Object.values(STEPS).indexOf(currentView)
						}
						progressDot={progressDotRender} // Use custom progressDot function
						labelPlacement="horizontal"
						size="small"
						direction="horizontal" // Horizontal direction for desktop
					>
						{steps.map((step) => (
							<Steps.Step
								key={step.key}
								title={step.title} // Title is kept to show the name of each step
								icon={null} // Icon handled in progressDotRender, so we remove it here
								onClick={step.onClick}
								disabled={step.disabled}
							/>
						))}
					</Steps>
				</div>
			</div>
		</>
	);
};

export default React.memo(ReviewCollectionStepsUI);
