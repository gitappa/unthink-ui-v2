import Link from "next/link";
import React from "react";
import AuthPage from "../../pageComponents/Auth/AuthPage";
import UserVerified from "../../pageComponents/Auth/UserVerified";
import { Result } from "antd";

const SuccessUrl = () => {
    return (
        <div className=" static_page_bg overflow-hidden " style={{minHeight:'100vh'}}>
            {/* <Link to="/">
            <button className="font-normal text-xl text-white ml-6 mt-3 ">Home</button>
            </Link> */}
        <Result
						className='lg:w-2/4 mx-auto'
						status='success'
						title={<span className='text-white'>Payment successfully Completed </span>}
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
							<button className='bg-primary rounded text-white py-1 px-9 font-normal text-lg'>
								Home
							</button>
						</Link>
					}
					/>
        </div>
    );
};

export default SuccessUrl;
