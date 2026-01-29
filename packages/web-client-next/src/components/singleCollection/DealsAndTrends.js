import React from 'react'
import Image from "next/image";
import menimage2 from "./images/menImage2.jpg";
import menimage3 from "./images/menimage3.jpg";
import menimage from "./images/menimage.jpg";
import im from "./images/pppp.webp";

const DealsAndTrends = () => {
  return (
  <div className="flex justify-between items-center mt-25 gap-5">
          {/* <div className="grid grid-cols-2 text-white gap-5  border-gray-101    w-full">
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
          </div> */}
          <div className='w-full text-center '>
            <div className='  rounded-15 p-4 w-full' style={{background:'#F2E5CB'}}>
              <h3 className='text-4xl font-semibold text-amber-800 '>FLAT 15% OFF</h3>
              <p className='text-lg '>On orders above  <strong>₹1999</strong></p>
            </div>
            <div className=' mt-3 rounded-15 p-4 w-full' style={{background:'#F2E5CB'}}>
              <h3 className='text-4xl font-semibold text-amber-800 '>FLAT 15% OFF</h3>
              <p className='text-lg '>On orders above  <strong>₹1999</strong></p>
            </div>
          </div>
          
          <div
            className=" flex  justify-center"
            style={{ height: "-webkit-fill-available" }}
          >
            <div className="w-[2px] bg-gray-101"></div>
          </div>
  
          <div className="w-full text-white">
            {/* Decorative dots above */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-60" style={{boxShadow:'0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)'}}></div>
              <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{boxShadow:'0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)'}}></div>
              <div className="w-2 h-4 rounded-full bg-pink-500 opacity-100" style={{boxShadow:'0 0 30px rgba(168, 85, 247, 0.9), 0 0 50px rgba(168, 85, 247, 0.6), 0 0 75px rgba(168, 85, 247, 0.3)'}}></div>
              <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{boxShadow:'0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)'}}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-60" style={{boxShadow:'0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)'}}></div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-center px-3">
              <div className="p-3 rounded-full font-semibold border-2 summer-vibes"  >
                #SummerVibes
              </div>
              <div style={{background:'#8E3B5B',borderColor:'#D77A9C'}} className="p-3 rounded-full font-semibold border-2">
                #CyberPunk
              </div>
              <div style={{background:'#2F6F7A',borderColor:'#6FB5C1'}} className="p-3 rounded-full font-semibold border-2">
                #EcoFriendly
              </div>
              <div style={{background:'#3F6B3F',borderColor:'#7FB27F'}} className="p-3 rounded-full font-semibold border-2">
                #EcoFriendly
              </div>
              <div style={{background:'#6A4A2F',borderColor:'#B8926B'}} className="p-3 rounded-full font-semibold border-2">
                #SummerCrops
              </div>
              <div style={{background:'#3E4F7A',borderColor:'#8FA0D6'}} className="p-3 rounded-full font-semibold border-2">
                #BrandStran
              </div>
            </div>

            {/* Decorative dots below */}
             <div className="flex justify-center items-center gap-2 mt-6">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-60" style={{boxShadow:'0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)'}}></div>
              <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{boxShadow:'0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)'}}></div>
              <div className="w-2 h-4 rounded-full bg-pink-500 opacity-100" style={{boxShadow:'0 0 40px rgba(244, 114, 182, 1), 0 0 70px rgba(244, 114, 182, 0.95), 0 0 100px rgba(244, 114, 182, 0.8), 0 0 130px rgba(244, 114, 182, 0.6)'}}></div>
              <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{boxShadow:'0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)'}}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-60" style={{boxShadow:'0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)'}}></div>
            </div>
          </div>
        </div>
  )
}

export default DealsAndTrends