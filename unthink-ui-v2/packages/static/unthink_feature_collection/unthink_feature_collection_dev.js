/**
 * this is the dev file for the samskara collection cards
 * make sure to to build the file before pushing the code
 * command to build this js file = npx webpack --config webpack_configs/samskara_collection_cards_webpack.config.js
 * webpack configuration added in webpack_configs/samskara_collection_cards_webpack.config.js
 * css file will also be added in the final js single file if present
 */
// local start - npx serve .

import "./bt_carousel.css"; // will be build in single file with webpack to the file = bt_carousel.js
var UNuser_name = "fashiondemo";
var UNapi_url = "";
var domain = "";

// ✅ Class with NO auto init in constructor
class MainUnthinkSamskaraWidget {
    async loadUI(publishedBlogCollection = []) {
        const mainContainer = document.getElementById("featured-collections");
        const clonedNode = mainContainer.querySelector(".collection-card");

        function getPlatform() {
            return /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "web";
        }

        if (clonedNode) {
            const cards = publishedBlogCollection.map((collection) => {
                const card = clonedNode.cloneNode(true);
                const platform = getPlatform();
                card.style.display = "block";

                const img = card.querySelector("img");
                img.src = collection?.cover_image;
                img.removeAttribute("srcset");
                img.removeAttribute("sizes");
                img.style.opacity = 1;

                const anchor = card.querySelector("a");
                anchor.href = `${domain}/collections/${collection?.path}?utm_source=unthink&utm_medium=${platform}&utm_campaign=${collection?.collection_id}&utm_content=unthink_collection_featured_widget&unthink_source=unthink_collection_featured_widget&unthink_medium=${platform}&unthink_campaign=${collection?.collection_id}`;

                const title = card.querySelector(".collection-item__title");
                title.innerHTML = `<span>${collection?.collection_name}</span>`;

                return card;
            });

            clonedNode.remove();
            mainContainer.prepend(...cards);
        }
    }

    init() {
        fetch(UNapi_url)
            .then((response) => response.json())
            .then((response) => {
                console.log("API Response", response);
                const blogCollections = response?.data
                    ?.filter(
                        (collection) =>
                            collection.status === "published" &&
                            collection.starred &&
                            !!collection.cover_image &&
                            !!collection.collection_name &&
                            !!collection.path
                    )
                    .slice(0, 4);

                if (blogCollections?.length >= 4) {
                    this.loadUI(blogCollections);
                }
            });
    }
}

// ✅ IIFE for setup
(async function initSamskaraWidget() {
    try {
        const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

        if (isLocalhost) {
            domain = "http://localhost:8000";
            UNuser_name = "fashiondemo";
        } else if (window.location.hostname === "unthink.shop") {
            domain = "https://unthink.shop";
            UNuser_name = "fashiondemo";
        } else if (window?.unthink?.storeId) {
            const storeId = window.unthink.storeId;
            const res = await fetch(`https://aurastage.unthink.ai/users/store/get_domain/?store_id=${storeId}`);
            const json = await res.json();
            if (json.status_code === 200 && json.status === "Success" && json.data) {
                domain = json.data.admin_url?.mapped_url || json.data.admin_url?.main_url;
                UNuser_name = json.data.store_name || UNuser_name;
            } else {
                throw new Error(json.status_desc || "Invalid store API response.");
            }
        } else if (window?.Shopify?.shop) {
            const shopDomain = window.Shopify.shop;
            const res = await fetch(`https://aurastage.unthink.ai/users/store/get_domain/?domain=${shopDomain}`);
            const json = await res.json();
            if (json.status_code === 200 && json.status === "Success" && json.data) {
                domain = json.data.admin_url?.mapped_url || json.data.admin_url?.main_url;
                UNuser_name = json.data.store_name || UNuser_name;
            } else {
                throw new Error(json.status_desc || "Invalid Shopify API response.");
            }
        } else {
            throw new Error("No valid store identifier found.");
        }

        UNapi_url = `https://auraprod.unthink.ai/user/collections/fetch_collections/?user_name=${UNuser_name}&store=${UNuser_name}&status=published&starred=true&summary=true`;

        // ✅ Only one init call here
        new MainUnthinkSamskaraWidget().init();
    } catch (err) {
        console.error("Error initializing Samskara widget:", err);
    }
})();