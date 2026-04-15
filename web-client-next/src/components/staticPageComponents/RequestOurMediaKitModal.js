import React, { useEffect } from "react";
import { Modal, Input } from "antd";

import { generateOnContactFormSubmit } from "../../helper/utils";

const RequestOurMediaKitModal = ({
	formId,
	showModal,
	onCloseModal,
	email = "",
}) => {
	useEffect(() => {
		if (showModal) {
			document
				.getElementById(formId)
				?.addEventListener("submit", generateOnContactFormSubmit(formId));
			document.getElementById(formId)?.addEventListener("submit", onCloseModal);

			return () => {
				document
					.getElementById(formId)
					?.removeEventListener("submit", generateOnContactFormSubmit(formId));
				document
					.getElementById(formId)
					?.removeEventListener("submit", onCloseModal);
			};
		}

		return () => {};
	}, [showModal]);

	return (
		<Modal
			title='Request our media kit'
			open={showModal}
			onCancel={onCloseModal}
			footer={null}
			// okButtonProps={{ className: "hidden" }}
		>
			{showModal && (
				<form id={formId}>
					<div>
						<label>Email</label>
						<Input
							className='h-12 rounded-md hover:border-opacity-0'
							placeholder='Enter your email'
							name='email'
							type='text'
							required
							defaultValue={email}
						/>

						<input name='contact_number' type='hidden' />
						<input
							name='page_url'
							type='hidden'
							value={window?.location?.href}
						/>
						<input name='page_section' type='hidden' value={formId} />
					</div>
					<div className='mt-2'>
						<label>Your brand website</label>
						<Input
							className='h-12 rounded-md hover:border-opacity-0'
							placeholder='Enter your your brand website'
							name='website'
							type='text'
							required
						/>
					</div>
					<div className='mt-2'>
						<label className='block'>Your goals</label>
						<input
							type='radio'
							required
							id='brand-awareness'
							name='goals'
							value='Brand awareness'
						/>
						<label for='brand-awareness'> Brand awareness</label>
						<br />
						<input
							type='radio'
							required
							id='Conversions'
							name='goals'
							value='Conversions'
						/>
						<label for='Conversions'> Conversions</label>
						<br />
						<input type='radio' required id='both' name='goals' value='Both' />
						<label for='both'> Both</label>
					</div>
					<div className='mt-2'>
						<label className='block'>Payment model: Check all that apply</label>
						<input
							type='checkbox'
							id='payment-model-cpc'
							name='payment-model-cpc'
							value='CPC'
						/>
						<label for='payment-model-cpc'> CPC</label>
						<br />
						<input
							type='checkbox'
							id='payment-model-per-content'
							name='payment-model-per-content'
							value='Fee per editorial content'
						/>
						<label for='payment-model-per-content'>
							{" "}
							Fee per editorial content
						</label>
						<br />
						<input
							type='checkbox'
							id='payment-model-commissions'
							name='payment-model-commissions'
							value='Commissions on Conversion'
						/>
						<label for='payment-model-commissions'>
							{" "}
							Commissions on Conversion
						</label>

						<div className='mt-2 text-right'>
							<button
								type='submit'
								className='w-40 text-xs md:text-sm bg-indigo-600 border-none rounded-md py-3 px-3.5 h-12 font-bold text-white'>
								Submit
							</button>
						</div>
					</div>
				</form>
			)}
		</Modal>
	);
};

export default RequestOurMediaKitModal;
