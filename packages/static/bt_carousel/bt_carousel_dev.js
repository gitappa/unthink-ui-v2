/**
 * this is the dev file for the bt carousal
 * make sure to to build the file before pushing the code
 * command to build this js file = npx webpack --config webpack_configs/bt_carousel_webpack.config.js
 * webpack configuration added in webpack_configs/bt_carousel_webpack.config.js
 * css file will also be added in the final js single file
 */

import "./bt_carousel.css"; // will be build in single file with webpack to the file = bt_carousel.js

let UNuser_name = "dothelook";
let UNapi_url =
	"https://auraprod.unthink.ai/user/collections/fetch_collections/";
var UNcurrentHost = window.location.host;
var UNhostsToShowTitle = [];
var UNcarouselTitle = "Featured Collections";

switch (UNcurrentHost) {
	case "unthink-ui-gatsby-unthink-stage-qvde2butpa-uc.a.run.app":
	case "www.unthink-ui-gatsby-unthink-stage-qvde2butpa-uc.a.run.app":
		UNuser_name = "unthinkai";
		UNapi_url =
			"https://auraprod.unthink.ai/user/collections/fetch_collections/";
		break;
	case "budgettravel.com":
	case "www.budgettravel.com":
		UNuser_name = "budgettravel";
		UNapi_url =
			"https://auraprod.unthink.ai/user/collections/fetch_collections/";
		break;
	default:
		break;
}

class MainCarouselWidget {
	constructor() {
		if (window.location.pathname === "/") this.init();
	}

	getFinalImageUrl(imgUrl, dimensionWidth, dimensionHeight) {
		try {
			let url = imgUrl;
			if (url) {
				if (
					!url.includes("unthink_main_2023") &&
					(url.includes("unthink_webflow") || url.includes("unthink_main"))
				) {
					const URLData = new URL(imgUrl);
					if (url.includes("unthink_webflow")) {
						url =
							URLData.origin +
							URLData.pathname.replace("unthink_webflow", "unthink_main_2023") +
							".webp";
					} else if (url.includes("unthink_main")) {
						url =
							URLData.origin +
							URLData.pathname.replace("unthink_main", "unthink_main_2023") +
							".webp";
					}
				}

				if (
					url.includes("unthink_main_2023") &&
					url.includes(".webp") &&
					dimensionWidth &&
					dimensionHeight
				) {
					url = url.replace(
						".webp",
						`_${dimensionWidth}_${dimensionHeight}.webp`
					);
				}
			}

			return url;
		} catch (error) {
			return imgUrl;
		}
	}

	async loadUI(blogCollections) {
		//     const mainContainer = document.createElement("div");
		//     mainContainer.className = "un_bt_gallery";
		//     mainContainer.id = "un_bt_carousel";
		//     const bt_elements = document.querySelectorAll(".general-section");
		//     const refnode = bt_elements[0];
		//     refnode.insertBefore(mainContainer, refnode.childNodes[1].nextSibling);
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
		innerContainer.setAttribute("class", "un_bt_gallery_container");
		mainContainer.appendChild(innerContainer);

		const publishedBlogCollection = blogCollections;

		//cards
		publishedBlogCollection.length >= 5 &&
			publishedBlogCollection?.forEach((collection, index) => {
				const card = document.createElement("div");

				const picture_el = document.createElement("picture");

				const source_el_512 = document.createElement("source");
				source_el_512.setAttribute(
					"srcset",
					this.getFinalImageUrl(collection?.cover_image, "220", "220")
				);
				source_el_512.setAttribute("media", "(max-width: 512px)");
				picture_el.appendChild(source_el_512);

				const source_el_1024 = document.createElement("source");
				source_el_1024.setAttribute(
					"srcset",
					this.getFinalImageUrl(collection?.cover_image, "340", "340")
				);
				source_el_1024.setAttribute("media", "(max-width: 1024px)");
				picture_el.appendChild(source_el_1024);

				const source_el = document.createElement("source");
				source_el.setAttribute(
					"srcset",
					this.getFinalImageUrl(collection?.cover_image, "340", "340")
				);
				picture_el.appendChild(source_el);

				const img_el = document.createElement("img");
				img_el.setAttribute(
					"src",
					this.getFinalImageUrl(collection?.cover_image, "340", "340")
				);
				img_el.setAttribute("alt", "collection cover image");
				img_el.setAttribute("class", "un_bt_cover_image");
				img_el.setAttribute("loading", "lazy");
				img_el.setAttribute("height", "100%");
				img_el.setAttribute("width", "100%");
				picture_el.appendChild(img_el);

				card.appendChild(picture_el);

				card.appendChild(document.createElement("div")).className =
					"un_bt_title_gradiant";

				const title = document.createElement("div");
				title.className = "un_bt_card_title";
				title.appendChild(document.createElement("h1")).innerText =
					collection?.collection_name;

				card.appendChild(title);

				card.classList.add(
					"un_bt_gallery_item",
					`un_bt_gallery_item_${index + 1}`
				);
				card.addEventListener("click", () => {
					let path = `/influencer/${UNuser_name}/${collection._id}`;

					if (collection.path) {
						if (UNuser_name === "budgettravel") {
							path = `/collections/${collection.path}`;
						} else {
							path = `/${UNuser_name}/collections/${collection.path}`;
						}
					}

					window.location.href = `https://shop.budgettravel.com${path}`;
				});
				innerContainer.appendChild(card);
			});

		// arrows
		const arrow_icon = document.createElement("img");
		arrow_icon.setAttribute(
			"src",
			"https://cdn.unthink.ai/docs/arrow_icon.png"
		);
		arrow_icon.setAttribute("alt", "carousel navigation icon");
		const leftArrowContainer = document.createElement("div");
		leftArrowContainer.classList.add(
			"un_bt_gallery_controls",
			"un_bt_gallery_controls_next"
		);
		const leftArrowButton = document.createElement("button");
		leftArrowButton.classList.add("un_bt_gallery_controls_inner_container");
		leftArrowButton.setAttribute("aria-label", "carousel left slide button");
		leftArrowButton.appendChild(arrow_icon);
		leftArrowContainer.appendChild(leftArrowButton);

		const rightArrowContainer = document.createElement("div");
		rightArrowContainer.classList.add(
			"un_bt_gallery_controls",
			"un_bt_gallery_controls_previous"
		);
		const rightArrowButton = document.createElement("button");
		rightArrowButton.classList.add("un_bt_gallery_controls_inner_container");
		rightArrowButton.setAttribute("aria-label", "carousel right slide button");
		rightArrowButton.appendChild(arrow_icon.cloneNode());
		rightArrowContainer.appendChild(rightArrowButton);

		innerContainer.appendChild(leftArrowContainer);
		innerContainer.appendChild(rightArrowContainer);
	}

