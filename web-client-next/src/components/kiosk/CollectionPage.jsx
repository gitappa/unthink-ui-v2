import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInfluencerCollection } from "../../pageComponents/Influencer/redux/actions";
import ProductCard from "../singleCollection/ProductCard";
import { filterAvailableProductList, filterProductListBySelectedTags } from "../../helper/utils";

const CollectionPage = ({ params }) => {
  // console.log(params);
  const dispatch = useDispatch();
  const [isTagsShowMoreActive, setIsTagsShowMoreActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const singleCollectionKiosk = useSelector(
    (state) => state.auth.user.singleCollections.data,
  ); // Update based on your Redux store structure
  const handleTagClick = useCallback((value) => {
    setActiveCategory(value);
    setSelectedTags(value === "All" ? [] : [value]);
  }, []);

    const productsData = useMemo(() => {
      let list = filterAvailableProductList(singleCollectionKiosk.product_lists);
  
      if (selectedTags.length) {
        list = filterProductListBySelectedTags(
          list,
          selectedTags,
          singleCollectionKiosk.tag_map,
        );
      }
      // list = sponsorProductList.concat(list);
  
      return  list;
    }, [
      singleCollectionKiosk.product_lists,
      singleCollectionKiosk.tag_map,
      selectedTags,
      
    ]);
    // console.log('productsData',productsData);
    

  // console.log("singleCollectionKiosk", singleCollectionKiosk.product_lists);
  const tagsToShow = useMemo(() => {
    const allTag = ["All"];
    const allTags = singleCollectionKiosk.tags
      ? allTag.concat(singleCollectionKiosk.tags)
      : allTag;
    return isTagsShowMoreActive ? allTags : allTags;
  }, [singleCollectionKiosk.tags, isTagsShowMoreActive]);

  useEffect(() => {
    if (params?.collection_name) {
      dispatch(
        getInfluencerCollection({
          collection_id: params.collection_name,
          path: params.collection_name,
          isStoreHomePage: false,
          product_sort_by: undefined,
          product_sort_order: undefined,
        }),
      );
    }
  }, [params?.collection_name, dispatch]);
  //   console.log('colleztctionData',singleCollectionKiosk);
  const productCardKiosk = (productdata) => {
    // console.log(productdata);
    return <ProductCard product={productdata} />
  }

  return (
    <div className="p-8 md:p-12 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-3 lg:mb-8">
        <p className="text-gray-400 text-sm lg:text-base font-semibold tracking-widest mb-3">
          JEWEL GENIE
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl  font-bold text-black mb-0 lg:mb-2">
          {singleCollectionKiosk.collection_name}
        </h1>
        <p className="text-gray-500 text-base lg:mb-0 mb-2">
          {singleCollectionKiosk?.product_lists?.length} pieces
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 mb-5 lg:mb-12 flex-wrap">
        {tagsToShow.map((tag, i) => (
          <button
            key={i}
            onClick={() => handleTagClick(tag)}
            className={`${
              activeCategory === tag
                ? 'bg-black text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            } lg:px-5 px-3 py-2 lg:py-3 rounded-full font-semibold text-[12px] lg:text-sm transition duration-200`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Product Grid Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
       {productsData?.map((item) => (
          <div
            key={item}
            className=" rounded-lg  flex items-center justify-center"
          >
            {productCardKiosk(item)}
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default CollectionPage;
