import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const BannerKisok = ({products}) => {
    const Tags = ['#Look Book', '#Social Media', '#Trending Collections']
    const [showTags, setShowTags] = useState(Tags[0])
    const router = useRouter();
    
    const dummyProducts = products.filter(x=>x.cover_image)
    const handleNavCollection =(Singlecollectiondata)=>{
      router.push(`/kioskcollections/${Singlecollectiondata.path}`)
    
      
    }
    return (
        <div className='mt-5'>
            {/* Tag Buttons */}
            <div className='flex items-center mb-8'>
                {Tags.map((tag, i) => (
                    <button
                        key={i}
                        className={`${showTags === tag ? 'bg-black text-white shadow-md py-3 px-4 rounded-3xl' : 'bg-gray-100 shadow text-gray-500 px-3 py-3 rounded-3xl'} font-semibold mr-5`}
                        onClick={() => setShowTags(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Banner Section */}
            <div className='bg-black rounded-3xl p-8 md:p-12 flex items-center justify-between overflow-hidden relative'>
                {/* Left Content */}
                <div className='flex-1 z-10'>
                    <p className='text-yellow-600 text-sm font-bold tracking-widest mb-4'>EXCLUSIVE COLLECTION</p>
                    <h2 className='text-white text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight'>
                        Discover Our<br />Finest Pieces
                    </h2>
                    <p className='text-gray-300 text-base mb-8 max-w-sm'>
                        Explore 29 handcrafted jewelry pieces. Try them on virtually.
                    </p>
                    <button className='flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition'>
                        <span>✓</span>
                        <span>SHOP NOW</span>
                        <span>→</span>
                    </button>
                </div>

                {/* Right Content - Products Grid */}
                <div className='flex-1 flex justify-end items-center gap-4 ml-8'>
                    <div className='grid grid-cols-3 gap-3 md:gap-4'>
                        {dummyProducts.map((product) => (
                            <div
                                key={product.collection_id}
                                className={`w-24 h-24 md:w-32 md:h-32  rounded-lg shadow-lg flex items-center justify-center text-white text-xs font-semibold opacity-90 hover:opacity-100 transition cursor-pointer`}
                            >
                              {/* <Link href={`/kioskcollections/${product.path}`}> */}
                              {product.cover_image && <img src={product.cover_image} className='rounded-xl' alt={product.cover_image} onClick={()=>handleNavCollection(product)} /> }
                              {/* </Link> */}
                          
                             {/* <p>  Product {product.collection_name} </p>  */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Element */}
                <div className='absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none'>
                    <div className='w-full h-full bg-gradient-to-br from-yellow-400 to-transparent rounded-full'></div>
                </div>
            </div>
        </div>
    )
}

export default BannerKisok 