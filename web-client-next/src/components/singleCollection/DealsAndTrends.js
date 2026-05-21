import React from 'react'

const DealsAndTrends = () => {
  return (
    <div className="flex justify-between items-center mt-25 gap-5">
      <div className="w-full text-center">
        <div className="bg-yellow-100 rounded-15 p-4 w-full">
          <h3 className="text-4xl leading-10 font-semibold text-amber-800">FLAT 15% OFF</h3>
          <p className="text-lg leading-7">On orders above  <strong>₹1999</strong></p>
        </div>
        <div className="bg-yellow-100 rounded-15 p-4 w-full mt-3">
          <h3 className="text-4xl leading-10 font-semibold text-amber-800">FLAT 15% OFF</h3>
          <p className="text-lg leading-7">On orders above  <strong>₹1999</strong></p>
        </div>
      </div>

      <div className="flex justify-center h-screen">
        <div className="w-[2px] bg-gray-400"></div>
      </div>

      <div className="w-full text-white">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-[3px] h-[3px] rounded-full bg-pink-400 opacity-60" style={{ boxShadow: '0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)' }}></div>
          <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{ boxShadow: '0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)' }}></div>
          <div className="w-2 h-4 rounded-full bg-pink-500" style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.9), 0 0 50px rgba(168, 85, 247, 0.6), 0 0 75px rgba(168, 85, 247, 0.3)' }}></div>
          <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{ boxShadow: '0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)' }}></div>
          <div className="w-[3px] h-[3px] rounded-full bg-pink-400 opacity-60" style={{ boxShadow: '0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)' }}></div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-center px-3">
          <div className="summer-vibes p-3 rounded-full font-semibold border-2">
            #SummerVibes
          </div>
          <div className="bg-rose-800 border-rose-400 border-2 p-3 rounded-full font-semibold text-white">
            #CyberPunk
          </div>
          <div className="bg-teal-800 border-cyan-300 border-2 p-3 rounded-full font-semibold text-white">
            #EcoFriendly
          </div>
          <div className="bg-green-900 border-green-400 border-2 p-3 rounded-full font-semibold text-white">
            #EcoFriendly
          </div>
          <div className="bg-amber-900 border-amber-600 border-2 p-3 rounded-full font-semibold text-white">
            #SummerCrops
          </div>
          <div className="bg-slate-800 border-blue-300 border-2 p-3 rounded-full font-semibold text-white">
            #BrandStran
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-[3px] h-[3px] rounded-full bg-pink-400 opacity-60" style={{ boxShadow: '0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)' }}></div>
          <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{ boxShadow: '0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)' }}></div>
          <div className="w-2 h-4 rounded-full bg-pink-500" style={{ boxShadow: '0 0 40px rgba(244, 114, 182, 1), 0 0 70px rgba(244, 114, 182, 0.95), 0 0 100px rgba(244, 114, 182, 0.8), 0 0 130px rgba(244, 114, 182, 0.6)' }}></div>
          <div className="w-2 h-2.5 rounded-full bg-pink-500 opacity-75" style={{ boxShadow: '0 0 20px rgba(244, 114, 182, 0.8), 0 0 35px rgba(244, 114, 182, 0.5)' }}></div>
          <div className="w-[3px] h-[3px] rounded-full bg-pink-400 opacity-60" style={{ boxShadow: '0 0 15px rgba(244, 114, 182, 0.7), 0 0 25px rgba(244, 114, 182, 0.4)' }}></div>
        </div>
      </div>
    </div>
  )
}

export default DealsAndTrends