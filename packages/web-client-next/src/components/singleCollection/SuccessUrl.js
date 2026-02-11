import Link from "next/link";
import React from "react";
import AuthPage from "../../pageComponents/Auth/AuthPage";
import UserVerified from "../../pageComponents/Auth/UserVerified";
import { Result } from "antd";
import styles from "./StatusUrl.module.css";

const SuccessUrl = () => {
	return (
		<div className={`static_page_bg ${styles.statusContainer}`} style={{ minHeight: '100vh' }}>
			{/* <Link to="/">
            <button className="font-normal text-xl text-white ml-6 mt-3 ">Home</button>
            </Link> */}
			<Result
				className={styles.resultWrapper}
				status='success'
				title={<span className={styles.textWhite}>Payment successfully Completed </span>}
				subTitle={
					<>
						{/* <p className='text-white m-0'>
									Thank you. Your email has been verified.
								</p>
								<p className='text-white'>You can now proceed to sign in.</p> */}
					</>
				}
				extra={
					<Link href='/'>
						<button className={styles.homeButton}>
							Home
						</button>
					</Link>
				}
			/>
		</div>
	);
};

export default SuccessUrl;
