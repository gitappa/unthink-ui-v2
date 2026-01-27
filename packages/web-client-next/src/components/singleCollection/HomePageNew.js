import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import im from "./images/pppp.webp";
import img1 from "./images/img1.jpg";
import men from "./images/men.jpg";
import women from "./images/women.jpg";
import womenBag from "./images/womenBag.jpg";
import fashionBg from "./images/fashionVideo.jpg";

import qrcode from "./images/qrcode.svg";
import legs from "./images/shoes.jpg";
import robo from "./images/robo.jpg";

import menimage from "./images/menimage.jpg";

import ai from "./images/aiimg.png";

import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import HeroSection from "./HeroSection";
import DealsAndTrends from "./DealsAndTrends";
import SplitDiscoverySection from "./SplitDiscoverySection";

const HomePageNew = ({ blogCollectionPage }) => {
  const [collectiosn] = useSelector((state) => [
    state.influencer.collections.data,
  ]);
  const authUserCollections = useSelector(
    (state) => state.auth.user.collections.data,
  );
 
  const collection = {
    "_id": "201336425631929205468411427766860715730",
    "user_id": "173081113277330",
    "collection_name": "NEEYA's Beautiful Love Pendant Chains",
    "description": " 1. This elegant silver-toned chain features a charming puffed heart pendant, offering a classic and romantic touch.\n 2. A dazzling gold-toned chain showcases a sophisticated bow pendant, intricately adorned with sparkling clear stones and a prominent teardrop gem.\n 3. This unique gold-toned chain combines a delicate U-shaped arrangement of lustrous white pearls with a subtle gold-toned heart pendant.\n 4. A minimalist gold-toned chain features an elegant open heart pendant, perfect for a subtle yet meaningful statement.\n 5. This classic gold-toned chain presents a beautifully crafted puffed heart pendant, exuding timeless charm.\n 6. A graceful gold-toned chain highlights a charming bow pendant, delicately embellished with small, luminous white pearls.\n 7. This exquisite gold-toned chain features a heart pendant elegantly inlaid with shimmering white mother-of-pearl, adding a touch of sophistication.",
    "description_old": " 1. This elegant silver-toned chain features a charming puffed heart pendant, offering a classic and romantic touch.\n 2. A dazzling gold-toned chain showcases a sophisticated bow pendant, intricately adorned with sparkling clear stones and a prominent teardrop gem.\n 3. This unique gold-toned chain combines a delicate U-shaped arrangement of lustrous white pearls with a subtle gold-toned heart pendant.\n 4. A minimalist gold-toned chain features an elegant open heart pendant, perfect for a subtle yet meaningful statement.\n 5. This classic gold-toned chain presents a beautifully crafted puffed heart pendant, exuding timeless charm.\n 6. A graceful gold-toned chain highlights a charming bow pendant, delicately embellished with small, luminous white pearls.\n 7. This exquisite gold-toned chain features a heart pendant elegantly inlaid with shimmering white mother-of-pearl, adding a touch of sophistication.",
    "tags": [
        "silver heart chain",
        "stone bow chain",
        "pearl U-chain",
        "open heart chain",
        "gold heart chain",
        "pearl bow chain",
        "inlay heart chain"
    ],
    "type": "auto_plist",
    "generated_by": "video_based",
    "video_url": "https://www.youtube.com/shorts/Rf3shTcbRsk",
    "keyword_tag_map": {
        "gold heart chain": {
            "custom_filter": "puffed",
            "gender": [
                "female"
            ]
        },
        "inlay heart chain": {
            "color": [
                "gold"
            ],
            "custom_filter": "inlaid",
            "gender": [
                "female"
            ],
            "material": [
                "mother-of-pearl"
            ]
        },
        "open heart chain": {
            "color": [
                "gold"
            ],
            "gender": [
                "female"
            ]
        },
        "pearl U-chain": {
            "color": [
                "gold"
            ],
            "custom_filter": "U-shape",
            "gender": [
                "female"
            ]
        },
        "pearl bow chain": {
            "color": [
                "gold"
            ],
            "gender": [
                "female"
            ]
        },
        "silver heart chain": {
            "custom_filter": "puffed",
            "gender": [
                "female"
            ]
        },
        "stone bow chain": {
            "color": [
                "gold"
            ],
            "gender": [
                "female"
            ]
        }
    },
    "uploaded_source": false,
    "domain_store": "dothelook",
    "status": "published",
    "path": "neeya's-beautiful-love-pendant-chains-173081113277330-1",
    "product_lists": [
        {
            "tagged_by": [
                "pearl bow chain"
            ],
            "score": 1.15469388,
            "mfr_code": "amz_B0DNMSC3K9",
            "brand": "amazon",
            "product_brand": "pavoi",
            "name": "PAVOI 14K Yellow Gold Plated Chunky Charm Necklace Pack for Women | Statement Paperclip Chain Necklaces with Removable Charms | Heart Palm Tree Bow Pearl Love Friendship Necklace",
            "price": 18,
            "listprice": 18,
            "url": "https://www.amazon.com/dp/B0DNMSC3K9/?tag=budgettrave0c-20&linkCode=osi&th=1&psc=1&utm_source=unthink&utm_medium=web",
            "image": "https://m.media-amazon.com/images/I/31qcB1XlI6L._SL500_.jpg",
            "additional_image": "https://m.media-amazon.com/images/I/41HdEYGyarL._SL500_.jpg",
            "currency": "USD",
            "availability": "in stock",
            "description": "This necklace is practically multiple pieces in one, thanks to its fun, whimsical charms that you can customize or style however you want. Plated in 14K yellow gold, it features a chunky, sturdy 16-inch chain with a 2-inch extender, along with removable charms including a bow tie, mantra dog tag, hearts, envelope, palm tree, and pearl., This necklace is crafted with care and features a durable finish that's 100% nickel-free, cadmium-free, lead-free, and hypoallergenic. So it's safe for sensitive skin and all-day, everyday wear., OUR SATISFACTION PROMISE: Your happiness is our number one priority. If you re not loving your product, let us know within 60 days so we can make it right! To get in touch, email or chat with us - a member of our team will be happy to help., SUSTAINABILITY: PAVOI is dedicated to sustainability throughout our entire product cycle. Our jewelry is made from 100% recycled materials and we package in 99% recycled materials. We work to reduce our carbon emissions and offset plastic consumption by removing 275,000 bottles from oceans annually. We are committed to maintaining a business that minimizes our environmental impact., PROUDLY AMERICAN-OWNED",
            "color": [
                "yellow",
                "gold",
                "yellow gold"
            ],
            "category": "necklaces",
            "subcategories": [
                "charm necklace"
            ],
            "product_tag": [
                "gold charm necklace",
                "layered charm necklace",
                "statement jewelry necklace",
                "charm necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook",
                "budgettravel"
            ],
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "currency_symbol": "&#36;",
            "discount": "no discount",
            "material": [
                "yellow gold"
            ],
            "style": [
                "statement"
            ],
            "occasion": [
                "casual wear",
                "party wear"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "open heart chain"
            ],
            "score": 1.15076236,
            "mfr_code": "amz_B0CY1VHCF1",
            "brand": "amazon",
            "product_brand": "sufope",
            "name": "SUFOPE Gold Heart Necklace for Women,Dainty Heart Pendant Necklaces Cute Open Love Shaped Chain Chunky Heart Necklace Jewelry",
            "price": 13,
            "listprice": 15,
            "url": "https://www.amazon.com/dp/B0CY1VHCF1/?tag=budgettrave0c-20&linkCode=osi&th=1&psc=1&utm_source=unthink&utm_medium=web",
            "image": "https://m.media-amazon.com/images/I/21U38WgcDrL._SL500_.jpg",
            "additional_image": "https://m.media-amazon.com/images/I/410whfR7DRL._SL500_.jpg",
            "currency": "USD",
            "availability": "in stock",
            "description": "Heart Necklace for Women: With a gold heart pendant and simple tiny gold chain design,the heart pendant is set with many small cubic zirconia,sparkling,make you more charm,the gold heart necklace can be matched with your favorite clothing and jewelry, Material:This heart pendant necklace is made of brass,the surface of the necklace is made with gold plating,which makes the gold necklace keep its luster for a long time, Adjustable Size:The chunky heart necklace length is 16.5 inches with 2 inches extension,adjustable chain fits most women, Wide Application:Packaged in a exquisite branded box, SUFOPE jewelry is the good choice for yourself or your wife,lover,girlfriend,sister,mother,daughter on anniversaries,birthdays,weddings,graduations,Christmas,Mother's Day, Valentine's Day,and other special occasion, About Sufope:If you have questions or concerns about our dainty necklace jewelry,our friendly customer support team is here to assist you",
            "color": [
                "gold",
                "gd"
            ],
            "category": "necklaces",
            "subcategories": [
                "necklace"
            ],
            "product_tag": [
                "heart pendant necklace",
                "gold chain necklace",
                "women's jewelry gift",
                "necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook",
                "budgettravel"
            ],
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "currency_symbol": "&#36;",
            "discount": "no discount",
            "material": [
                "brass"
            ],
            "style": [
                "dainty"
            ],
            "occasion": [
                "events",
                "party wear"
            ],
            "shape": [
                "heart"
            ],
            "gemstone": [
                "zircon"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "gold heart chain"
            ],
            "score": 1.1721928400000001,
            "name": "14K Yellow Gold Polished Puffed Heart Necklace, One Size",
            "description": "She has a heart of gold. Show her how much she means to you with this 14 gold puffed heart necklace bursting with simple beauty.Closure: Fish hook claspFeatures: Quick ShipShape: HeartMetal Color: YellowChain Length: 17 InchChain Construction: CableCare: Wipe CleanMetal: 14k GoldNecklace Type: Pendant NecklacesCountry of Origin: Imported",
            "price": 253,
            "listprice": 724,
            "url": "https://www.tkqlhce.com/click-100400593-13419515?url=https%3A%2F%2Fwww.jcpenney.com%2Fp%2F14k-yellow-gold-polished-puffed-heart-necklace%2Fpp5003580214%3FpTmplType%3Dregular",
            "image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0607202307102092M?wid=450&hei=450&op_sharpen=1",
            "color": [
                "yellow",
                "gold",
                "no color"
            ],
            "additional_image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0607202307101989M.tif?wid=450&hei=450&op_sharpen=1",
            "availability": "in stock",
            "product_brand": "fine jewelry",
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "size": [
                "one size"
            ],
            "mfr_code": "28205980000_No Color",
            "category": "necklaces",
            "subcategories": [
                "pendant necklace"
            ],
            "product_tag": [
                "gold heart necklace",
                "14k gold jewelry",
                "heart pendant necklace",
                "pendant necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook"
            ],
            "currency": "USD",
            "brand": "jcpenney",
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "currency_symbol": "&#36;",
            "discount": "above 60",
            "material": [
                "yellow gold"
            ],
            "occasion": [
                "modern wear",
                "events"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "gold heart chain"
            ],
            "score": 0.27343496,
            "name": "Womens 10K Gold Heart Pendant Necklace, One Size",
            "description": "Included: 1 Necklace(s)Features: Quick ShipJewelry Closure: Lobster ClaspLink Construction: HollowShape: HeartMetal Color: YellowChain Length: 18 InchChain Width: 2.2 MillimetersChain Gauge: 016Chain Construction: RopeCare: Wipe CleanMetal: 10k GoldNecklace Type: Link NecklacesCountry of Origin: Imported",
            "price": 503,
            "listprice": 1437,
            "url": "https://www.kqzyfj.com/click-100400593-13419515?url=https%3A%2F%2Fwww.jcpenney.com%2Fp%2Fwomens-10k-gold-heart-pendant-necklace%2Fppr5008476859%3FpTmplType%3Dregular",
            "image": "https://jcpenney.scene7.com/is/image/JCPenney/DP1104202411024804M?wid=450&hei=450&op_sharpen=1",
            "color": [
                "gold",
                "no color",
                "yellow"
            ],
            "additional_image": "https://jcpenney.scene7.com/is/image/JCPenney/DP1104202411024702M.tif?wid=450&hei=450&op_sharpen=1",
            "availability": "in stock",
            "product_brand": "fine jewelry",
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "size": [
                "one size"
            ],
            "mfr_code": "28263190018_No Color",
            "category": "necklaces",
            "subcategories": [
                "pendant necklace"
            ],
            "product_tag": [
                "gold heart pendant",
                "women's necklace jewelry",
                "10k gold necklace",
                "pendant necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook"
            ],
            "currency": "USD",
            "brand": "jcpenney",
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "currency_symbol": "&#36;",
            "discount": "above 60",
            "material": [
                "yellow gold"
            ],
            "occasion": [
                "modern wear",
                "party wear",
                "events"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "gold heart chain"
            ],
            "score": 0.27275124,
            "name": "Womens 10K Gold Heart Pendant Necklace, One Size",
            "description": "Features: Reversible, Quick ShipJewelry Closure: Spring Ring ClaspShape: HeartMetal Color: YellowChain Length: 18 InchChain Width: 1.4 MillimetersPendant Length: 13.5mmPendant Width: 15.8mmChain Construction: CableCare: Wipe CleanMetal: 10k GoldNecklace Type: Pendant NecklacesCountry of Origin: Imported",
            "price": 181,
            "listprice": 574,
            "url": "https://www.kqzyfj.com/click-100400593-13419515?url=https%3A%2F%2Fwww.jcpenney.com%2Fp%2Fwomens-10k-gold-heart-pendant-necklace%2Fppr5008419950%3FpTmplType%3Dregular",
            "image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0122202407041799M?wid=450&hei=450&op_sharpen=1",
            "color": [
                "gold",
                "no color"
            ],
            "additional_image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0122202407041903M.tif?wid=450&hei=450&op_sharpen=1",
            "availability": "in stock",
            "product_brand": "fine jewelry",
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "size": [
                "one size"
            ],
            "mfr_code": "28290770018_No Color",
            "category": "necklaces",
            "subcategories": [
                "pendant necklace"
            ],
            "product_tag": [
                "gold heart pendant",
                "women's gold necklace",
                "heart pendant jewelry",
                "pendant necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook"
            ],
            "currency": "USD",
            "brand": "jcpenney",
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "currency_symbol": "&#36;",
            "discount": "above 60",
            "material": [
                "yellow gold"
            ],
            "occasion": [
                "modern wear",
                "casual wear",
                "party wear"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "gold heart chain"
            ],
            "score": 0.272585176,
            "name": "Lariat Style Womens 10K Gold Heart Y Necklace, One Size",
            "description": "This pendant necklace will add an understated sweet elegance to any look. Made from 10K Yellow Gold, this y-shaped necklace features a small heart pendant on a paperclip chain. Wear it with a scoop or v-neck top or dress. Features: Quick ShipJewelry Closure: Lobster ClaspLink Construction: HollowShape: HeartMetal Color: YellowChain Length: 18 InchChain Width: 2.5 MillimetersPendant Length: 11.3mmPendant Width: 10.4mmChain Construction: PaperclipCare: Wipe CleanMetal: 10k GoldNecklace Type: Y NecklacesCountry of Origin: Imported",
            "price": 367,
            "listprice": 1166,
            "url": "https://www.dpbolvw.net/click-100400593-13419515?url=https%3A%2F%2Fwww.jcpenney.com%2Fp%2Flariat-style-womens-10k-gold-heart-y-necklace%2Fppr5008069222%3FpTmplType%3Dregular",
            "image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0228202207025110M?wid=450&hei=450&op_sharpen=1",
            "color": [
                "gold",
                "no color",
                "yellow"
            ],
            "additional_image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0524202315034815M.tif?wid=450&hei=450&op_sharpen=1",
            "availability": "in stock",
            "product_brand": "fine jewelry",
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "size": [
                "one size"
            ],
            "mfr_code": "28290210018_No Color",
            "category": "necklaces",
            "subcategories": [
                "necklace"
            ],
            "product_tag": [
                "gold heart necklace",
                "y necklace jewelry",
                "women's gold pendant",
                "necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook"
            ],
            "currency": "USD",
            "brand": "jcpenney",
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "currency_symbol": "&#36;",
            "discount": "above 60",
            "material": [
                "yellow gold"
            ],
            "style": [
                "lariat"
            ],
            "occasion": [
                "modern wear",
                "casual wear",
                "minimalist"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "gold heart chain"
            ],
            "score": 0.272232868,
            "mfr_code": "amz_B09PBR2CY8",
            "brand": "amazon",
            "product_brand": "honeycat",
            "name": "Honeycat Puffy Heart Locket Charm Necklace in Gold, Rose Gold, or Silver | Minimalist, Delicate (Gold)",
            "price": 29,
            "listprice": 29,
            "url": "https://www.amazon.com/dp/B09PBR2CY8/?tag=budgettrave0c-20&linkCode=osi&th=1&psc=1&utm_source=unthink&utm_medium=web",
            "image": "https://m.media-amazon.com/images/I/21dS76MuEXL._SL500_.jpg",
            "additional_image": "https://m.media-amazon.com/images/I/412DXGFrQ4L._SL500_.jpg",
            "currency": "USD",
            "availability": "in stock",
            "description": "  DESIGN DETAILS: A romantic and timeless locket in a modern, dainty silhouette. The functional heart locket hangs upon a delicately twisted chain. Versatile enough to simply be worn solo or layered as the perfect compliment to your favorite necklaces. Adjustable between 18-21\". Locket measures 1/2\".,  MATERIALS: 18k gold plated over brass. Finished in a protective coating for daily wear. Nickel and lead-free. Our composition makes for an amazing, high quality, seamless piece with longevity.,   CARE: To extend the life of your high quality costume jewelry, avoid exposure to cleaning agents, beauty products & water. Store it in a cool, dry place and wear it with love & intention.,   GIFT-WORTHY: Jewelry is the perfect gift for holidays, birthdays, bridesmaids, best friends, and yourself! Your jewelry will be gift-ready with a high quality, custom, unique envelope box.,   SMALL BUSINESS: Honeycat is a California-based, female-founded and labor of love led brand started by two BFFs designing quality, fun, and delicate jewelry. Thanks for supporting our small brand",
            "color": [
                "silver",
                "gold",
                "rose gold"
            ],
            "category": "necklaces",
            "subcategories": [
                "necklace"
            ],
            "product_tag": [
                "delicate gold necklace",
                "heart locket jewelry",
                "minimalist charm necklace",
                "necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook",
                "budgettravel"
            ],
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "gender": [],
            "age_group": [],
            "currency_symbol": "&#36;",
            "discount": "no discount",
            "material": [
                "brass",
                "18k gold plated"
            ],
            "style": [
                "minimalist",
                "delicate"
            ],
            "occasion": [
                "minimalist"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "gold heart chain"
            ],
            "score": 0.272052216,
            "name": "Womens 10K Gold Heart Pendant Necklace, One Size",
            "description": "Included: 1 Necklace(s)Features: Quick ShipJewelry Closure: Spring Ring ClaspLink Construction: SolidShape: HeartMetal Color: YellowChain Length: 18 InchChain Width: .7 MillimetersPendant Length: 13.5mmPendant Width: 17.5mmChain Construction: CableCare: Wipe CleanMetal: 10k GoldNecklace Type: Pendant NecklacesPendant & Charms Type: PendantsCountry of Origin: Imported",
            "price": 149,
            "listprice": 624,
            "url": "https://www.dpbolvw.net/click-100400593-13419515?url=https%3A%2F%2Fwww.jcpenney.com%2Fp%2Fwomens-10k-gold-heart-pendant-necklace%2Fppr5008402640%3FpTmplType%3Dregular",
            "image": "https://jcpenney.scene7.com/is/image/JCPenney/DP1211202307134876M?wid=450&hei=450&op_sharpen=1",
            "color": [
                "gold",
                "no color",
                "yellow"
            ],
            "additional_image": "https://jcpenney.scene7.com/is/image/JCPenney/DP1211202307134979M.tif?wid=450&hei=450&op_sharpen=1",
            "availability": "in stock",
            "product_brand": "fine jewelry",
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "size": [
                "one size"
            ],
            "mfr_code": "28223070018_No Color",
            "category": "necklaces",
            "subcategories": [
                "pendant necklace"
            ],
            "product_tag": [
                "heart pendant necklace",
                "gold heart jewelry",
                "women's gold necklace",
                "pendant necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook"
            ],
            "currency": "USD",
            "brand": "jcpenney",
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "currency_symbol": "&#36;",
            "discount": "above 60",
            "material": [
                "yellow gold"
            ],
            "occasion": [
                "party wear",
                "events"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "silver heart chain"
            ],
            "score": 0.9,
            "name": "Sterling Silver Puffed Heart Pendant Necklace, One Size",
            "description": "Features: Quick ShipJewelry Closure: Spring Ring ClaspLink Construction: SolidShape: HeartMetal Color: WhiteChain Length: 18 InchPendant Length: 9.6mmChain Construction: CableCare: Wipe CleanMetal: Sterling SilverNecklace Type: Pendant NecklacesCountry of Origin: Imported",
            "price": 43,
            "listprice": 124,
            "url": "https://www.tkqlhce.com/click-100400593-13419515?url=https%3A%2F%2Fwww.jcpenney.com%2Fp%2Fsterling-silver-puffed-heart-pendant-necklace%2Fpp5007620225%3FpTmplType%3Dregular",
            "image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0531201617024444M?wid=450&hei=450&op_sharpen=1",
            "color": [
                "silver",
                "no color"
            ],
            "additional_image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0709202307054910M.tif?wid=450&hei=450&op_sharpen=1",
            "availability": "in stock",
            "product_brand": "fine jewelry",
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "size": [
                "one size"
            ],
            "mfr_code": "29013410018_No Color",
            "category": "necklaces",
            "subcategories": [
                "pendant necklace"
            ],
            "product_tag": [
                "sterling silver necklace",
                "heart pendant jewelry",
                "silver puffed necklace",
                "pendant necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook"
            ],
            "currency": "USD",
            "brand": "jcpenney",
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "currency_symbol": "&#36;",
            "discount": "above 60",
            "material": [
                "sterling silver"
            ],
            "occasion": [
                "modern wear",
                "casual wear",
                "party wear"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "silver heart chain"
            ],
            "score": 0.8466779666716678,
            "mfr_code": "amz_B0CGPP8YT9",
            "brand": "amazon",
            "product_brand": "alexandreasjewels",
            "name": "Large Sterling Silver Heart Necklace, Puffed Heart Pendant Necklace, Perfect Gift Birthday Christmas Mother's Day Gift for Wife, Daughter or Mom (18 inches plus 2-inch extender)",
            "price": 30,
            "listprice": 30,
            "url": "https://www.amazon.com/dp/B0CGPP8YT9/?tag=budgettrave0c-20&linkCode=osi&th=1&psc=1&utm_source=unthink&utm_medium=web",
            "image": "https://m.media-amazon.com/images/I/31HyZFlh5fL._SL500_.jpg",
            "additional_image": "https://m.media-amazon.com/images/I/51KZ0s+SJ6L._SL500_.jpg",
            "currency": "USD",
            "availability": "in stock",
            "description": "Made with excellent quality high polish sterling silver; This large heart necklace is designed to represent boundless love and affection in its voluminous heart shape, Pendant Size: Pendant Size: Approx. 18 millimeters (0.71 inch) width. Thickness: 9 millimeters (0.35 inch); Please see the succeeding photos for size reference, Comes with an Italian made sterling silver necklace chain, the chain type that does not tangle so easily; Please see necklace sizing and necklace measuring guide photos and select preference from available lengths, It's beautifully packaged in an elegant gift box, ready for gifting, Hangs on a linen card with a floral design where you can handwrite your own personalized and heartfelt message",
            "color": [
                "silver"
            ],
            "size": [
                "18 inches plus 2-inch extender"
            ],
            "category": "necklaces",
            "subcategories": [
                "pendant necklace"
            ],
            "product_tag": [
                "sterling silver necklace",
                "heart pendant jewelry",
                "gift necklace for her",
                "pendant necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook",
                "budgettravel"
            ],
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "currency_symbol": "&#36;",
            "discount": "no discount",
            "material": [
                "sterling silver"
            ],
            "occasion": [
                "events",
                "minimalist"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "silver heart chain"
            ],
            "score": 0.844321521141917,
            "mfr_code": "amz_B0CHWB7QBM",
            "brand": "amazon",
            "product_brand": "ross-simons",
            "name": "Ross-Simons Italian Sterling Silver Puffed Heart Anklet. 9 inches",
            "price": 59,
            "listprice": 59,
            "url": "https://www.amazon.com/dp/B0CHWB7QBM/?tag=budgettrave0c-20&linkCode=osi&th=1&psc=1&utm_source=unthink&utm_medium=web",
            "image": "https://m.media-amazon.com/images/I/31LyXMwqhiL._SL500_.jpg",
            "additional_image": "https://m.media-amazon.com/images/I/41jjNWxleOL._SL500_.jpg",
            "currency": "USD",
            "availability": "in stock",
            "description": "Sterling silver, anklet for women., 3/16\" wide., Springring clasp for safety and security., Polished sterling silver. Crafted in Italy., Includes jewelry presentation box.",
            "color": [
                "silver"
            ],
            "size": [
                "9 inches"
            ],
            "category": "anklets",
            "subcategories": [
                "anklet"
            ],
            "product_tag": [
                "italian silver anklet",
                "sterling silver jewelry",
                "women's anklet chain",
                "anklet"
            ],
            "store": [
                "fashiondemo",
                "dothelook",
                "budgettravel"
            ],
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "currency_symbol": "&#36;",
            "discount": "no discount",
            "material": [
                "sterling silver"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        },
        {
            "tagged_by": [
                "silver heart chain"
            ],
            "score": 0.27094702800000003,
            "name": "Yes, Please! Womens Diamond Accent Natural Diamond Sterling Silver Heart Pendant Necklace, 18",
            "description": "This Yes, Please! Sterling Silver pendant necklace is a sweet style addition to any jewelry collection. It features a heart-shaped pendant with a pave genuine diamond interior layer and comes on a dainty rope chain. Style with any day or night outfit or gift it to loved ones for any occasion. Features: Diamond Accent, In A Gift BoxDiamond Clarity: I3Jewelry Closure: Spring Ring ClaspLink Construction: SolidSetting: PaveShape: HeartStone Cut: RoundDiamond Color: I-JMetal Color: WhiteChain Length: 18 InchPendant Length: 24.3mmPendant Width: 19.8mmRounded Carat Weight: Less Than 1/10 Ct.t.wChain Construction: RopeCare: Wipe CleanStone Type: 3 Natural DiamondAuthenticity: Natural DiamondMetal: Sterling SilverNecklace Type: Pendant NecklacesCountry of Origin: Imported",
            "price": 15,
            "listprice": 74,
            "url": "https://www.dpbolvw.net/click-100400593-13419515?url=https%3A%2F%2Fwww.jcpenney.com%2Fp%2Fyes-please-womens-diamond-accent-natural-diamond-sterling-silver-heart-pendant-necklace%2Fppr5008378464%3FpTmplType%3Dregular",
            "image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0822202313030485M?wid=450&hei=450&op_sharpen=1",
            "color": [
                "silver",
                "no color"
            ],
            "additional_image": "https://jcpenney.scene7.com/is/image/JCPenney/DP0822202313030589M.tif?wid=450&hei=450&op_sharpen=1",
            "availability": "in stock",
            "product_brand": "fine jewelry",
            "gender": [
                "female"
            ],
            "age_group": [
                "adult"
            ],
            "size": [
                "18"
            ],
            "mfr_code": "28370670091_No Color",
            "category": "necklaces",
            "subcategories": [
                "pendant necklace"
            ],
            "product_tag": [
                "diamond pendant necklace",
                "heart pendant jewelry",
                "sterling silver necklace",
                "pendant necklace"
            ],
            "store": [
                "fashiondemo",
                "dothelook"
            ],
            "currency": "USD",
            "brand": "jcpenney",
            "scent": "",
            "fragrance": "",
            "avlble": 1,
            "currency_symbol": "&#36;",
            "discount": "above 60",
            "material": [
                "sterling silver"
            ],
            "occasion": [
                "party wear",
                "events"
            ],
            "shape": [
                "heart"
            ],
            "is_search": true
        }
    ],
    "order": 46,
    "created_on": 1762345762712,
    "modified_on": 1764576773483,
    "additional_tags": [],
    "tag_map": {
        "pearl bow chain": [
            "pearl bow chain"
        ],
        "open heart chain": [
            "open heart chain"
        ],
        "stone bow chain": [],
        "pearl U-chain": [],
        "inlay heart chain": [],
        "gold heart chain": [
            "gold heart chain"
        ],
        "silver heart chain": [
            "silver heart chain"
        ]
    },
    "tagged_show_filters": {
        "pearl bow chain": {
            "additional_tags": [],
            "age_group": [
                "adult"
            ],
            "brand": [
                "amazon"
            ],
            "color": [
                "yellow gold",
                "gold",
                "yellow"
            ],
            "discount": [
                "no discount"
            ],
            "gender": [
                "female"
            ],
            "generated_tags": [],
            "material": [
                "yellow gold"
            ],
            "occasion": [
                "party wear",
                "casual wear"
            ],
            "original_tags": [
                "pearl bow chain"
            ],
            "processed_tags": [
                "pearl bow chain"
            ],
            "product_brand": [
                "pavoi"
            ],
            "style": [
                "statement"
            ],
            "tag_map": {
                "pearl bow chain": [
                    "pearl bow chain"
                ]
            },
            "price": {
                "min": 18,
                "max": 18
            }
        },
        "open heart chain": {
            "additional_tags": [],
            "age_group": [
                "adult"
            ],
            "brand": [
                "amazon"
            ],
            "color": [
                "gold",
                "gd"
            ],
            "discount": [
                "no discount"
            ],
            "gender": [
                "female"
            ],
            "generated_tags": [],
            "material": [
                "brass"
            ],
            "occasion": [
                "party wear",
                "events"
            ],
            "original_tags": [
                "open heart chain"
            ],
            "processed_tags": [
                "open heart chain"
            ],
            "product_brand": [
                "sufope"
            ],
            "style": [
                "dainty"
            ],
            "tag_map": {
                "open heart chain": [
                    "open heart chain"
                ]
            },
            "price": {
                "min": 13,
                "max": 13
            }
        },
        "stone bow chain": {
            "additional_tags": [],
            "generated_tags": [],
            "original_tags": [],
            "processed_tags": [],
            "tag_map": {
                "stone bow chain": []
            },
            "price": {
                "min": "NA",
                "max": "NA"
            }
        },
        "pearl U-chain": {
            "additional_tags": [],
            "generated_tags": [],
            "original_tags": [],
            "processed_tags": [],
            "tag_map": {
                "pearl U-chain": []
            },
            "price": {
                "min": "NA",
                "max": "NA"
            }
        },
        "inlay heart chain": {
            "additional_tags": [],
            "generated_tags": [],
            "original_tags": [],
            "processed_tags": [],
            "tag_map": {
                "inlay heart chain": []
            },
            "price": {
                "min": "NA",
                "max": "NA"
            }
        },
        "gold heart chain": {
            "additional_tags": [],
            "age_group": [
                "adult"
            ],
            "brand": [
                "amazon",
                "jcpenney"
            ],
            "color": [
                "yellow",
                "rose gold",
                "silver",
                "gold",
                "no color"
            ],
            "discount": [
                "no discount",
                "above 60"
            ],
            "gender": [
                "female"
            ],
            "generated_tags": [],
            "material": [
                "18k gold plated",
                "yellow gold",
                "brass"
            ],
            "occasion": [
                "party wear",
                "casual wear",
                "events",
                "minimalist",
                "modern wear"
            ],
            "original_tags": [
                "gold heart chain"
            ],
            "processed_tags": [
                "gold heart chain"
            ],
            "product_brand": [
                "honeycat",
                "fine jewelry"
            ],
            "style": [
                "minimalist",
                "delicate",
                "lariat"
            ],
            "tag_map": {
                "gold heart chain": [
                    "gold heart chain"
                ]
            },
            "price": {
                "min": 29,
                "max": 503
            }
        },
        "silver heart chain": {
            "additional_tags": [],
            "age_group": [
                "adult"
            ],
            "brand": [
                "amazon",
                "jcpenney"
            ],
            "color": [
                "a2: silver",
                "silver",
                "no color"
            ],
            "discount": [
                "no discount",
                "above 60"
            ],
            "gender": [
                "female"
            ],
            "generated_tags": [],
            "material": [
                "sterling silver",
                "stainless steel"
            ],
            "occasion": [
                "party wear",
                "casual wear",
                "events",
                "minimalist",
                "modern wear"
            ],
            "original_tags": [
                "silver heart chain"
            ],
            "processed_tags": [
                "silver heart chain"
            ],
            "product_brand": [
                "ross-simons",
                "alexandreasjewels",
                "daochong",
                "fine jewelry",
                "milakoo"
            ],
            "tag_map": {
                "silver heart chain": [
                    "silver heart chain"
                ]
            },
            "price": {
                "min": 12,
                "max": 69
            }
        }
    },
    "collection_id": "201336425631929205468411427766860715730",
    "cover_image": "https://m.media-amazon.com/images/I/31qcB1XlI6L._SL500_.jpg",
    "userMetadata": {},
    "user_name": "dothelook",
    "influencer_code": "UTH-DIRECT",
    "profile_image": "https://cdn.unthink.ai/img/unthink_ai/DALL%C2%B7E%202024-11-22%2013.18.32%20-%20A%20modern%20and%20stylish%20logo%20design%20for%20a%20website%20named%20%27dothelook%27%20that%20combines%20elements%20of%20fashion%20and%20home%20decor.%20The%20logo%20features%20a%20sleek%20and%20elega_alxbhgc.webp",
    "profile_link": "https://unthink.ai/influencer/dothelook"
}


  // products: collectionData.product_lists.map(p => ({
  //   name: p.name,
  //   price: p.price,
  //   listPrice: p.listprice,
  //   image: p.image,
  //   url: p.url,
  //   availability: p.availability,
  //   gender: p.gender,
  //   ageGroup: p.age_group,
  //   size: p.size,
  //   color: p.color,
  //   brand: p.product_brand,
  //   taggedBy: p.tagged_by,
  //   category: p.category,
  //   discount: p.discount,
  //   material: p.material
  // })),



  // const videoContainerRef = useRef(null);


  // const handleMouseEnter = () => {
  //   if (!videoUrl) return;
  //   videoContainerRef.current?.play?.().catch(() => {});
  // };

  // const handleMouseLeave = () => {
  //   videoContainerRef.current?.pause?.();
  //   if (videoContainerRef.current) videoContainerRef.current.currentTime = 0; // optional: reset to start
  // };

  return (
    <div className="max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto     px-14">
      <HeroSection im={im} collectionData={collection} />

      <DealsAndTrends />

      <SplitDiscoverySection />
      {/* <DiscoverHiddenTreasures /> */}


    </div>
  );
};

export default HomePageNew;