	// loadCss() {
	//   var css_link_tag = document.createElement("link");
	//   css_link_tag.setAttribute("type", "text/css");
	//   css_link_tag.setAttribute("rel", "stylesheet");
	//   css_link_tag.setAttribute(
	//     "href",
	//     "https://cdn.yfret.com/static/js/components/bt_carousel.css"
	//   );
	//   (
	//     document.getElementsByTagName("head")[0] || document.documentElement
	//   ).appendChild(css_link_tag);
	// }

	init() {
		// this.loadCss();

		fetch(
			`${UNapi_url}?user_name=${UNuser_name}&store=${UNuser_name}&status=published&starred=true&summary=true`
		)
			.then((response) => response.json())
			.then((response) => {
				const blogCollections = response?.data
					?.filter(
						(collection) =>
							collection.status === "published" &&
							collection.starred &&
							!!collection.cover_image
					)
					.slice(0, 10);

				if (blogCollections?.length >= 5) {
					class UnthinkCarousel {
						constructor(items) {
							this.carouselArray = [...items];
						}
						// Update css classes for gallery
						updateGallery() {
							this.carouselArray.forEach((el) => {
								el.classList.remove("un_bt_gallery_item_1");
								el.classList.remove("un_bt_gallery_item_2");
								el.classList.remove("un_bt_gallery_item_3");
								el.classList.remove("un_bt_gallery_item_4");
								el.classList.remove("un_bt_gallery_item_5");
							});

							this.carouselArray.slice(0, 5).forEach((el, i) => {
								el.classList.add(`un_bt_gallery_item_${i + 1}`);
							});
						}

						// Update the current order of the carouselArray and gallery
						setCurrentState(direction) {
							if (
								JSON.stringify(direction.classList).includes(
									"un_bt_gallery_controls_previous"
								)
							) {
								this.carouselArray.unshift(this.carouselArray.pop());
							} else {
								this.carouselArray.push(this.carouselArray.shift());
							}

							this.updateGallery();
						}

						// Add a click event listener to trigger setCurrentState method to rearrange carousel
						useControls() {
							const triggers = document.querySelectorAll(
								".un_bt_gallery_controls"
							);

							triggers.forEach((control) => {
								control.addEventListener("click", (e) => {
									e.preventDefault();
									this.setCurrentState(control);
								});
							});
						}
					}

					this.loadUI(blogCollections);
					const galleryItems = document.querySelectorAll(".un_bt_gallery_item");
					const budgetTravelWidget = new UnthinkCarousel(galleryItems);
					budgetTravelWidget.useControls();
				}
			});
	}
}

const carouselWidget = new MainCarouselWidget();
