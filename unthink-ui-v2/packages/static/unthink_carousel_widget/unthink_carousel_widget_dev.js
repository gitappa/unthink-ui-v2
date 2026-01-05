/**
 * this is the dev file for the bt carousal
 * make sure to to build the file before pushing the code
 * command to build this js file = npx webpack --config webpack_configs/bt_carousel_webpack.config.js
 * webpack configuration added in webpack_configs/bt_carousel_webpack.config.js
 * css file will also be added in the final js single file
 */

import "./bt_carousel.css"; // will be build in single file with webpack to the file = bt_carousel.js

let UNuser_name = "dothelook";
let UNapi_url = "";
let UNdomain = "";
const UNhostsToShowTitle = [];
const UNcarouselTitle = "Featured Collections";
const UNcurrentHost = window.location.host;

class MainCarouselWidget {
    constructor() {
        if (window.location.pathname === "/") this.init();
    }

    getFinalImageUrl(imgUrl, dimensionWidth, dimensionHeight) {
        try {
            let url = imgUrl;
            if (url) {
                if (!url.includes("unthink_main_2023") &&
                    (url.includes("unthink_webflow") || url.includes("unthink_main"))) {
                    const URLData = new URL(imgUrl);
                    url = URLData.origin + URLData.pathname
                        .replace("unthink_webflow", "unthink_main_2023")
                        .replace("unthink_main", "unthink_main_2023") + ".webp";
                }

                if (url.includes("unthink_main_2023") && url.includes(".webp") && dimensionWidth && dimensionHeight) {
                    url = url.replace(".webp", `_${dimensionWidth}_${dimensionHeight}.webp`);
                }
            }
            return url;
        } catch {
            return imgUrl;
        }
    }

    async loadUI(blogCollections) {
        const mainContainer = document.getElementById("un_bt_gallery");

        if (UNhostsToShowTitle.includes(UNcurrentHost)) {
            const title_container = document.createElement("div");
            title_container.className = "un_bt_carousel_title_container";

            const mainTitle = document.createElement("h1");
            mainTitle.append(UNcarouselTitle);
            mainTitle.className = "un_bt_carousel_main_title";
            title_container.appendChild(mainTitle);
            mainContainer.appendChild(title_container);
        }

        const innerContainer = document.createElement("div");
        innerContainer.className = "un_bt_gallery_container";
        mainContainer.appendChild(innerContainer);

        blogCollections.length >= 5 &&
            blogCollections.forEach((collection, index) => {
                const card = document.createElement("div");
                const picture_el = document.createElement("picture");

                const sizes = [
                    { w: "220", h: "220", media: "(max-width: 512px)" },
                    { w: "340", h: "340", media: "(max-width: 1024px)" },
                    { w: "340", h: "340", media: null }
                ];

                sizes.forEach(({ w, h, media }) => {
                    const source = document.createElement("source");
                    source.setAttribute("srcset", this.getFinalImageUrl(collection.cover_image, w, h));
                    if (media) source.setAttribute("media", media);
                    picture_el.appendChild(source);
                });

                const img = document.createElement("img");
                img.src = this.getFinalImageUrl(collection.cover_image, "340", "340");
                img.alt = "collection cover image";
                img.className = "un_bt_cover_image";
                img.loading = "lazy";
                img.height = "100%";
                img.width = "100%";
                picture_el.appendChild(img);
                card.appendChild(picture_el);

                card.appendChild(document.createElement("div")).className = "un_bt_title_gradiant";

                const title = document.createElement("div");
                title.className = "un_bt_card_title";
                title.appendChild(document.createElement("h1")).innerText = collection?.collection_name;
                card.appendChild(title);

                card.classList.add("un_bt_gallery_item", `un_bt_gallery_item_${index + 1}`);

                // card.addEventListener("click", () => {
                //     let path = `/influencer/${UNuser_name}/${collection._id}`;
                //     if (collection.path) {
                //         if (UNuser_name === "budgettravel") {
                //             path = `/collections/${collection.path}`;
                //         } else {
                //             path = `/${UNuser_name}/collections/${collection.path}`;
                //         }
                //     }

                //     const a = document.createElement("a");
                //     a.href = `${UNdomain || "https://shop.budgettravel.com"}${path}`;
                //     // a.target = "_blank";
                //     a.rel = "noopener noreferrer";
                //     a.click();
                // });

                console.log("collection.collection_id", collection.collection_id);
                console.log("collection.collection_id", collection._id);


                card.addEventListener("click", () => {
                    const id = collection.collection_id;
                    if (id) {
                        window.location.href = `collection/${id}`;
                    } else {
                        console.warn("Missing collection_id:", collection);
                    }
                });


                innerContainer.appendChild(card);
            });

        // Arrows
        const arrow_icon = document.createElement("img");
        arrow_icon.src = "https://cdn.unthink.ai/docs/arrow_icon.png";
        arrow_icon.alt = "carousel navigation icon";

        const addArrow = (className) => {
            const container = document.createElement("div");
            container.className = `un_bt_gallery_controls ${className}`;
            const button = document.createElement("button");
            button.className = "un_bt_gallery_controls_inner_container";
            button.setAttribute("aria-label", "carousel slide button");
            button.appendChild(arrow_icon.cloneNode());
            container.appendChild(button);
            innerContainer.appendChild(container);
        };

        addArrow("un_bt_gallery_controls_next");
        addArrow("un_bt_gallery_controls_previous");
    }

