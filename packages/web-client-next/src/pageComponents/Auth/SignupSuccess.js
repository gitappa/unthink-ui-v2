import React from "react";
import Link from "next/link";
import { Result } from "antd";

export default function SignupSuccess({
	isICodeVerified = false,
	email,
	showSignInButton = false,
}) {
	return (
		<Result
			className='lg:w-2/4 mx-auto'
			status='success'
			title={<span className='text-white'>You are almost there!</span>}
			subTitle={
				isICodeVerified ? (
					<span className='text-white'>
						Please click the Sign In button below to continue.
					</span>
				) : (
					<span className='text-white'>
						Please click on the verification link sent to {email} to finish the
						registration process.
					</span>
				)
			}
			extra={
				showSignInButton && (
					<Link href='/signin'>
						<button className='bg-primary rounded text-white py-1 px-9 font-normal text-lg'>
							Sign In
						</button>
					</Link>
				)
			}
		/>
	);
}
