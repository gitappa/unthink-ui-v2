import React, { useState } from 'react'

const CollectionPage = ({params}) => {
    // console.log(params);

  const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches']
  const [activeCategory, setActiveCategory] = useState('All')
//   console.log('colleztctionData',collectionData);
  

  return (
    <div className='p-8 md:p-12 bg-white min-h-screen'>
      {/* Header */}
      <div className='mb-8'>
        <p className='text-gray-400 text-sm font-semibold tracking-widest mb-3'>JEWEL GENIE</p>
        <h1 className='text-4xl md:text-5xl font-serif font-bold text-black mb-2'>Our Collection</h1>
        <p className='text-gray-500 text-base'>16 pieces</p>
      </div>

      {/* Category Filters */}
      <div className='flex items-center gap-3 mb-12 flex-wrap'>
        {categories.map((category, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(category)}
            className={`${
              activeCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            } px-5 py-3 rounded-full font-semibold text-sm transition duration-200`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid Placeholder */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className='bg-gray-100 rounded-lg h-48 md:h-56 flex items-center justify-center'>
            <span className='text-gray-400 font-semibold'>Product {item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CollectionPage