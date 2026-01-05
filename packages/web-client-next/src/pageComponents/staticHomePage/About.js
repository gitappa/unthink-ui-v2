import React from "react";
import Image from "next/image";
import {
	// TwitterOutlined,
	// FacebookFilled,
	LinkedinFilled,
} from "@ant-design/icons";

import styles from "./styles.module.css";

import hbar_foundation_logo from "../../images/newStaticPageImages/about/hbar_foundation_logo.svg";
import vtex_logo from "../../images/newStaticPageImages/about/vtex_logo.svg";
import usa_office_map from "../../images/newStaticPageImages/about/usa_office_map.png";

import person_1 from "../../images/newStaticPageImages/about/person_1.png";
import person_2 from "../../images/newStaticPageImages/about/person_2.png";
import person_3 from "../../images/newStaticPageImages/about/person_3.png";
import person_4 from "../../images/newStaticPageImages/about/person_4.png";
// import person_5 from "../../images/newStaticPageImages/about/person_5.png";
// import person_6 from "../../images/newStaticPageImages/about/person_6.png";
import person_7 from "../../images/newStaticPageImages/about/person_7.png";
// import person_8 from "../../images/newStaticPageImages/about/person_8.png";
// import person_9 from "../../images/newStaticPageImages/about/person_9.png";
// import person_10 from "../../images/newStaticPageImages/about/person_10.png";
// import person_11 from "../../images/newStaticPageImages/about/person_11.png";
import person_12 from "../../images/newStaticPageImages/about/person_12.png";
// import person_13 from "../../images/newStaticPageImages/about/person_13.png";
import person_14 from "../../images/newStaticPageImages/about/person_14.png";
import person_15 from "../../images/newStaticPageImages/about/person_15.png";
import person_16 from "../../images/newStaticPageImages/about/person_16.png";

const Person = ({ image, name, designation, linkedn }) => {
	return (
		<div className='flex flex-col items-center text-center'>
				<div className='relative h-40 w-40 md:w-200 md:h-200 lg:w-64 lg:h-64  '>
					<Image 
						src={image} 
						alt={name}
						fill
						style={{ objectFit: 'cover' }}
					/>
				</div>
			<div className='pt-8'>
				<h4 className='text-xl lg:text-xl-1.5 text-gray-103'>{name}</h4>
				<h5 className='text-base lg:text-xl text-lightgray-104 max-w-s-2'>
					{designation}
				</h5>
			</div>
			<div>
				{/* <TwitterOutlined className='text-slat-102 text-lg mx-2 cursor-pointer' />
				<FacebookFilled className='text-slat-102 text-base mx-2 cursor-pointer' /> */}
				{linkedn && (
					<a href={linkedn} target='_blank'>
						<LinkedinFilled className='text-slat-102 text-base mx-2 cursor-pointer' />
					</a>
				)}
			</div>
		</div>
	);
};

