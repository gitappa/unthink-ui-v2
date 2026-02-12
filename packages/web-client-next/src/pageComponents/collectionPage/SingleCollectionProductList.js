import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Checkbox, Collapse, Select } from "antd";
import styles from '../../components/singleCollection/collectionDetails.module.scss'
import { handleRecProductClick } from "../recommendations/redux/actions";
import {
  getSingleUserCollection,
  getUserCollection,
  getUserInfo,
  GuestPopUpShow,
} from "../Auth/redux/actions";
import ProductCard from "../../components/singleCollection/ProductCard";
import share_icon from "../../images/profilePage/share_icon.svg";
// import share_icon from "../../components/singleCollection/images/";

import {
  checkIsFavoriteCollection,
  collectionQRCodeGenerator,
  filterAvailableProductList,
  filterProductListBySelectedTags,
  generateRoute,
  getBlogCollectionPagePath,
  getFinalImageUrl,
  setCookie,
} from "../../helper/utils";
import {
  PUBLISHED,
  WISHLIST_TITLE,
  favorites_collection_name,
  PRODUCT_SORT_OPTIONS,
  COOKIE_TT_ID,
  SIGN_IN_EXPIRE_DAYS,
  GUESTSKIP_EXPIRE_HOURS,
} from "../../constants/codes";
import { gTagCollectionProductClick } from "../../helper/webTracker/gtag";
import AskAuraCard from "../../components/singleCollection/AskAuraCard";
import { addToWishlist } from "../wishlistActions/addToWishlist/redux/actions";
import {
  current_store_name,
  isStagingEnv,
  is_store_instance,
  super_admin,
} from "../../constants/config";
import {
  openWishlistModal,
  setIsCreateWishlist,
  setProductsToAddInWishlist,
} from "../wishlist/redux/actions";
import ReactPlayer from "react-player/lazy";
import Addmore from "../../images/addmore.svg";
import GuestPopUp from "../Auth/GuestPopUp";
import { authAPIs } from "../../helper/serverAPIs";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import SwiperCore, { FreeMode } from "swiper";
import ShareOptions from "../shared/shareOptions";
import Image from "next/image";

// Initialize Swiper modules
SwiperCore.use([FreeMode]);

const { Option } = Select;

const tagsMinSizeForShowMore = 5;

