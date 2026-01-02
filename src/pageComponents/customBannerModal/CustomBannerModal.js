import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Upload, Spin } from "antd";
import { PictureOutlined } from "@ant-design/icons";

import Modal from "../../components/modal/Modal";
import { updateWishlist } from "../wishlistActions/updateWishlist/redux/actions";
import { profileAPIs } from "../../helper/serverAPIs";
import { getFinalImageUrl } from "../../helper/utils";
// import { COLLECTION_COVER_IMG_SIZES } from "../../constants/codes";

const { Dragger } = Upload;

const defaultProductData = {
	url: "",
	image: "",
	type: "DEFAULT",
};

const CustomBannerModal = ({
	modalHeaderText = "Add banner",
	isModalOpen,
	onModalClose,
	collectionData,
}) => {
	const [formData, setFormData] = useState({
		...defaultProductData,
	});
	const [formError, setFormError] = useState("");
	const [isUploading, setIsUploading] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (isModalOpen) {
			if (collectionData?.sponsor_details?.banner?.image) {
				const banner = collectionData.sponsor_details.banner;
				setFormData(() => ({
					...formData,
					image: banner.image,
					url: banner.url,
					type: banner.type,
				}));
			}

			return () => {
				setFormData({
					...defaultProductData,
				});
			};
		}

		return () => { };
	}, [isModalOpen]);

	const validateProductForm = useCallback((data) => {
		let errorMEssage = "";

		if (!data.image) {
			errorMEssage = "Please upload the banner image to continue.";
		}

		setFormError(() => errorMEssage);

		return !errorMEssage;
	}, []);

	const handleProductDataInputChange = useCallback(
		(e) => {
			if (e.target) {
				const { name, value } = e.target;

				setFormData((data) => {
					const newData = {
						...data,
						[name]: value,
					};
					formError && validateProductForm(newData);

					return newData;
				});
			}
		},
		[formError, validateProductForm]
	);

	const handleBannerImageChange = useCallback(
		(value = "") => {
			setFormData((data) => {
				const newData = {
					...data,
					image: value,
				};
				formError && validateProductForm(newData);

				return newData;
			});
		},
		[formError, validateProductForm]
	);

	const handleFormDataSubmit = (e) => {
		e.preventDefault();
		if (validateProductForm(formData)) {
			const editPayload = {
				_id: collectionData._id,
				attributesData: {
					sponsor_details: {
						...(collectionData.sponsor_details || {}),
						banner: {
							image: formData.image,
							url: formData.url,
							type: formData.type,
						},
					},
				},
				fetchUserCollection: true,
			};

			dispatch(updateWishlist(editPayload));
			onModalClose();
		}
	};

	const handleRemoveBannerSubmit = (e) => {
		e.preventDefault();
		if (validateProductForm(formData)) {
			const editPayload = {
				_id: collectionData._id,
				attributesData: {
					sponsor_details: {
						...(collectionData.sponsor_details || {}),
						banner: {},
					},
				},
				fetchUserCollection: true,
			};

			dispatch(updateWishlist(editPayload));
			onModalClose();
		}
	};

	const uploadProps = useMemo(
		() => ({
			accept: "image/*",
			multiple: false,
			customRequest: async (info) => {
				try {
					setIsUploading(true);
					if (info?.file) {
						const response = await profileAPIs.uploadImage({
							file: info.file,
							type: "collection_banner_image",
							// custom_size: COLLECTION_COVER_IMG_SIZES,
						});
						if (response?.data?.data && response.data.data[0]) {
							handleBannerImageChange(response.data.data[0].url); // API call and updating local state with updated value
						}
					}
				} catch (error) {
					setFormError(
						() =>
							"Failed to upload cover image. Please upload different image or try again later."
					);
				}
				setIsUploading(false);
			},
		}),
		[handleBannerImageChange]
	);

	const RequiredLabel = ({ children, ...props }) => (
		<label className='text-base' {...props}>
			{children} <span className='text-red-600'>*</span>
		</label>
	);

	return (
		<Modal
			isOpen={isModalOpen}
			headerText={modalHeaderText}
			onClose={onModalClose}
			size='md'>
			<div>
				<form onSubmit={handleFormDataSubmit}>
					<div className='mb-4'>
						<h2 className='text-lg font-semibold'>
							Fill these details to add your own banner with redirection link on
							click!
						</h2>
					</div>
					<div className='grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-8'>
						<div className='tablet:col-span-2'>
							<RequiredLabel className='text-base'>Banner image</RequiredLabel>
							{/* set max height to 224 */}
							{isUploading ? (
								<div
									 
									className='flex items-center justify-center'>
									<Spin className='flex' size='large' />
								</div>
							) : (
								<>
									{formData.image ? (
										<div className='grid  '>
											<img
												className='w-full object-cover rounded '
												style={{
													 
												}} 
												src={getFinalImageUrl(formData.image)}
											/>
											<button
												type='button'
												className='text-indigo-600 text-base underline mt-2 justify-self-center'
												onClick={() => handleBannerImageChange("")}>
												Upload new image
											</button>
										</div>
									) : (
										<Dragger
											className=' w-full px-4 rounded-2xl'										 
											{...uploadProps}	
											name='banner_image'
											showUploadList={false}>
											<p className='ant-upload-drag-icon mb-1' >
												<PictureOutlined />
											</p>
											<p className='ant-upload-text text-sm lg:text-base lg:mb-1 mb-0'>
												Click or drag a file to this area to add a banner image
											</p>
											<p className='ant-upload-text text-sm'>
												(Recommended size : 1200 * 300)
											</p>
										</Dragger>
									)}
								</>
							)}
						</div>

						<div className="mt-9">
							<RequiredLabel className='text-base'>
								Redirection page URL
							</RequiredLabel>
							<input
								className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
								placeholder='Enter redirection page URL'
								name='url'
								type='url'
								value={formData.url}
								onChange={handleProductDataInputChange}
								required
							/>
						</div>

						<div className='tablet:col-span-2 text-center'>
							<p className='text-red-600 text-lg'>{formError}</p>
						</div>

						<div className='tablet:col-span-2 text-right'>
							{collectionData?.sponsor_details?.banner?.image ? (
								<button
									type='button'
									className='text-indigo-400 border-2 border-indigo-400 rounded-xl font-bold text-sm h-12 min-w-38 mr-4'
									onClick={handleRemoveBannerSubmit}>
									Remove banner
								</button>
							) : null}
							<button
								type='submit'
								className='bg-indigo-600 rounded-xl text-indigo-100 font-bold text-sm min-w-38 h-12'>
								Submit
							</button>
						</div>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default React.memo(CustomBannerModal);