const About = () => {
	return (
		<div className='font-firaSans static_page_bg'>
			<section className='py-24 lg:py-32 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto'>
				<div className='max-w-340 md:max-w-screen-sm mx-auto text-center flex flex-col items-center'>
					<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal font-firaSans italic'>
						"We are here to un-think the{" "}
						<span className='whitespace-nowrap'>e-commerce</span> experience"
					</h1>
					<p className='text-lightgray-104 text-xl lg:text-xl-1.5 font-firaSans max-w-lg mx-auto'>
						We strive to bring the human touch to online discovery with the
						combination of AI and a network of real human experts
					</p>
				</div>
				<div className='text-white flex justify-center'>
					<div className='px-8'>
						<h5 className='text-base md:text-xl italic text-white text-center'>
							Backed By
						</h5>
					<Image src={hbar_foundation_logo} alt='hbar_foundation_logo' width={150} height={100} />
				</div>
				<div className='px-8'>
					<h5 className='text-base md:text-xl italic text-white text-center'>
						4th Batch
					</h5>
					<Image src={vtex_logo} alt='vtex_logo' width={150} height={100} />
					</div>
				</div>
			</section>
			<section className={`${styles.teams_container} py-10 lg:py-20`}>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-6xl mx-auto'>
					<h1 className='max-w-5xl mx-auto text-3xl lg:text-5xl lg:leading-54 text-gray-103 text-center lg:text-left'>
						Our Team
					</h1>
					<div className='grid gap-6 grid-cols-2 md:grid-cols-3 gap-y-11 lg:gap-y-24 pt-14 lg:pt-32'>
						<Person
							image={person_1}
							name='Tina Mani'
							designation='CEO & Cofounder'
							linkedn='https://www.linkedin.com/in/tinamani/'
						/>
						{/* <Person
							image={person_13}
							name='Sidharth Pillai'
							designation='Cofounder & Head of Sales'
							linkedn='https://www.linkedin.com/in/sidharth-pillai-6a908a3/'
						/> */}
						<Person
							image={person_14}
							name='Annie Hsu '
							designation='COO'
							linkedn='https://www.linkedin.com/in/annieahsu/'
						/>
						<Person
							image={person_2}
							name='Jisha Jose'
							designation='Cofounder & Head of Tech'
							linkedn='https://www.linkedin.com/in/jisha-jose-9ab4b2176/'
						/>
						<Person
							image={person_3}
							name='Sagar B'
							designation='UI Architect'
							linkedn='https://www.linkedin.com/in/sagar-b-a549a6228/'
						/>
						<Person
							image={person_7}
							name='Aditya Shinde'
							designation='Data Science and ML Engineer'
							linkedn='https://www.linkedin.com/in/aditya-shinde-88a16816b/'
						/>
						<Person
							image={person_4}
							name='Sreejitha V G'
							designation='Backend Engr'
							linkedn='https://www.linkedin.com/in/sreejitha-v-g-3502a3148/'
						/>
						{/* <Person
							image={person_5}
							name='Keerthana KS'
							designation='Devops'
							linkedn={
								"https://www.linkedin.com/in/keerthana-srinivasan-9a0397168/"
							}
						/>
						<Person
							image={person_6}
							name='Anjana Unni'
							designation='Community Manager'
							linkedn='https://www.linkedin.com/in/anjana-unni-986849115/'
						/> */}
					</div>
				</div>
			</section>
			<section className='teams_container mt-40 py-10 lg:py-20'>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-6xl mx-auto'>
					<h1 className='max-w-5xl mx-auto text-3xl lg:text-5xl lg:leading-54 text-gray-103 text-center lg:text-left'>
						Our Advisors
					</h1>
					<div className='grid gap-6 grid-cols-2 md:grid-cols-3 gap-y-11 lg:gap-y-24 pt-14 lg:pt-32'>
						{/* <Person
							image={person_8}
							name='George Brody'
							designation='Board Member & Advisor'
							linkedn='https://www.linkedin.com/in/georgebrodyprofile/'
						/> */}
						{/* <Person
							image={person_9}
							name='Mike Nelson'
							designation='Retail Expert & Advisor'
							linkedn='https://www.linkedin.com/in/michaelevan/'
						/>
						<Person
							image={person_10}
							name='Mark Skaggs'
							designation='Advisor & UX Consultant'
							linkedn='https://www.linkedin.com/in/markskaggs/'
						/>
						<Person
							image={person_11}
							name='Pratik Kodial'
							designation='Advisor'
							linkedn='https://www.linkedin.com/in/pratik-kodial'
						/> */}
						<Person
							image={person_12}
							name='Anto Thomas'
							designation='Angel Investor. Crypto, Finance & AI Expert Chief Data Officer @Canoo.'
							linkedn='https://www.linkedin.com/in/antothomas'
						/>
						<Person
							image={person_15}
							name='Tamara Budz'
							designation='Marketer, Board Member, MBA Coach'
							linkedn='https://www.linkedin.com/in/tamarabudz/'
						/>
						<Person
							image={person_16}
							name='Luis Cabrera'
							designation='EVP Corporate Strategy @Western Spirits, ex-BCG'
							linkedn='https://www.linkedin.com/in/luiscabrera/'
						/>
					</div>
				</div>
			</section>
			<section className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto mt-11 pb-28 lg:pb-64'>
				<h1 className='text-3xl lg:text-5xl lg:leading-54 text-gray-103 mb-6 lg:mb-16'>
					Our offices
				</h1>
				<a
					className='flex p-0 relative w-full h-96'
					href='https://goo.gl/maps/37FwTDYgqopaV5Ju6'
					target='_blank'>
					<Image 
						className='w-full' 
						src={usa_office_map} 
						alt='usa_office_map'
						fill
						style={{ objectFit: 'cover' }}
					/>
				</a>
				<div className='block lg:flex pt-6 lg:pt-16'>
					<div className='max-w-s-1 mr-14 py-2 lg:py-0'>
						<span className='text-base text-lightgray-101'>
							USA
							<br /> 18291 Meandering Way, Dallas TX 75252, USA
						</span>
					</div>
					<div className='max-w-s-2 mr-14 py-2 lg:py-0'>
						<span className='text-base text-lightgray-101'>
							India
							<br />
							No 13 New Express City Complex, Above SBI, NR road, Near Townhall,
							Bengaluru 560002
						</span>
					</div>
					<div className='max-w-s-1 mr-14 py-2 lg:py-0'>
						<span className='text-base text-lightgray-101'>
							Contact Us
							<br /> Email:{" "}
							<a className='hover:text-current' href='mailto:info@unthink.ai'>
								info@unthink.ai
							</a>
						</span>
					</div>
				</div>
			</section>
		</div>
	);
};

export default About;
