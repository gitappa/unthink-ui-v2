import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Upload, Tooltip, Spin, notification, Image } from "antd";
import { Loading3QuartersOutlined, FileAddOutlined } from "@ant-design/icons";

import AuthHeader from "../AuthHeader";
import { profileAPIs } from "../../helper/serverAPIs";

import "./onboarding.module.scss";

const { Dragger } = Upload;

const OnboardingPage = (props) => {
	const [csvFileUrl, setCsvFileUrl] = useState(null);
	const [isUploading, setIsUploading] = useState("");
	// const referrer = props.location.state?.referrer;
	// const venlyRegistered = !!props.location.state?.venlyRegistered;
	// const venlyWalletConnected = !!props.location.state?.venlyWalletConnected;

	const [authUser] = useSelector((state) => [state.auth.user]);

	// useEffect(() => {
	// 	if (Object.keys(authUser.data).length) {
	// 		if (!authUser.data.emailId) {
	// 			shared_profile_on_root ? navigate("/") : navigate("/store/");
	// 		}
	// 	}
	// }, [authUser.data]);

	const uploadProps = useMemo(
		() => ({
			accept: "csv/*",
			multiple: false,
			customRequest: async (info) => {
				try {
					setIsUploading(true);
					if (info?.file) {
						const response = await profileAPIs.uploadCSV_APICall({
							file: info.file,
						});
						if (response?.data?.data && response.data.data[0]) {
							console.log("upload csv response : ", response);
							setCsvFileUrl(response.data.data[0]); // API call and updating local state with updated value
						}
					}
				} catch (error) {
					notification["error"]({
						message: "Failed to upload file. Please try again",
					});
				}
				setIsUploading(false);
			},
		}),
		[]
	);

	const isLoading = authUser.fetching || isUploading;

	return (
		<div className='onboarding-page-container h-screen static_page_bg'>
			<div className='auth-header-container'>
				<AuthHeader hideProfile />
			</div>
			<div className='auth-container'>
				<div className='w-full p-6 lg:p-16 flex items-center flex-col'>
					<h1 className='text-5xl text-white tracking-widest_6'>
						Upload catalog
					</h1>

					<h2 className='text-xl text-white mt-6'>
						You are all set to upload your catalog and do broad data analysis of
						the products
					</h2>
				</div>
				<div className='flex flex-col px-2 gap-6'>
					<Dragger
						className='flex w-full max-w-480 min-h-228 p-2 rounded-2xl mx-auto border-separate bg-transparent'
						{...uploadProps}
						name='csv_file'
						showUploadList={false}>
						<div className='flex flex-col gap-4'>
							{csvFileUrl ? (
								<p className='text-white text-base max-w-287 break-words mx-auto'>
									file selected: {csvFileUrl.name}
								</p>
							) : (
								<>
									<FileAddOutlined className='text-white text-7xl' />
									<p className='text-white text-base'>
										Click or drag a file to this area to upload a CSV
									</p>
								</>
							)}
						</div>
					</Dragger>
					<span className='text-white mx-auto text-xl'>OR</span>
					<div className='mx-auto w-full max-w-480'>
						<input
							type='url'
							name='csv'
							className='w-full px-2 rounded-lg h-10 placeholder-gray-500'
							placeholder='Enter your CSV file URL here'
						/>
					</div>
					<div className='mx-auto flex flex-col gap-8 tablet:flex-row pt-6'>
						<button className='bg-indigo-500 p-4 text-xl rounded-xl text-white max-w-287'>
							Broad analysis of the CSV products
						</button>
						<button className='bg-indigo-500 p-4 text-xl rounded-xl text-white max-w-287'>
							Broad analysis of the CSV products
						</button>
					</div>
					<div className='mx-auto flex flex-col gap-8 tablet:flex-row pt-6'>
						<p className='text-lg text-white'>
							<a
								className='underline p-0'
								href='https://s3-us-west-1.amazonaws.com:443/cem.3816.docs/unthink_main_2023/EMS_shareasale_june13_dgejgxx.csv'
								download='sample_catalog_CSV'>
								Download
							</a>{" "}
							sample catalog CSV file
						</p>
					</div>
				</div>
			</div>
			{isLoading && (
				<div className='absolute top-0 left-0 flex justify-center items-center w-full h-full backdrop-filter backdrop-contrast-75'>
					<Spin
						indicator={
							<Loading3QuartersOutlined
								className='flex text-6xl-1 text-indigo-100'
								spin
							/>
						}
					/>
				</div>
			)}
		</div>
	);
};

export default OnboardingPage;
