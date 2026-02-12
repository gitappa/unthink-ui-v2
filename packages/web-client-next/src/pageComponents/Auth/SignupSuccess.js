import React from "react";
import Link from "next/link";
import { Result } from "antd";
import styles from "./authPage.module.scss";

export default function SignupSuccess({
	isICodeVerified = false,
	email,
	showSignInButton = false,
}) {
	return (
		<Result
			className={styles.signupSuccessResult}
			status='success'
			title={<span className={styles.signupSuccessTitle}>You are almost there!</span>}
			subTitle={
				isICodeVerified ? (
					<span className={styles.signupSuccessSubtitle}>
						Please click the Sign In button below to continue.
					</span>
				) : (
					<span className={styles.signupSuccessSubtitle}>
						Please click on the verification link sent to {email} to finish the
						registration process.
					</span>
				)
			}
			extra={
				showSignInButton && (
					<Link href='/signin'>
						<button className={styles.signupSuccessButton}>
							Sign In
						</button>
					</Link>
				)
			}
		/>
	);
}
