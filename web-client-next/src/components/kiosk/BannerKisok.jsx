import React, { useState } from 'react'

const BannerKisok = () => {
    const Tags =['#Look Book','#Social Media','#Trending Collections']
    const [showTags,setShowTags] = useState(Tags[0])
  return (    <div className='mt-5 flex items-center '>
        {Tags.map((tag,i)=>(
            <button key={i} className={`${showTags ===tag  ? 'bg-black text-white shadow-md py-3 rounded-3xl': 'bg-gray-100 shadow text-gray-500'} rounded-2xl  p-2  mr-5 `} onClick={()=>setShowTags(tag)}>{tag}</button>
        ))}
    </div>
  )
}

export default BannerKisok