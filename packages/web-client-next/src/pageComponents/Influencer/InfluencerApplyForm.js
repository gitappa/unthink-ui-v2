// Not using
import React, { useState } from "react";
import { Form, Input, Result, Image, Row, Col, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import AuthHeader from "../AuthHeader";
import instagramIcon from "../../images/staticpageimages/instagramIcon.png";
import twitterIcon from "../../images/staticpageimages/twitterIcon.png";
import discordIcon from "../../images/staticpageimages/discordIcon.png";
import tiktokIcon from "../../images/staticpageimages/tik-tokIcon.png";
import twitchIcon from "../../images/staticpageimages/twitchIcon.png";
import facebookIcon from "../../images/staticpageimages/facebookIcon.png";
import { influencerAPIs } from "../../helper/serverAPIs";

const InfluencerApplyForm = () => {
	const [form] = Form.useForm();

	const [isSuccess, setIsSuccess] = useState(false);
	const [hasError, setHasError] = useState("");
	const [isApplying, setIsApplying] = useState(false);

	const onFinish = async (values) => {
		const {
			first_name,
			last_name,
			emailId,
			company_name,
			instagramUrl,
			twitterUrl,
			discordUrl,
			tiktokurl,
			twitchUrl,
			facebookUrl,
		} = values;

		const social_links = [];
		if (instagramUrl) {
			social_links.push({ type: "instagram", link: instagramUrl });
		}
		if (twitterUrl) {
			social_links.push({ type: "twitter", link: twitterUrl });
		}
		if (discordUrl) {
			social_links.push({ type: "discord", link: discordUrl });
		}
		if (tiktokurl) {
			social_links.push({ type: "tiktok", link: tiktokurl });
		}
		if (twitchUrl) {
			social_links.push({ type: "twitch", link: twitchUrl });
		}
		if (facebookUrl) {
			social_links.push({ type: "facebook", link: facebookUrl });
		}

		setIsApplying(true);
		const response = await influencerAPIs.influencerApplyCall({
			first_name,
			last_name,
			emailId,
			company_name,
			social_links,
		});

		if (response?.data?.status_code) {
			if (response.data.status_code === 200) {
				setHasError("");
				setIsSuccess(true);
			} else {
				setHasError(response?.data?.status_desc);
			}
		}

		setIsApplying(false);
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className='h-full min-h-screen bg-black-100'>
			<div className='auth-header-container'>
				<AuthHeader
					userTextLink={{
						text: "Sign In",
						to: "/signin",
					}}
				/>
			</div>
			<div className='w-full'>
				<div className='p-6 lg:p-16'>
					{!isSuccess ? (
						<>
							<h1 className='mx-auto text-2xl lg:text-4xl font-medium text-center text-white mb-6'>
								Join the network and start earning!
							</h1>
							<div className='lg:w-2/5 mx-auto'>
								<Form
									name='influencer'
									form={form}
									initialValues={{ remember: true }}
									onFinish={onFinish}
									onFinishFailed={onFinishFailed}
									autoComplete='off'>
									<Row gutter={[20, 0]}>
										<Col span={24} lg={12}>
											<Form.Item
												name='first_name'
												rules={[
													{
														required: true,
														message: "Please enter your first name!",
													},
												]}>
												<Input
													placeholder='Enter your first name'
													className='bg-transparent text-white'
												/>
											</Form.Item>
										</Col>
										<Col span={24} lg={12}>
											<Form.Item
												name='last_name'
												rules={[
													{
														required: true,
														message: "Please enter your last name!",
													},
												]}>
												<Input
													placeholder='Enter your last name'
													className='bg-transparent text-white'
												/>
											</Form.Item>
										</Col>
									</Row>
									<Form.Item
										name='emailId'
										rules={[
											{
												required: true,
												message: "Please enter your email!",
											},
										]}>
										<Input
											placeholder='Enter your email'
											className='bg-transparent text-white'
										/>
									</Form.Item>
									<Form.Item name='company_name'>
										<Input
											placeholder='Agency name (if applying through an agency) [or skip it]'
											className='bg-transparent text-white'
										/>
									</Form.Item>
									<h1 className='mx-auto text-2xl lg:text-2xl font-medium text-white mb-6'>
										Share your social profiles
									</h1>
									<Form.Item name='instagramUrl'>
										<div className='flex items-center'>
											<Image src={instagramIcon} preview={false} width='40px' />
											<Input
												placeholder='Enter your Instagram profile URL'
												className='bg-transparent text-white ml-5'
											/>
										</div>
									</Form.Item>
									<Form.Item name='twitterUrl'>
										<div className='flex items-center'>
											<Image src={twitterIcon} preview={false} width='40px' />
											<Input
												placeholder='Enter your Twitter profile URL'
												className='bg-transparent text-white ml-5'
											/>
										</div>
									</Form.Item>
									<Form.Item name='discordUrl'>
										<div className='flex items-center'>
											<Image src={discordIcon} preview={false} width='40px' />
											<Input
												placeholder='Enter your Discord profile URL'
												className='bg-transparent text-white ml-5'
											/>
										</div>
									</Form.Item>
									<Form.Item name='tiktokUrl'>
										<div className='flex items-center'>
											<Image src={tiktokIcon} preview={false} width='40px' />
											<Input
												placeholder='Enter your Tik-Tok profile URL'
												className='bg-transparent text-white ml-5'
											/>
										</div>
									</Form.Item>
									<Form.Item name='twitchUrl'>
										<div className='flex items-center'>
											<Image src={twitchIcon} preview={false} width='40px' />
											<Input
												placeholder='Enter your Twitch profile URL'
												className='bg-transparent text-white ml-5'
											/>
										</div>
									</Form.Item>
									<Form.Item name='facebookUrl'>
										<div className='flex items-center'>
											<Image src={facebookIcon} preview={false} width='40px' />
											<Input
												placeholder='Enter your Facebook profile URL'
												className='bg-transparent text-white ml-5'
											/>
										</div>
									</Form.Item>
									<p className='text-red-500'>{hasError}</p>
									<Form.Item>
										<div className='flex justify-center mt-4'>
											<Button
												htmlType='submit'
												type='primary'
												size='large'
												className='disabled:opacity-50 bg-primary border-none px-7 rounded flex text-white'
												disabled={isApplying}>
												<Spin
													className='pr-2'
													indicator={
														<LoadingOutlined
															style={{ fontSize: 20 }}
															className='text-white'
															spin
														/>
													}
													spinning={isApplying}
												/>
												Apply
											</Button>
										</div>
									</Form.Item>
								</Form>
							</div>
						</>
					) : (
						<div>
							<Result
								className='lg:w-2/4 mx-auto'
								status='success'
								title={<span className='text-white'>Thank you!</span>}
								subTitle={
									<span className='text-white'>
										We will send you an email when your application is
										processed!
									</span>
								}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default InfluencerApplyForm;