    async init() {
        try {
            UNdomain = await this.fetchDomain();

            UNapi_url = `https://auraprod.unthink.ai/user/collections/fetch_collections/?user_name=${UNuser_name}&store=${UNuser_name}&status=published&starred=true&summary=true`;

            const response = await fetch(UNapi_url);
            const json = await response.json();
            const blogCollections = json?.data
                ?.filter(c => c.status === "published" && c.starred && !!c.cover_image)
                .slice(0, 10);

            if (blogCollections?.length >= 5) {
                this.loadUI(blogCollections);

                setTimeout(() => {
                    const galleryItems = document.querySelectorAll(".un_bt_gallery_item");
                    const carousel = new UnthinkCarousel(galleryItems);
                    carousel.useControls();
                }, 100);
            }
        } catch (e) {
            console.error("Failed to initialize carousel:", e);
        }
    }

    async fetchDomain() {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            UNuser_name = "dothelook";
            return "http://localhost:8000";
        }

        if (window.unthink?.storeId) {
            const storeId = window.unthink.storeId;
            const res = await fetch(`https://aurastage.unthink.ai/users/store/get_domain/?store_id=${storeId}`);
            const json = await res.json();
            if (json.status_code === 200 && json.status === "Success") {
                UNuser_name = json.data.store_name || UNuser_name;
                return json.data.admin_url?.mapped_url || json.data.admin_url?.main_url;
            }
        }

        if (window.Shopify?.shop) {
            const shop = window.Shopify.shop;
            const res = await fetch(`https://aurastage.unthink.ai/users/store/get_domain/?domain=${shop}`);
            const json = await res.json();
            if (json.status_code === 200 && json.status === "Success") {
                UNuser_name = json.data.store_name || UNuser_name;
                return json.data.admin_url?.mapped_url || json.data.admin_url?.main_url;
            }
        }

        return "https://shop.budgettravel.com";
    }
}

class UnthinkCarousel {
    constructor(items) {
        this.carouselArray = [...items];
    }

    updateGallery() {
        this.carouselArray.forEach((el, i) => {
            for (let j = 1; j <= 5; j++) el.classList.remove(`un_bt_gallery_item_${j}`);
        });
        this.carouselArray.slice(0, 5).forEach((el, i) => {
            el.classList.add(`un_bt_gallery_item_${i + 1}`);
        });
    }

    setCurrentState(direction) {
        if (direction.classList.contains("un_bt_gallery_controls_previous")) {
            this.carouselArray.unshift(this.carouselArray.pop());
        } else {
            this.carouselArray.push(this.carouselArray.shift());
        }
        this.updateGallery();
    }

    useControls() {
        document.querySelectorAll(".un_bt_gallery_controls").forEach(control => {
            control.addEventListener("click", e => {
                e.preventDefault();
                this.setCurrentState(control);
            });
        });
    }
}

new MainCarouselWidget();
