import React from 'react'
import Image from "next/image";
import img1 from "./images/newmen.png";
import menimage from "./images/suv.jpg";
import qrcode from "./images/qrcode.svg";
import legs from "./images/shoes.jpg";
import robo from "./images/Robo2.svg";

import men from "./images/image.png";

import ai from "./images/sparkle.svg";

const SplitDiscoverySection = () => {
  return (
    <div className="mt-20">
      <h2 className="text-4xl font-semibold ">DISCOVER HIDDEN TREASURES</h2>
      <div className="flex mt-6  h-700  gap-7 w-full">
        <div className="flex gap-4 w-full   " style={{ height: 700 }}>
          <div className="  w-4/5">
            <Image
              src={men}
              className=" w-full rounded-xl mb-3 "
              style={{ height: "50%" }}
            />
            <Image
              src={menimage} width={100} height={100}
              className="  w-full rounded-xl "
              style={{ height: "40%" }}
            />
          </div>

          <div className=" w-4/5">
            <Image
              src={menimage} width={100} height={100}
              className=" w-full rounded-xl   "
              style={{ height: "40%" }}
            />
            <Image
              src={img1}
              className=" w-full rounded-xl mt-3"
              style={{ height: "50%" }}
            />
          </div>
        </div>

        <div className="w-full  text-white">
          <div style={{ minHeight: 455 }} className=" flex  gap-3 relative   border-secondary border-3 rounded-xl bg-gradient-to-r from-gray-101 to-secondary p-5 2xl:p-6 ">
            <div className="w-full flex justify-between flex-col">
              <p className='text-center'>
                Uncover rare finds, exclusive styles, and pieces you won’t see everywhere. Your next favorite is waiting—just beneath the surface.
                Step into a world of carefully curated gems. Discover hidden treasures crafted to stand out.
              </p>
              <div className='m-auto text-center '>
                <Image
                  src={qrcode}
                  alt="qrcode"
                  className="rounded-xl mt-4 mb-2 w-25 2xl:w-40 2xl:h-40 h-25 bg-white"
                  width={100}
                  height={100}
                />
                <p className='text-lg'>Scan to Join</p>
              </div>
            </div>
            <div className="w-full">
              <h3 className="xl:text-3xl 2xl:text-4xl font-semibold text-center ">CHALLENGE  & EARN</h3>
              <Image
                src={legs}
                alt="show"
                className="rounded-xl mt-3 w-40 h-40 xl:h-48 2xl:h-56 2xl:w-56 xl:w-48 absolute bottom-0 right-0"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r p-6 relative mt-5 items-center  flex gap-5 from-purple-102 rounded-xl  to-purple-101  border-purple-102 border-3 ">
            <Image
              src={robo} width={100} height={100}
              alt="ai stylist "
              className="  mt-3 w-25 h-25 "
            />
            <h3 className="text-3xl font-semibold">ASK AI STYLIST </h3>
            <Image
              src={ai}
              width={40}
              height={40}
              alt="ai stylist "
              className="  mt-3 w-7 h-7 absolute right-3 top-2 "
            />
            {/* <Image
                src={ai}
                width={50}
                height={50}
                alt="ai stylist "
                className="  mt-3 w-9 h-9 absolute right-1 -bottom-2  z-20"
              /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplitDiscoverySection