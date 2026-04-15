import React from "react";
import { useRouter } from "next/router";

import AuthHeader from "../AuthHeader";
import NeedHelpSection from "./NeedHelpSection";
import SignupFormSection from "./SignupFormSection";
import SignInFormSection from "./SignInFormSection";

import styles from './authPage.module.scss';
import CreateAccountSection from "./CreateAccountSection";

export default function AuthPage(props) {
	const router = useRouter();
	const pathname = router?.pathname || "";
	const normalizedPathname = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

	const isSignUpPage = React.useMemo(
		() => normalizedPathname === "/signup",
		[normalizedPathname]
	);
	// console.log('isSignUpPage',isSignUpPage );


	const isCreateAccount = React.useMemo(
		() => normalizedPathname === "/create-account",
		[normalizedPathname]
	);

	// console.log('isSignUpPagea',isSignUpPage);
	// console.log(isCreateAccount);
	// console.log((isSignUpPage || isCreateAccount));
	// console.log(!isSignUpPage);


	return (
		<div className={`static_page_bg ${styles.authPageRoot}`}>
			<div className={styles.authHeaderContainer}>
				<AuthHeader
					userTextLink={{
						text: (isSignUpPage || isCreateAccount) ? "Sign In" : undefined,
						to: (isSignUpPage || isCreateAccount) ? "/signin" : undefined,
					}}
					hideProfile={!isSignUpPage && !isCreateAccount}
				/>
			</div>
			<div className={styles.authContainer}>
				{/* <div className='w-3/5 hidden lg:block need-help-section-container'>
					<NeedHelpSection />
				</div>
				<div className='lg:w-2/5 w-full bg-gray-100'></div> */}
				<div className={styles.contentWrapper}>
					{isSignUpPage ? <SignupFormSection /> : isCreateAccount ? <CreateAccountSection /> : <SignInFormSection />}
				</div>
			</div>
		</div>
	);
}
