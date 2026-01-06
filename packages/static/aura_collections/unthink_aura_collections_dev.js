/**
 * this is the dev file for the unthink aura collection cards
 * make sure to build the file before pushing the code
 * command to build this js file = npx webpack --config webpack_configs/unthink_aura_collections_webpack.config.js
 * webpack configuration added in webpack_configs/unthink_aura_collections_webpack.config.js
 * css file will also be added in the final js single file if present
 * the final file file would be added on CDN on this URL = https://cdn.unthink.ai/docs/unthink_aura_collections.js
 */

// import "./unthink_aura_collections.css"; // will be build in single file with webpack to the file = unthink_aura_collections.js

const mainContainerId = "unthink-featured-collections";
let UNuser_name = "";
let UNfetch_collections_api_url = "";
let UN_store_url = "";
let UN_Collections_to_show = 3;
var UNcurrentHost = window.location.host;

switch (UNcurrentHost) {
	case "heroesvillains.com":
	case "www.heroesvillains.com":
		UNuser_name = "heroesvillains";
		UNfetch_collections_api_url =
			"https://auraprod.unthink.ai/user/collections/fetch_collections/";
		UN_store_url = "https://inspiration.heroesvillains.com";
		UN_Collections_to_show = 3;
		break;
	case "127.0.0.1:5500":
		UNuser_name = "unthink_ai";
		UNfetch_collections_api_url =
			"https://aurastage.unthink.ai/user/collections/fetch_collections/";
		UN_store_url = "http://localhost:8000";
		UN_Collections_to_show = 3;
		break;
	default:
		break;
}

class MainUnthinkAuraCollectionsWidget {
	constructor() {
		if (window.location.pathname === "/" && UNuser_name) this.init();
	}

	async loadUI(publishedBlogCollection = []) {
		const mainContainer = document.getElementById(mainContainerId);
		mainContainer.innerHTML = "";

		const collectionCards = publishedBlogCollection.map((collection) => {
			const collectionImage = document.createElement("img");
			collectionImage.className = "collection-card-img";
			collectionImage.src = collection.cover_image;
			collectionImage.style =
				"width: 100%; aspect-ratio: 1 / 1; object-fit: cover; height: fit-content;";

			const collectionName = document.createElement("p");
			collectionName.className = "collection-card-name";
			collectionName.style =
				"margin: 0 auto; padding: 10px 28px; background-color: #000; width: fit-content; color: #fff; text-align: center;";
			collectionName.innerText = collection.collection_name;

			const collectionNameWrapper = document.createElement("div");
			collectionNameWrapper.className = "collection-card-name-wrapper";
			collectionNameWrapper.style =
				"position: absolute; bottom: 48px; font-size: 15px; line-height: 1.6; font-weight: 600; left: 0; right: 0; letter-spacing: 0.75px; padding: 0 48px;";

			collectionNameWrapper.append(collectionName);

			const collectionCard = document.createElement("a");
			collectionCard.className = "collection-card";
			collectionCard.style = "position: relative; display: flex; width:100%;";
			collectionCard.href = `${UN_store_url}/collections/${collection.path}`;

			collectionCard.append(collectionImage, collectionNameWrapper);

			return collectionCard;
		});

		const collectionsWrapper = document.createElement("div");
		collectionsWrapper.className = "collections-wrapper";
		collectionsWrapper.style =
			"display: flex; margin: 0 48px; padding: 56px 0; gap: 30px;";

		collectionsWrapper.append(...collectionCards);

		const styleComponent = document.createElement("style");
		styleComponent.innerHTML = `
    		@media only screen and (max-width: 1149px) {
                .collections-wrapper {
                    flex-direction: column;
                    margin: 0 20px !important;
                    padding: 40px 0 !important;
					gap: 24px !important;
                }
                .collection-card-name-wrapper {
                  bottom: 20px !important;
                  padding: 0 20px !important;
				  letter-spacing: 0.65px !important;
	              font-size: 13px !important;
				  line-height: 1.4 !important;
                }
            }`;

		mainContainer.append(styleComponent, collectionsWrapper);
	}

	init() {
		fetch(
			`${UNfetch_collections_api_url}?user_name=${UNuser_name}&store=${UNuser_name}&status=published&starred=true&summary=true`
		)
			.then((response) => response.json())
			.then((response) => {
				const blogCollections = response?.data
					?.filter(
						(collection) =>
							collection.status === "published" &&
							collection.starred &&
							!!collection.cover_image &&
							!!collection.collection_name &&
							!!collection.path
					)
					.slice(0, UN_Collections_to_show);

				if (blogCollections?.length >= UN_Collections_to_show) {
					this.loadUI(blogCollections);
				}
			});
	}
}

var unthinkSamskaraWidget = new MainUnthinkAuraCollectionsWidget();
