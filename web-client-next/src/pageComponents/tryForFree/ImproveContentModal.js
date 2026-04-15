import React, { useCallback, useEffect, useState } from "react";

import Modal from "../../components/modal/Modal";
import { isEmpty } from "../../helper/utils";

const ImproveContentModal = ({
	isOpen,
	regenerate_desc,
	description,
	tags,
	onClose,
	onContinue,
}) => {
	const [data, setData] = useState({});

	const handleInputChange = useCallback((e) => {
		const { name, value } = e.target;
		setData((data) => ({ ...data, [name]: value }));
	}, []);

	useEffect(() => {
		if (isOpen) {
			return () => {
				setData({}); // clear user_instruction textarea when open modal
			};
		}

		return () => { };
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			headerText={`Improve ${regenerate_desc ? "Content" : "Keywords"}`}
			// maskClosable={false}
			contentWrapperSpacingClassName='p-4'
			size='x-sm'
			headerTextSpacingClassName='p-2.5'
			headerTextClassName='text-xl font-medium'
			closeClassName='text-xl'>
			<form>
				<div
					className={`grid grid-cols-1 ${(regenerate_desc && description) ||
							(!regenerate_desc && !isEmpty(tags))
							? "md:grid-cols-2"
							: "md:grid-cols-1"
						} gap-4`}>
					{regenerate_desc ? (
						description ? (
							<div>
								<label className='text-base text-black-100 block mb-0.75'>
									Current Content
								</label>
								<div className='bg-slate-100 rounded-xl p-3 min-h-165 h-auto whitespace-pre-line'>
									{description}
								</div>
							</div>
						) : null
					) : !isEmpty(tags) ? (
						<div>
							<label className='text-base text-black-100 block mb-0.75'>
								Current Keywords
							</label>
							<div className='flex flex-wrap gap-2 overflow-auto pt-3'>
								{tags.map((tag) => (
									<div
										key={tag}
										className={`flex items-center rounded-md shadow px-2 py-0.75 sm:px-4 w-max min-h-27 bg-lightgray-104 break-word-only`}>
										<span
											level={5}
											className={`m-0 font-normal text-xs md:text-sm text-white`}>
											{tag}
										</span>
									</div>
								))}
							</div>
						</div>
					) : null}
					<div className='flex flex-col'>
						<label className='text-base text-black-100 block mb-0.75'>
							{` How can I improve the ${regenerate_desc ? "Content" : "Keywords"
								}`}
						</label>
						<div className='bg-slate-100 rounded-xl h-full'>
							<textarea
								className='text-left placeholder-gray-101 bg-slate-100 outline-none px-3 pt-3 rounded-xl w-full min-h-165 h-full resize-none overflow-y-auto'
								placeholder='What else would you like to share that will help me support your search? I work best with more context.'
								name='user_instruction'
								value={data?.user_instruction}
								onChange={handleInputChange}
							/>
						</div>
					</div>
				</div>

				<div className='flex justify-end gap-2 mt-2'>
					<button
						className='rounded-xl text-indigo-100 font-bold text-xs md:text-sm py-2 px-4.5 bg-indigo-600'
						onClick={onClose}>
						Cancel
					</button>
					<button
						type='submit'
						className='rounded-xl text-indigo-100 font-bold text-xs md:text-sm py-2 px-4.5 bg-indigo-600'
						onClick={(e) => onContinue(e, data?.user_instruction)}>
						Continue
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default React.memo(ImproveContentModal);
