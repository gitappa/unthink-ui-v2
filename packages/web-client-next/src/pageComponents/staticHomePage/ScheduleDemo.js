import React, { useEffect } from "react";
import { Input } from "antd";

import { generateOnScheduleDemoSubmit } from "../../helper/utils";

// const initialData = {
// 	first_name: "",
// 	last_name: "",
// 	business_email: "",
// 	phone: "",
// 	company: "",
// 	country: "",
// };

const scheduleDemoFormId = "schedule-demo-form";

export const ScheduleDemo = () => {
	// const [scheduleDemoData, setScheduleDemoData] = useState(initialData);

	const onSuccessSubmit = () => {
		// clearEmailInput();
	};

	useEffect(() => {
		document
			.getElementById(scheduleDemoFormId)
			?.addEventListener(
				"submit",
				generateOnScheduleDemoSubmit(scheduleDemoFormId, true, onSuccessSubmit)
			);
		return () => {
			document
				.getElementById(scheduleDemoFormId)
				?.removeEventListener(
					"submit",
					generateOnScheduleDemoSubmit(
						scheduleDemoFormId,
						true,
						onSuccessSubmit
					)
				);
		};
	}, []);

	// const handleScheduleDemoDataChange = useCallback(
	// 	(name, value) => {
	// 		setScheduleDemoData({ ...scheduleDemoData, [name]: value });
	// 	},
	// 	[scheduleDemoData]
	// );

	// const submitScheduleDemoData = useCallback(() => {
	// 	console.log("scheduleDemoData::", scheduleDemoData);
	// }, [scheduleDemoData]);

	// const isSubmitDisabled =
	// 	isEmpty(scheduleDemoData.first_name) ||
	// 	isEmpty(scheduleDemoData.business_email);

	return (
		<div className='font-firaSans'>
			<section
				className='w-full grid grid-cols-1 lg:grid-cols-2 h-screen border-t-4 border-b-4'
				style={{ borderTopColor: "#111827", borderBottomColor: "#222F44" }}>
				<div className='publisher_first_container flex justify-center items-center bg-blue-110'>
					<div className='mx-auto text-center px-4 sm:px-0 flex gap-4 flex-col'>
						<h1 className='text-3xl lg:text-5xl text-gray-103 font-normal'>
							Join the Revolution
						</h1>

						<p className='max-w-lg text-lightgray-104 text-lg lg:text-xl-1.5'>
							Discover the future of retail with unthink.ai. Empower your
							business with the perfect blend of AI and human touch. Join us in
							transforming the consumer experience.
						</p>
						<p className='max-w-lg text-lightgray-104 text-lg lg:text-xl-1.5'>
							To Learn more Request a Demo/
							<span className='whitespace-nowrap'>Schedule a meeting</span>
						</p>
					</div>
				</div>

				<div className='bg-blue-106 flex justify-center items-center'>
					<form id={scheduleDemoFormId}>
						<div className='mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8'>
							<div className='col-span-2 sm:col-auto'>
								<div className='flex justify-between mb-0.75'>
									<label className='text-base text-gray-103 block'>
										<span className='text-red-200'>*</span> First name
									</label>
								</div>
								<Input
									className='outline-none px-3 h-10 rounded-xl w-full'
									placeholder='Enter your first name'
									name='first_name'
									required
									// value={scheduleDemoData.first_name}
									// onChange={(e) =>
									// 	handleScheduleDemoDataChange("first_name", e.target.value)
									// }
								/>
							</div>

							<div className='col-span-2 sm:col-auto'>
								<div className='flex justify-between mb-0.75'>
									<label className='text-base text-gray-103 block'>
										Last name
									</label>
								</div>
								<Input
									className='outline-none px-3 h-10 rounded-xl w-full'
									placeholder='Enter your last name'
									name='last_name'
									// value={scheduleDemoData.last_name}
									// onChange={(e) =>
									// 	handleScheduleDemoDataChange("last_name", e.target.value)
									// }
								/>
							</div>

							<div className='col-span-2 sm:col-auto'>
								<div className='flex justify-between mb-0.75'>
									<label className='text-base text-gray-103 block'>
										<span className='text-red-200'>*</span> Business email
									</label>
								</div>
								<Input
									className='outline-none px-3 h-10 rounded-xl w-full'
									placeholder='Enter your business email'
									name='business_email'
									// value={scheduleDemoData.business_email}
									// onChange={(e) =>
									// 	handleScheduleDemoDataChange("business_email", e.target.value)
									// }
								/>
							</div>

							<div className='col-span-2 sm:col-auto'>
								<div className='flex justify-between mb-0.75'>
									<label className='text-base text-gray-103 block'>Phone</label>
								</div>
								<Input
									type='text'
									className='outline-none px-3 h-10 rounded-xl w-full'
									placeholder='Enter your phone number'
									name='phone'
									// value={scheduleDemoData.phone}
									// onChange={(e) =>
									// 	handleScheduleDemoDataChange("phone", e.target.value)
									// }
								/>
							</div>

							<div className='col-span-2 sm:col-auto'>
								<div className='flex justify-between mb-0.75'>
									<label className='text-base text-gray-103 block'>
										Company
									</label>
								</div>
								<Input
									className='outline-none px-3 h-10 rounded-xl w-full'
									placeholder='Enter your company name'
									name='company'
									// value={scheduleDemoData.company}
									// onChange={(e) =>
									// 	handleScheduleDemoDataChange("company", e.target.value)
									// }
								/>
							</div>

							<div className='col-span-2 sm:col-auto'>
								<div className='flex justify-between mb-0.75'>
									<label className='text-base text-gray-103 block'>
										Country
									</label>
								</div>
								<Input
									className='outline-none px-3 h-10 rounded-xl w-full'
									placeholder='Enter country name'
									name='country'
									// value={scheduleDemoData.country}
									// onChange={(e) =>
									// 	handleScheduleDemoDataChange("country", e.target.value)
									// }
								/>
							</div>

							<div className='col-span-2 text-right'>
								<input type='hidden' name='to_name' value='' />
								<input type='hidden' name='from_name' value='' />
								<input type='hidden' name='message' value='' />
								<input type='hidden' name='reply_to' value='' />
								<button
									className={`text-gray-103 text-xs md:text-sm rounded-xl py-2.5 px-7 h-full font-bold bg-indigo-600`}
									type='submit'
									// onClick={submitScheduleDemoData}
									// disabled={isSubmitDisabled}
								>
									Get in touch
								</button>
							</div>
						</div>
					</form>
				</div>
			</section>
		</div>
	);
};
