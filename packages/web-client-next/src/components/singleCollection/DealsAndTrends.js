import React from 'react'
import Image from "next/image";
import menimage2 from "./images/menImage2.jpg";
import menimage3 from "./images/menimage3.jpg";
import menimage from "./images/menimage.jpg";
import im from "./images/pppp.webp";

const DealsAndTrends = () => {
  return (
  <div className="flex justify-between items-center mt-25 gap-4">
          <div className="grid grid-cols-2 text-white gap-5  border-gray-101    w-full">
            <div className="bg-blue-100 flex flex-col rounded-lg border-2 border-blue-300 h-32 justify-center items-center">
              <Image src={menimage3} alt="" className="h-16 w-16 mb-1" />
              <p>MEN</p>
            </div>
            <div className="bg-pink-200 flex flex-col  rounded-lg border-2 border-pink-400  h-32  justify-center items-center">
              <Image src={menimage2} alt="" className="h-16 w-16 mb-1" />
              <p>WOMEN</p>
            </div>
            <div className="border-blue-300 flex flex-col rounded-lg border-2  h-32 bg-blue-100 justify-center items-center">
              <Image src={menimage} alt="" className="h-16 w-16 mb-1" />
              <p>ACCESSORIES</p>
            </div>
            <div className="bg-pink-200 flex flex-col  rounded-lg border-2 border-pink-400 h-32  justify-center items-center ">
              <Image src={im} alt="" className="h-16 w-16 mb-1" />
              <p>SALE</p>
            </div>
          </div>
          <div
            className=" flex w-full justify-center"
            style={{ height: "-webkit-fill-available" }}
          >
            <div className="w-[2px] bg-gray-101"></div>
          </div>
  
          <div className="w-full text-white">
            <div className="grid grid-cols-2 gap-x-2 gap-y-3 ">
              <div className="p-3 rounded-full border-2 border-violet-500 bg-violet-100">
                #SummerVideo
              </div>
              <div className="p-3 rounded-full border-2 border-white  bg-gradient-to-r from-purple-300 via-orange-400 to-red-300 ">
                #Cyber punk
              </div>
              <div className="p-3 rounded-full  border-2 border-yellow-400   bg-yellow-102">
                #EgoFriendly
              </div>
              <div className="p-3 rounded-full  border-2 border-green-600   bg-green-400">
                #EgoFriendly
              </div>
              <div className="p-3 rounded-full  border-2 border-slate-700 bg-slate-500">
                #SummerCors
              </div>
              <div className="p-3 rounded-full border-2 border-teal-700  bg-teal-500">
                #BrandStan
              </div>
            </div>
          </div>
        </div>
  )
}

export default DealsAndTrends