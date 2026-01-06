import React from "react";
import { Image } from "antd";
import Shoppers from "../../images/staticpageimages/shopper/Shoppers.png";
import PersonalShoppersImg from "../../images/videos/PersonalShoppers.mp4";
import styles from '../../style/staticPages/personalShopper.module.scss';
import Link from "next/link";

const PersonalShoppers = () => {
	return (
		<div className='container m-auto unthink-personal-shopper'>
			<div className='grid md:grid-cols-2 my-10 gap-x-14'>
				<div>
					<p className='text-3xl font-semibold tracking-wide'>
						Shopping Experts &&nbsp;Influencers
					</p>
					<div className='font-medium text-gray-500 text-base'>
						<p>
							We are building a community of shopping experts & influencers.
						</p>
						<p>
							Apply to enroll in our personal shopping network if you have
							exquisite taste and want to be rewarded to help people shop. You
							do this in the comfort of your home, with our shopper assistant
							app, where you get notified about people looking for your expert
							help.
						</p>
						<p>
							All you do is suggest products from brands in our network that
							match their taste. If they buy, you earn commissions.
						</p>
						<p>
							Create shopping collections easily with the help of Aura, your
							personal virtual concierge, and share a link with your social
							network.
						</p>
						<p>
							Build your following and earn commissions when people buy from
							your collections.
						</p>
						<p className='font-bold'>
							Sign up now and gain early access to our premium unthinker reward
							program!
						</p>
					<Link href='/signup' className='p-0'>
							<button className='py-3 px-6 bg-primary font-bold text-white text-base mt-5 rounded-sm'>
								Sign Up/Sign In
							</button>
						</Link>
					</div>
				</div>
				<div className='flex justify-center items-center'>
					<div className='h-200px'>
						<Image src={Shoppers} preview={false} height={"100%"} />
					</div>
				</div>
			</div>
			{/* VIDEO  */}

			<video controls loop muted id='video'>
				<source src={PersonalShoppersImg} type='video/mp4' />
			</video>
			<div className='unthink-personal-shopper__btn'>
				<a
					href='mailto:info@unthink.ai?subject=Brand enquiry&body=I would like to know more about monetizing my content through a store powered by Unthink.'
					target='_blank'
					rel='noopener noreferrer'>
					<button className='py-3 px-6 bg-primary font-bold text-white text-base mt-5 rounded-sm'>
						Join as an Expert
					</button>
				</a>
			</div>
		</div>
	);
};

export default PersonalShoppers;
