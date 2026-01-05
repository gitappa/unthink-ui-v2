import { Result } from "antd";
import Link from "next/link";
import React from "react";

const FailureUrl = () => {
    return (
        // <div className="min-h-screen flex items-center justify-center bg-gray-100">
        //     <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        //         <h1 className="text-2xl font-semibold text-red-600 mb-3">
        //             Payment Failed
        //         </h1>

        //         <p className="text-gray-700 mb-1">
        //             Oops! Your payment could not be processed.
        //         </p>

        //         <p className="text-sm text-gray-500 mb-6">
        //             Please try again or use a different payment method.
        //         </p>
        //         <Link to="/">
        //             <button
        //                 onClick={() => window.history.back()}
        //                 className="bg-black text-white bg-blue-109 px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
        //             >
        //                 Try Again
        //             </button>
        //         </Link>
        //     </div>
        // </div>


      <div className=" static_page_bg overflow-hidden " style={{minHeight:'100vh'}}>
            {/* <Link to="/">
            <button className="font-normal text-xl text-white ml-6 mt-3 ">Home</button>
            </Link> */}
        <Result
						className='lg:w-2/4 mx-auto'
						status='success'
						title={<span className='text-white'> Payment Failed </span>}
						subTitle={
							<>
								<p className='text-white m-0'>
									  Oops! Your payment could not be processed.
								</p>
								<p className='text-white'>You can now proceed to sign in.</p>
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

export default FailureUrl;