const SingleCollectionProductList = ({
  blogCollectionPage = {},
  enableClickTracking = false,
  pageUser,
  authUser,
  isUserLogin,
  showCollectionDetails = false,
  productCountToShow,
  isPageLoading,
  showTagsSelection = false, // show tags above products and alow select and filter
  enableSelectTags = false, // allow to select tags to view the related products
  showCoverImage = true, // flag to show the cover image as first tile if available
  showAuraTile = false, // flag to show an extra last tile at the end with ask aura
  isSingleCollectionSharedPage = false,
  showUserImage = false,
  user_name,
  profile_image,
  selectedSortOption,
  handleSortOptionChange,
  sharePageUrl,
  isRootPage = true,
}) => {
  console.log(sharePageUrl);

  const router = useRouter();
  const [statedata, setStatedata] = useState(null);
  console.log("statedatssa", blogCollectionPage);

  const dispatch = useDispatch();
  const navigate = useCallback((path) => router.push(path), [router]);

  const [isGuestPopUpShow, singleCollection, influencerCollections] =
    useSelector((state) => [
      state.GuestPopUpReducer.isGuestPopUpShow,
      state.auth.user.singleCollections.data,
      state.auth.user.data,
    ]);
  const [showShareCollection, setShowShareCollection] = useState(false);


  console.log("isSingleCollectionSharedPage", isSingleCollectionSharedPage);
  console.log("singleCollectionaaaaaa", singleCollection);

  useEffect(() => {
    if (singleCollection) {
      setStatedata(singleCollection);
    }
  }, []);
  const collectionId = singleCollection?._id ?? null;

  // Dispatch getSingleUserCollection when collectionId is available

  const [selectedTags, setSelectedTags] = useState([]);
  const initializedFor = useRef(null);

  const tagsShowMoreEnabled = useMemo(
    () =>
      !!(
        blogCollectionPage.tags &&
        blogCollectionPage.tags.length > tagsMinSizeForShowMore
      ),
    [blogCollectionPage.tags],
  );
  const [isTagsShowMoreActive, setIsTagsShowMoreActive] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [enableSelectProduct, setEnableSelectProduct] = useState(false);

  const tagsToShow = useMemo(() => {
    const allTag = ["All"];
    const allTags = singleCollection.tags
      ? allTag.concat(singleCollection.tags)
      : allTag;
    return isTagsShowMoreActive ? allTags : allTags;
  }, [singleCollection.tags, isTagsShowMoreActive]);

  const sponsorProductList = useMemo(
    () =>
      (singleCollection.sponsor_details?.product_list || []).map((p) => {
        p.sponsored = true;
        return p;
      }),
    [blogCollectionPage.sponsor_details],
  );

  const [expanded, setExpanded] = useState(false);
  const [showMoreEnabled, setShowMoreEnabled] = useState(false);

  const textRef = useRef(null);
  const productsData = useMemo(() => {
    const baseList = isSingleCollectionSharedPage
      ? singleCollection?.product_lists ||
      blogCollectionPage?.product_lists ||
      []
      : blogCollectionPage?.product_lists ||
      singleCollection?.product_lists ||
      [];

    let list = filterAvailableProductList(baseList);

    if (selectedTags.length) {
      list = filterProductListBySelectedTags(
        list,
        selectedTags,
        singleCollection.tag_map,
      );
    }
    list = sponsorProductList.concat(list);

    return productCountToShow ? list.slice(0, productCountToShow) : list;
  }, [
    singleCollection.product_lists,
    singleCollection.tag_map,
    selectedTags,
    sponsorProductList,
  ]);
  useEffect(() => {
    const checkTextOverflow = () => {
      if (!expanded) {
        const el = textRef.current;
        if (el) {
          setShowMoreEnabled(el.scrollHeight > el.clientHeight);
        }
      }
    };

    const timeoutId = setTimeout(checkTextOverflow, 100);
    window.addEventListener("resize", checkTextOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTextOverflow);
    };
  }, [blogCollectionPage?.description, expanded, productsData]);
  // console.log('popopop',el.scrollHeight);
  // console.log('dfdfdfd',el.clientHeight);







  const showcasedProductsData = useMemo(
    () =>
      isSingleCollectionSharedPage ? productsData.filter((p) => p.starred) : [],
    [isSingleCollectionSharedPage, productsData],
  );

  const autoProductsData = useMemo(() => {
    return isSingleCollectionSharedPage
      ? productsData.filter((p) => !p.starred)
      : [];
  }, [isSingleCollectionSharedPage, productsData]);

  // console.log("isSingleCollectionSharedPage", isSingleCollectionSharedPage);
  const [activeTab, setActiveTab] = useState("products"); // default = Products tab

  useEffect(() => {
    if (autoProductsData.length === 0) {
      setActiveTab("faq");
    } else {
      setActiveTab("products");
    }
  }, [autoProductsData]);

  // checking selected tag's products is all selected or not
  const isTagProductsAllSelected = useMemo(() => {
    if (productsData) {
      return productsData.every((item) =>
        selectedProducts.includes(item.mfr_code),
      );
    }
  }, [productsData, selectedProducts]);

  // checking selected tag products is minimum one selected or not
  const isTagProductSelected = useMemo(() => {
    if (productsData) {
      return productsData.some((item) =>
        selectedProducts.includes(item.mfr_code),
      );
    }

    return false;
  }, [productsData, selectedProducts]);

  const handleResetSelectProduct = useCallback(
    // reset select product feature // unselect every products
    () => {
      setEnableSelectProduct(false);
      setSelectedProducts([]);
    },
    [],
  );

  const handleSetSelectedProducts = useCallback(
    ({ add = [], remove = [] }) => {
      const products = selectedProducts;
      const allProducts = singleCollection.product_lists?.map(
        (p) => p.mfr_code,
      ); // all Products

      products.push(...add); //add products

      const filteredRemoveProducts = products.filter(
        (p) => !remove.includes(p),
      ); // remove products

      const uniqueSelectedProducts = filteredRemoveProducts.filter(
        (p, index) => filteredRemoveProducts.indexOf(p) === index,
      ); // removing duplicate products

      setSelectedProducts(
        uniqueSelectedProducts.filter((p) => allProducts.includes(p)), // remove products which is not available in allProductsList and set selectedProducts
      );
    },
    [selectedProducts, singleCollection],
  );

  // removing products from selectedProducts if remove suggestion tag data
  useEffect(() => {
    if (selectedProducts) {
      handleSetSelectedProducts({});
    }
  }, [singleCollection]);

  const onSelectProductClick = (mfr_code) => {
    if (selectedProducts.includes(mfr_code)) {
      handleSetSelectedProducts({ remove: [mfr_code] });
    } else {
      handleSetSelectedProducts({ add: [mfr_code] });
    }
  };

  const onSelectAllChange = () => {
    let productsToShow = productsData.map((p) => p.mfr_code);

    if (isTagProductsAllSelected) {
      handleSetSelectedProducts({ remove: productsToShow });
    } else {
      handleSetSelectedProducts({ add: productsToShow });
    }
    // setSelectedProducts(
    // 	selectedProducts.length < chatProductsDataToShow.length
    // 		? chatProductsDataToShow.map((i) => i.mfr_code)
    // 		: []
    // );
  };

  const [isPopupShow, setIsPopupShow] = useState(false);

  // console.log("isPopupShow", isPopupShow);

  const onAddSelectedProductsToCollection = () => {
    const isUserLoginCokkies = Cookies.get("isGuestLoggedIn") === "true";
    // const isGuestUserSkip = Cookies.get('isGuestSkip') === 'true';
    if (!isUserLogin && !isUserLoginCokkies) {
      setIsPopupShow(true);
      dispatch(GuestPopUpShow(true));
      return;
    }

    const SelectedProductsData = singleCollection.product_lists?.filter((p) =>
      selectedProducts.includes(p.mfr_code),
    );

    dispatch(setProductsToAddInWishlist(SelectedProductsData));
    dispatch(openWishlistModal());
    if (isUserLoginCokkies) {
      dispatch(setIsCreateWishlist(true));
    }
    handleResetSelectProduct();
  };

  // guest email functions

  const [guestData, setGuestData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({ email: "" });

  const guestChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setGuestData((data) => ({ ...data, [name]: value }));
      if (errors.email) setErrors({ ...errors, email: "" }); // Clear error when user starts typing
    },
    [errors],
  );

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGuestSkip = () => {
    // Cookies.set('isGuestSkip', true, { expires: GUESTSKIP_EXPIRE_HOURS / 24 });
    dispatch(GuestPopUpShow(false));
    setIsPopupShow(false);
  };

  const handleGuestSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!guestData.email) {
        setErrors({ email: "Email is required" });
        return;
      }

      if (!validateEmail(guestData.email)) {
        setErrors({ email: "Please enter a valid email address" });
        return;
      }

      const tid = Cookies.get("tid");
      const store = current_store_name;

      // Set default value of isGuestLoggedIn to false if not already set
      if (!Cookies.get("isGuestLoggedIn")) {
        Cookies.set("isGuestLoggedIn", false, { expires: SIGN_IN_EXPIRE_DAYS });
      }

      if (validateEmail(guestData.email)) {
        try {
          const res = await authAPIs.GuestRegisterAPICall({
            emailId: guestData.email,
            user_id: tid,
            store,
          });

          const { data } = res;
          const user_id = data.data.user_id;

          if (res.data.status_code === 200) {
            dispatch(GuestPopUpShow(false));
            setCookie(COOKIE_TT_ID, user_id, SIGN_IN_EXPIRE_DAYS);
            dispatch(getUserInfo());
            Cookies.set("isGuestLoggedIn", true, {
              expires: SIGN_IN_EXPIRE_DAYS,
            });
            // Cookies.set('isGuestSkip', false, { expires: GUESTSKIP_EXPIRE_HOURS / 24 });
            setIsPopupShow(false);
            onAddSelectedProductsToCollection();
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [guestData.email, onAddSelectedProductsToCollection],
  );

  const onProductClick = (product) => {
    if (enableClickTracking) dispatch(handleRecProductClick());

    // GTAG CONFIGURATION
    // START
    // this is now added in product card
    // gTagCollectionProductClick({
    // 	_id: blogCollectionPage._id,
    // 	name: blogCollectionPage.name,
    // 	path: blogCollectionPage.path,
    // 	status: blogCollectionPage.status,
    // 	user_name: authUser.user_name,
    // 	user_id: authUser.user_id,
    // 	mft_code: product.mfr_code,
    // 	url: product.url,
    // });
    // END
  };

  const collectionPagePath = useMemo(
    () =>
      getBlogCollectionPagePath(
        pageUser?.user_name,
        blogCollectionPage?.path,
        blogCollectionPage?._id,
        pageUser?.user_id,
        blogCollectionPage?.status,
        blogCollectionPage?.hosted_stores,
        blogCollectionPage?.collection_theme,
      ),
    [
      pageUser?.user_name,
      blogCollectionPage?.path,
      blogCollectionPage?._id,
      pageUser?.user_id,
      blogCollectionPage?.status,
      blogCollectionPage?.hosted_stores,
      blogCollectionPage?.collection_theme,
    ],
  );

  const qrCodeGeneratorURL = useMemo(
    () => collectionQRCodeGenerator(collectionPagePath),
    [collectionPagePath],
  );

  const onSeeAllClick = useCallback(() => {
    if (collectionPagePath) {
      navigate(collectionPagePath);
    }
  }, [navigate, collectionPagePath]);

  const onClearSelectedTagsClick = useCallback(() => {
    handleResetSelectProduct();
    setSelectedTags([]);
  }, [handleResetSelectProduct]);

  // const handleTagsShowMoreToggle = useCallback(
  // 	() => setIsTagsShowMoreActive((value) => !value),
  // 	[]
  // );

  const handleTagClick = useCallback((value) => {
    // handleResetSelectProduct();
    // If "All" is selected, reset selectedTags to an empty array; otherwise, select only the clicked tag
    setSelectedTags(value === "All" ? [] : [value]);
  }, []);

  useEffect(() => {
    if (isRootPage) {
      setSelectedTags([]); // clears selected tags
    }
  }, [blogCollectionPage.tags]);

  const allowSelectTags = useMemo(
    () => enableSelectTags && singleCollection.restict_tag_click !== true, // restict_tag_click to avoid tag click
    [enableSelectTags, singleCollection.restict_tag_click],
  );

  const handleShowcaseCollectionProducts = useCallback(
    (
      products, // products format ['mft_code']
      starred, // not need to send this for un starring the products // sent true to star the products
    ) => {
      const productsWithDetails =
        singleCollection.product_lists?.filter((p) =>
          products.includes(p.mfr_code),
        ) || [];

      const productsToShowcase = productsWithDetails.map((pr) => ({
        mfr_code: pr.mfr_code,
        tagged_by: pr.tagged_by,
        starred, // to show case products
      }));

      const addToWishlistPayload = {
        _id: singleCollection._id,
        products: productsToShowcase,
        fetchUserCollection: true, // fetch collection after success add to collection
        showcase: true, // flag to know it is showcase action
        // rerunApplyWishlistProductsFilter: true, // flag to re run the apply filter api again to update the latest filtered API if available
      };

      dispatch(addToWishlist(addToWishlistPayload));
    },
    [singleCollection.product_lists, singleCollection._id],
  );

  // desktop is hover videos run funtions

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const isSocialMediaVideo = (url) => {
    return (
      typeof url === "string" &&
      (url.includes("facebook.com") || url.includes("instagram.com"))
    );
  };

  // scroll for tags

  const swiperRef = useRef(null); // To store Swiper instance
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = () => {
    if (swiperRef.current && swiperRef.current.wrapperEl) {
      const { scrollWidth, clientWidth } = swiperRef.current.wrapperEl;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    // Initial check
    checkOverflow();

    // Recheck on resize
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [tagsToShow]);

  // mobile videos auto play funtions

  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoContainerRef = useRef(null);

  // find if the user is on a mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if the video container is visible in the viewport
  useEffect(() => {
    const handleScroll = () => {
      if (videoContainerRef.current) {
        const rect = videoContainerRef.current.getBoundingClientRect();
        setIsVisible(rect.top >= 0 && rect.bottom <= window.innerHeight);
      }
    };

    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll); // Check on scroll

    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  // Step 1: Tag-wise product count create
  const productCountMap = tagsToShow.reduce((acc, tag) => {
    if (tag === "All") {
      acc[tag] = singleCollection?.product_lists?.length;
    } else {
      acc[tag] = singleCollection?.product_lists?.filter(
        (product) =>
          product.tagged_by?.some((t) => t.toLowerCase() === tag.toLowerCase()), // Case-insensitive check
      ).length;
    }
    return acc;
  }, {});

  // keywoard tagmap value filter function

  const keywordTagmap = useMemo(() => {
    if (!singleCollection?.keyword_tag_map) return {};

    if (selectedTags.length === 0) {
      return {};
    }

    const keywordMapKeys = Object.keys(singleCollection.keyword_tag_map);

    return selectedTags.reduce((acc, tag) => {
      // tag ku equivalent case-insensitive key find pannurathu
      const matchingKey = keywordMapKeys.find(
        (key) => key.toLowerCase() === tag.toLowerCase(),
      );

      if (matchingKey) {
        acc[matchingKey] = singleCollection.keyword_tag_map[matchingKey];
      }
      return acc;
    }, {});
  }, [selectedTags, singleCollection]);

  const firstKey = Object.keys(keywordTagmap)[0];
  const firstValue = firstKey ? keywordTagmap[firstKey] : {};

  const filteredFirstValue = { ...firstValue };
  if (filteredFirstValue.price) {
    delete filteredFirstValue.price;
  }

  // for scroll

  const swiperRef2 = useRef(null); // To store Swiper instance
  const [isOverflowing2, setIsOverflowing2] = useState(false);

  const checkOverflow2 = () => {
    if (swiperRef2.current && swiperRef2.current.wrapperEl) {
      const { scrollWidth, clientWidth } = swiperRef2.current.wrapperEl;
      setIsOverflowing2(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    // Initial check
    checkOverflow2();

    // Recheck on resize
    window.addEventListener("resize", checkOverflow2);
    return () => {
      window.removeEventListener("resize", checkOverflow2);
    };
  }, [keywordTagmap]);

  // convert custom filter string to array
  const savedCustomFilter = useMemo(
    () =>
      filteredFirstValue.custom_filter
        ? filteredFirstValue.custom_filter?.split(",")
        : [],
    [filteredFirstValue.custom_filter],
  );

  const publish = singleCollection.status === "published";
  const userId = influencerCollections.user_id === singleCollection.user_id;

  const RenderProductsList = ({
    list,
    showAuraTileFlag,
    isSingleCollectionSharedPage,
  }) => {
    if (blogCollectionPage?.collection_name && !isSingleCollectionSharedPage) {
      return (
        <div className={styles.productGrid}>
          {showCoverImage &&
            (blogCollectionPage?.cover_image ||
              blogCollectionPage?.video_url) && (
              <div
                ref={videoContainerRef}
                className={
                  isSocialMediaVideo(blogCollectionPage.video_url)
                    ? styles.coverMediaHidden
                    : styles.coverMediaContainer
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Show video if hovered, otherwise show the image */}
                {blogCollectionPage?.video_url &&
                  (isHovered || (isMobile && isVisible)) &&
                  !isSocialMediaVideo(blogCollectionPage.video_url) ? (
                  <>
                    <ReactPlayer
                      className={
                        isSocialMediaVideo(blogCollectionPage.video_url)
                          ? ""
                          : `${styles.videoPlayerAbsolute} Video_player`
                      }
                      url={blogCollectionPage.video_url}
                      playing={(isMobile && isVisible) || isHovered} // Autoplay on mobile or when hovered on desktop
                      muted={true}
                      loop={true}
                      width="100%"
                      height="100%"
                      playsinline
                      controls={false}
                    />
                    {/* Transparent overlay to block interaction with the video */}
                    <div
                      className={`${styles.videoOverlay} ${showCollectionDetails ? styles.cursorPointer : ""
                        }`}
                      onClick={() => showCollectionDetails && onSeeAllClick()} // Redirect to details page on click
                    />
                  </>
                ) : blogCollectionPage?.cover_image ? (
                  <img
                    onClick={() => showCollectionDetails && onSeeAllClick()}
                    className={`${styles.coverImage} ${showCollectionDetails ? styles.cursorPointer : ""
                      }`}
                    src={getFinalImageUrl(blogCollectionPage.cover_image)}
                    alt="Cover"
                  />
                ) : (
                  /* Video without playing if no image and not from social media */
                  blogCollectionPage?.video_url &&
                  !isSocialMediaVideo(blogCollectionPage.video_url) && (
                    <>
                      <ReactPlayer
                        className={`${styles.videoPlayerAbsolute} Video_player`}
                        url={blogCollectionPage.video_url}
                        playing={false}
                        muted={true}
                        loop={true}
                        width="100%"
                        height="100%"
                        playsinline
                        controls={false}
                      />
                      {/* Transparent overlay to block interaction with the video */}
                      <div
                        className={`${styles.videoOverlay} ${showCollectionDetails ? styles.cursorPointer : ""
                          }`}
                        onClick={() => showCollectionDetails && onSeeAllClick()}
                      />
                    </>
                  )
                )}
              </div>
            )}

          {list.length > 0 &&
            list?.map((product) => (
              // console.log("productsssss", list),

              <div key={product.mfr_code}>
                <ProductCard
                  product={product}
                  onProductClick={() => onProductClick(product)}
                  enableClickTracking={enableClickTracking}
                  productClickParam={{
                    iCode: authUser.influencer_code,
                    campCode: blogCollectionPage.campaign_code,
                    collectionId: blogCollectionPage._id,
                    collectionName: blogCollectionPage.collection_name,
                    collectionICode: pageUser.influencer_code,
                  }}
                  showStar={false}
                  enableHoverShowcase={false}
                  onStarClick={() =>
                    handleShowcaseCollectionProducts(
                      [product.mfr_code],
                      !product.starred,
                    )
                  }
                  hideAddToWishlist={
                    !!product.sponsored || (is_store_instance && !isUserLogin)
                  }
                  hideViewSimilar={!!product.sponsored}
                  enableSelect={enableSelectProduct}
                  isSelected={selectedProducts.includes(product.mfr_code)}
                  setSelectValue={() => onSelectProductClick(product.mfr_code)}
                  collection_id={blogCollectionPage._id}
                  collection_name={blogCollectionPage.collection_name}
                  collection_path={blogCollectionPage.path}
                  collection_status={blogCollectionPage.status}
                  blogCollectionPage={blogCollectionPage}
                />
              </div>
            ))}
          {showAuraTileFlag && list.length > 0 && (
            <div>
              <AskAuraCard />
            </div>
          )}
        </div>
      );
    } else if (
      blogCollectionPage?.collection_name &&
      (userId || publish) &&
      isSingleCollectionSharedPage
    ) {
      return (
        <div className={styles.productGrid}>
          {showCoverImage &&
            (blogCollectionPage?.cover_image ||
              blogCollectionPage?.video_url) && (
              <div
                ref={videoContainerRef}
                className={
                  isSocialMediaVideo(blogCollectionPage.video_url)
                    ? styles.coverMediaHidden
                    : styles.coverMediaContainer
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Show video if hovered, otherwise show the image */}
                {blogCollectionPage?.video_url &&
                  (isHovered || (isMobile && isVisible)) &&
                  !isSocialMediaVideo(blogCollectionPage.video_url) ? (
                  <>
                    <ReactPlayer
                      className={
                        isSocialMediaVideo(blogCollectionPage.video_url)
                          ? ""
                          : `${styles.videoPlayerAbsolute} Video_player`
                      }
                      url={blogCollectionPage.video_url}
                      playing={(isMobile && isVisible) || isHovered} // Autoplay on mobile or when hovered on desktop
                      muted={true}
                      loop={true}
                      width="100%"
                      height="100%"
                      playsinline
                      controls={false}
                    />
                    {/* Transparent overlay to block interaction with the video */}
                    <div
                      className={`${styles.videoOverlay} ${showCollectionDetails ? styles.cursorPointer : ""
                        }`}
                      onClick={() => showCollectionDetails && onSeeAllClick()} // Redirect to details page on click
                    />
                  </>
                ) : blogCollectionPage?.cover_image ? (
                  <img
                    onClick={() => showCollectionDetails && onSeeAllClick()}
                    className={`${styles.coverImage} ${showCollectionDetails ? styles.cursorPointer : ""
                      }`}
                    src={getFinalImageUrl(blogCollectionPage.cover_image)}
                    alt="Cover"
                  />
                ) : (
                  /* Video without playing if no image and not from social media */
                  blogCollectionPage?.video_url &&
                  !isSocialMediaVideo(blogCollectionPage.video_url) && (
                    <>
                      <ReactPlayer
                        className={`${styles.videoPlayerAbsolute} Video_player`}
                        url={blogCollectionPage.video_url}
                        playing={false}
                        muted={true}
                        loop={true}
                        width="100%"
                        height="100%"
                        playsinline
                        controls={false}
                      />
                      {/* Transparent overlay to block interaction with the video */}
                      <div
                        className={`${styles.videoOverlay} ${showCollectionDetails ? styles.cursorPointer : ""
                          }`}
                        onClick={() => showCollectionDetails && onSeeAllClick()}
                      />
                    </>
                  )
                )}
              </div>
            )}

          {list.length > 0 &&
            list?.map((product) => (
              // console.log("productsssss", list),

              <div key={product.mfr_code}>
                <ProductCard
                  product={product}
                  onProductClick={() => onProductClick(product)}
                  enableClickTracking={enableClickTracking}
                  productClickParam={{
                    iCode: authUser.influencer_code,
                    campCode: blogCollectionPage.campaign_code,
                    collectionId: blogCollectionPage._id,
                    collectionName: blogCollectionPage.collection_name,
                    collectionICode: pageUser.influencer_code,
                  }}
                  showStar={false}
                  enableHoverShowcase={false}
                  onStarClick={() =>
                    handleShowcaseCollectionProducts(
                      [product.mfr_code],
                      !product.starred,
                    )
                  }
                  hideAddToWishlist={
                    !!product.sponsored || (is_store_instance && !isUserLogin)
                  }
                  hideViewSimilar={!!product.sponsored}
                  enableSelect={enableSelectProduct}
                  isSelected={selectedProducts.includes(product.mfr_code)}
                  setSelectValue={() => onSelectProductClick(product.mfr_code)}
                  collection_id={blogCollectionPage._id}
                  collection_name={blogCollectionPage.collection_name}
                  collection_path={blogCollectionPage.path}
                  collection_status={blogCollectionPage.status}
                  blogCollectionPage={blogCollectionPage}
                />
              </div>
            ))}
          {showAuraTileFlag && list.length > 0 && (
            <div>
              <AskAuraCard />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  console.log(publish);

  useEffect(() => {
    if (singleCollection) return;
    if (singleCollection) return;
  }, [singleCollection]);

  // useEffect(() => {
  //   if (!singleCollection) return;
  //   const hasFaq = singleCollection?.faqs?.length > 0;
  //   const hasProducts = autoProductsData.length > 0;
  //   setActiveTab(hasFaq && hasProducts ? "products" : "faq");
  // }, []);
  // useEffect(() => {
  //   // wait until we have the collection and the products array (could be [] but defined)
  //   if (!singleCollection || autoProductsData === undefined) return;

  //   // if we've already initialized for this collection, do nothing
  //   if (collectionId && initializedFor.current === collectionId) return;

  //   const hasFaq = (singleCollection?.faqs?.length ?? 0) > 0;
  //   const hasProducts = (autoProductsData?.length ?? 0) > 0;

  //   // set default tab only once when collection changes
  //   setActiveTab(hasFaq && hasProducts ? "products" : "faq");

  //   // mark as initialized for this collection id
  //   if (collectionId) initializedFor.current = collectionId;
  // }, [singleCollection, autoProductsData, collectionId]);

  return (
    <div className={styles.pageWrapper}>
      {singleCollection?.faqs?.length > 0 &&
        autoProductsData.length > 0 &&
        isSingleCollectionSharedPage &&
        (userId || (publish && isSingleCollectionSharedPage)) && (
          <div className={styles.tabsRow}>
            {/* PRODUCTS TAB */}
            <p
              className={`${styles.tabButton} ${activeTab === "products" ? styles.tabButtonActive : styles.tabButtonInactive}`}
              onClick={() => setActiveTab("products")}
            >
              PRODUCTS
            </p>

            {/* FAQ TAB */}

            <p
              className={`${styles.tabButton} ${activeTab === "faq"
                ? styles.tabButtonActive
                : styles.tabButtonInactive
                }`}
              onClick={() => setActiveTab("faq")}
            >
              FAQS{" "}
            </p>
          </div>
        )}
      {((activeTab === "products" || !isSingleCollectionSharedPage) &&
        blogCollectionPage.collection_name && (
          <>
            <div className="colloction_details_cards_div">
              <div className={styles.lgContainer}>
                {isSingleCollectionSharedPage &&
                  (userId || (publish && isSingleCollectionSharedPage)) && (
                    <div className={styles.tagsOuterContainer}>
                      {showTagsSelection &&
                        tagsToShow?.length &&
                        autoProductsData.length ? (
                        <div className={`${styles.tagsPadding} colloction_details_tag`}>
                          <div className={`${styles.tagsFlexRow} tag_responsive_div`}>
                            <div className={`${styles.tagsScrollWrapper} ${styles.colloectionDetailScroll}`}>
                              <Swiper
                                slidesPerView="auto"
                                spaceBetween={10}
                                freeMode={true}
                                onSwiper={(swiper) =>
                                  (swiperRef.current = swiper)
                                }
                                className="colloectionDetailScroll"
                              >
                                {tagsToShow.map((tag) => {
                                  const isDisabled = productCountMap[tag] === 0; // Check if the product length is 0

                                  return (
                                    <SwiperSlide
                                      key={tag}
                                      style={{ width: "auto" }}
                                    >
                                      <div
                                        className={`${styles.tagChip} ${selectedTags.includes(tag) ||
                                          (selectedTags.length === 0 &&
                                            tag === "All")
                                          ? styles.tagChipSelected
                                          : styles.tagChipDefault
                                          } ${isDisabled
                                            ? styles.tagChipDisabled
                                            : ""
                                          }`} // Disable styling
                                      >
                                        <h3
                                          className={`${styles.tagText} ${allowSelectTags && !isDisabled
                                            ? styles.cursorPointer
                                            : ""
                                            }`} // Prevent click
                                          onClick={
                                            allowSelectTags && !isDisabled
                                              ? () => handleTagClick(tag)
                                              : undefined
                                          }
                                        >
                                          {tag}
                                        </h3>
                                      </div>
                                    </SwiperSlide>
                                  );
                                })}
                              </Swiper>
                            </div>
                            {isOverflowing && (
                              <div
                                className={styles.addmore_image}
                                style={{ cursor: "pointer", zIndex: 10, position: 'absolute' }}
                                onClick={() => {
                                  if (swiperRef.current) {
                                    swiperRef.current.slideNext();
                                  }
                                }}
                              >
                                <Image src={Addmore} alt="Scroll Right" width='72' height='72' />
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* keyword tag map */}

                      {showTagsSelection &&
                        Object.keys(filteredFirstValue).length > 0 && (
                          <div className={`${styles.tagsPaddingSmall} colloction_details_tag`}>
                            <div className={`${styles.tagsFlexRow} tag_responsive_div`}>
                              <div className={`${styles.keywordScrollWrapper} ${styles.colloectionDetailScroll}`}>
                                <Swiper
                                  slidesPerView="auto"
                                  spaceBetween={10}
                                  freeMode={true}
                                  onSwiper={(swiper) =>
                                    (swiperRef2.current = swiper)
                                  }
                                  className="colloectionDetailScroll"
                                >
                                  {Object.entries(filteredFirstValue).map(
                                    ([key, values]) => {
                                      if (key === "custom_filter") {
                                        return savedCustomFilter.map(
                                          (tag, index) => (
                                            <SwiperSlide
                                              key={`${key}-${index}`}
                                              style={{ width: "auto" }}
                                            >
                                              <div className={styles.keywordChip}>
                                                <span className={styles.keywordChipText}>
                                                  #{tag.trim()}
                                                </span>
                                              </div>
                                            </SwiperSlide>
                                          ),
                                        );
                                      }

                                      return (
                                        <SwiperSlide
                                          key={key}
                                          style={{ width: "auto" }}
                                        >
                                          <div className={styles.keywordChip}>
                                            <h3 className={styles.keywordTagText}>
                                              <span>{`${key} :`}</span>{" "}
                                              {Array.isArray(values)
                                                ? values.join(", ")
                                                : String(values)}
                                            </h3>
                                          </div>
                                        </SwiperSlide>
                                      );
                                    },
                                  )}
                                </Swiper>
                              </div>

                              {isOverflowing2 && (
                                <div
                                  className={styles.addmore_image}
                                  style={{ cursor: "pointer", zIndex: 10, position: 'absolute' }}
                                  onClick={() => {
                                    if (swiperRef2.current) {
                                      swiperRef2.current.slideNext();
                                    }
                                  }}
                                >
                                  <Image src={Addmore} alt="Scroll Right" width='38' height='38' />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      {isSingleCollectionSharedPage && productsData.length ? (
                        <div
                          className={`${styles.selectBarRow} ${enableSelectProduct ? styles.selectBarRowWithCol : styles.selectBarRowDefault
                            }`}
                        >
                          {/* {isUserLogin ? ( */}
                          <div className={styles.selectBarLeft}>
                            {enableSelectProduct ? (
                              <div className={styles.selectCheckRow}>
                                <div className={styles.selectCheckBorder}>
                                  <Checkbox
                                    className={`${styles.checkboxText} checkbox_singleCollection`}
                                    indeterminate={
                                      isTagProductSelected &&
                                      !isTagProductsAllSelected
                                    }
                                    onChange={onSelectAllChange}
                                    checked={isTagProductsAllSelected}
                                  >
                                    {selectedProducts.length} Selected
                                  </Checkbox>
                                </div>
                                <p
                                  onClick={
                                    selectedProducts.length
                                      ? () =>
                                        onAddSelectedProductsToCollection()
                                      : null
                                  }
                                  className={`${selectedProducts.length
                                    ? styles.addToTextActive
                                    : styles.addToTextDisabled
                                    } ${styles.addToText}`}
                                  title="Click to add selected products in collection"
                                  role="button"
                                >
                                  Add to {WISHLIST_TITLE}
                                </p>

                                <p
                                  onClick={() => handleResetSelectProduct()}
                                  className={styles.cancelText}
                                  role="button"
                                >
                                  Cancel
                                </p>
                              </div>
                            ) : (
                              <p
                                className={styles.addToCollectionBtn}
                                role="link"
                                onClick={() => setEnableSelectProduct(true)}
                                title="Click and select multiple products to add to collection"
                              >
                                Add to Collection
                              </p>
                            )}
                          </div>
                          {/* ) : null} */}

                          {/* sort by product  */}
                          <div className={`${styles.sortRow} sort_dropdown`}>
                            {/* <div className="colloction_details_tag_div"></div> */}
                            <div className={`${styles.sortContainer} collection_page_sort_product_list`}>
                              <label className={styles.sortLabel}>
                                Sort by :
                              </label>
                              <Select
                                name="sortBy"
                                className={styles.sortSelectFull}
                                size="small"
                                value={selectedSortOption?.id}
                                onChange={handleSortOptionChange}
                              >
                                {PRODUCT_SORT_OPTIONS?.map((item) => (
                                  <Option
                                    className={styles.sortOptionText}
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {item.id}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
              </div>
              <div className={`${styles.collectionWrapper} single-collection-class`}>
                {showCollectionDetails && (
                  <div className={styles.detailsRow}>
                    {showUserImage &&
                      (profile_image || blogCollectionPage.profile_image) &&
                      (user_name || blogCollectionPage.user_name) && (
                        <>
                          {user_name === super_admin ? (
                            <img
                              src={
                                getFinalImageUrl(profile_image) ||
                                getFinalImageUrl(
                                  blogCollectionPage.profile_image,
                                )
                              }
                              className={styles.userAvatar}
                            />
                          ) : (
                            (() => {
                              const route = generateRoute(
                                blogCollectionPage.user_id,
                                user_name || blogCollectionPage.user_name,
                              );
                              return route ? (
                                <Link
                                  href={route}
                                  className={styles.userAvatarLink}
                                >
                                  <img
                                    src={
                                      getFinalImageUrl(profile_image) ||
                                      getFinalImageUrl(
                                        blogCollectionPage.profile_image,
                                      )
                                    }
                                    className={styles.userAvatarFull}
                                  />
                                </Link>
                              ) : (
                                <div className={styles.userAvatarLink}>
                                  <img
                                    src={
                                      getFinalImageUrl(profile_image) ||
                                      getFinalImageUrl(
                                        blogCollectionPage.profile_image,
                                      )
                                    }
                                    className={styles.userAvatarFull}
                                  />
                                </div>
                              );
                            })()
                          )}
                        </>
                      )}

                    <div className={styles.contentColumn}>
                      <div className={styles.titleRow}>
                        <h1
                          className={`${styles.collectionTitle} capital-first-letter`}
                          style={{ overflowWrap: "anywhere" }}
                          onClick={onSeeAllClick}
                        >
                          {checkIsFavoriteCollection(blogCollectionPage)
                            ? favorites_collection_name
                            : blogCollectionPage.collection_name}
                        </h1>
                        {/* for mobile screen : QR code */}
                        {qrCodeGeneratorURL &&
                          blogCollectionPage.status === PUBLISHED ? (
                          <img
                            className={styles.qrCodeMobile}
                            src={qrCodeGeneratorURL}
                          />
                        ) : null}
                        {/* <Button
									type='primary'
									className='rounded-lg dark:bg-black-200 dark:border-black-200 hidden md:block'
									// ghost
									onClick={onSeeAllClick}>
									View all
								</Button> */}
                      </div>
                      <div className={styles.descriptionWrapper}>
                        {blogCollectionPage.description ? (
                          <>
                            <>
                              {/* <p className={`text-sm lg:text-lg text-justify whitespace-pre-line leading-normal  ${isExpanded ? '': 'ellipsis_2'} `}>
													{blogCollectionPage.description}
												</p>
												<button onClick={()=>setExpanded(!isExpanded)}>{isExpanded ? 'Readmore' : 'Readless'}</button> */}
                              <div className={styles.descriptionWrapper}>
                                <p
                                  ref={textRef}
                                  className={`${styles.descriptionText} 
    ${expanded
                                      ? ""
                                      : productsData?.length === 0
                                        ? "ellipsis_3"
                                        : "ellipsis_2"
                                    }
  `}
                                >
                                  {blogCollectionPage?.description}
                                </p>
                                {/* <> */}
                                {!expanded && showMoreEnabled && (
                                  <span
                                    onClick={() => setExpanded(true)}
                                    className={styles.readMoreLink}>
                                    Read more
                                  </span>
                                )}

                                {expanded && showMoreEnabled && (
                                  <span
                                    onClick={() => setExpanded(false)}
                                    className={styles.readLessLink}>
                                    Read less
                                  </span>
                                )}


                              </div>
                            </>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* for desktop screen : QR code */}


                    <div className={styles.shareIconWrapper}>
                      {showShareCollection && (
                        <ShareOptions
                          url={sharePageUrl}
                          onClose={setShowShareCollection}
                          collection={blogCollectionPage}
                          isOpen={showShareCollection}
                          qrCodeGeneratorURL={qrCodeGeneratorURL}
                          collectionPagePath={collectionPagePath}
                        />
                      )}
                      {/* {sharePageUrl && ( */}
                      <img
                        className={`${styles.shareIcon} ${showShareCollection ? styles.shareIconEventsNone : ""
                          } ${blogCollectionPage.status === PUBLISHED
                            ? styles.shareIconEnabled
                            : styles.shareIconDisabled
                          }`}
                        src={share_icon}
                        title={
                          blogCollectionPage.status !== PUBLISHED
                            ? "Please publish collection to share"
                            : ""
                        }
                        onClick={() =>
                          blogCollectionPage.status === PUBLISHED &&
                          setShowShareCollection(!showShareCollection)
                        }
                      />
                      {/* )} */}
                    </div>

                    {/* {qrCodeGeneratorURL &&
                    blogCollectionPage.status === PUBLISHED ? (
                      <img
                        className="w-25 h-25 object-cover hidden md:block mt-3.5"
                        src={qrCodeGeneratorURL}
                      />
                    ) : null} */}

                    {/* <div className='w-full self-center'>
							<div className='flex justify-between'>
								<h1
									className='text-xl md:text-xl-2 font-semibold capitalize underline cursor-pointer'
									onClick={onSeeAllClick}>
									{checkIsFavoriteCollection(blogCollectionPage)
										? favorites_collection_name
										: blogCollectionPage.collection_name}
								</h1>
								<Button
									type='primary'
									className='rounded-lg dark:bg-black-200 dark:border-black-200'
									// ghost
									onClick={onSeeAllClick}>
									View all
								</Button>
								<h1
									className='text-base leading-7 text-purple-101 underline cursor-pointer min-w-max'
									onClick={onSeeAllClick}>
									View
								</h1>
							</div>
								{blogCollectionPage.description ? (
									<p className='text-sm lg:text-lg leading-normal max-w-xl-1 mt-3 ellipsis_2'>
										{blogCollectionPage.description}
									</p>
								) : null}
						</div> */}
                  </div>
                )}

                {isSingleCollectionSharedPage &&
                  !!showcasedProductsData.length ? (
                  <div>
                    {!!showcasedProductsData.length ? (
                      <div>
                        <p className={styles.topPicksTitle}>
                          Top Picks
                        </p>
                        <div className={styles.flexColLgRow}>
                          <RenderProductsList
                            list={showcasedProductsData}
                            showAuraTileFlag={
                              autoProductsData.length ? false : showAuraTile
                            }
                            isSingleCollectionSharedPage={
                              isSingleCollectionSharedPage
                            }
                          />
                        </div>
                      </div>
                    ) : null}

                    {!!autoProductsData.length ? (
                      <div className={styles.moreFromSection}>
                        <p className={styles.moreFromTitle}>
                          More from this collection
                        </p>
                        <div className={styles.flexColLgRow}>
                          <RenderProductsList
                            list={autoProductsData}
                            showAuraTileFlag={showAuraTile}
                            isSingleCollectionSharedPage={
                              isSingleCollectionSharedPage
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className={styles.flexColLgRow}>
                    <RenderProductsList
                      list={productsData}
                      showAuraTileFlag={showAuraTile}
                      isSingleCollectionSharedPage={
                        isSingleCollectionSharedPage
                      }
                    />
                  </div>
                )}
                {!isSingleCollectionSharedPage && productsData.length ? (
                  <div className={styles.seeFullRow}>
                    <Button
                      type="primary"
                      className={styles.seeFullBtn}
                      onClick={onSeeAllClick}
                    >
                      See the full collection
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
            {isPopupShow && isGuestPopUpShow && (
              <GuestPopUp
                handleGuestSubmit={handleGuestSubmit}
                errors={errors}
                handleGuestSkip={handleGuestSkip}
                guestChange={guestChange}
                guestData={guestData}
                setIsPopupShow={setIsPopupShow}
              />
            )}
          </>
        )) ||
        null}

      {activeTab === "faq" &&
        singleCollection?.faqs?.length > 0 &&
        isSingleCollectionSharedPage && (
          <div className={styles.faqSection}>
            <Collapse
              accordion
              items={singleCollection?.faqs?.map((faq, index) => ({
                key: index + 1,
                label: (
                  <span className={styles.faqLabel}>
                    {index + 1}. {faq.question}
                  </span>
                ),
                children: <p className={styles.faqAnswer}>{faq.answer}</p>,
              }))}
            />
          </div>
        )}
    </div>
  );
};

export default React.memo(SingleCollectionProductList);
