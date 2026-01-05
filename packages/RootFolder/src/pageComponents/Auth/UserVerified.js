import React from "react";
import { Result } from "antd";

import AuthHeader from "../AuthHeader";
import Link from "next/link";

const UserVerified = () => {
	return (
		<div className='h-screen static_page_bg'>
			<div className='auth-header-container'>
				<AuthHeader
					userTextLink={{
						text: "Sign In",
						to: "/signin",
					}}
				/>
			</div>
			<div className='flex auth-container'>
				<div className='w-full'>
					<Result
						className='lg:w-2/4 mx-auto'
						status='success'
						title={<span className='text-white'>Verification Success!</span>}
						subTitle={
							<>
								<p className='text-white m-0'>
									Thank you. Your email has been verified.
								</p>
								<p className='text-white'>You can now proceed to sign in.</p>
							</>
						}
						extra={
							<Link href='/signin'>
								<button className='bg-primary rounded text-white py-1 px-9 font-normal text-lg'>
									Sign In
								</button>
							</Link>
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default UserVerified;
