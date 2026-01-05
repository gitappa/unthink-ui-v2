/**
 * this is the dev file for the samskara collection cards
 * make sure to to build the file before pushing the code
 * command to build this js file = npx webpack --config webpack_configs/samskara_collection_cards_webpack.config.js
 * webpack configuration added in webpack_configs/samskara_collection_cards_webpack.config.js
 * css file will also be added in the final js single file if present
 */

// import "./bt_carousel.css"; // will be build in single file with webpack to the file = bt_carousel.js

var UNuser_name = "dothelook";
var UNapi_url =
  "https://auraprod.unthink.ai/user/collections/fetch_collections/";

class MainUnthinkSamskaraWidget {
  constructor() {
    if (window.location.pathname === "/") this.init();
  }



  async loadUI(publishedBlogCollection = []) {
    const mainContainer = document.getElementById("featured-collections");
    const clonedNode =
      mainContainer.childNodes[0] &&
      mainContainer.childNodes[0].cloneNode(true);

    function getPlatform() {
      return /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "web";
    }

    if (clonedNode) {
      const cards = publishedBlogCollection.map((collection) => {
        const card = clonedNode.cloneNode(true);
        const platform = getPlatform();

        card.querySelector("img").src = collection?.cover_image;
        card.querySelector("img").removeAttribute("srcset");
        card.querySelector("img").removeAttribute("sizes");
        card.querySelector("img").style.opacity = 1;

        card.querySelector(
          "a"
        ).href = `https://inspiration.samskarahome.com/collections/${collection?.path}?utm_source=unthink&utm_medium=${platform}&utm_campaign=${collection?.collection_id}&utm_content=unthink_collection_featured_widget&unthink_source=unthink_collection_featured_widget&unthink_medium=${platform}&unthink_campaign=${collection?.collection_id}`;

        card.querySelector(
          ".collection-item__title"
        ).innerHTML = `<span>${collection?.collection_name}</span>`;

        return card;
      });

      mainContainer.prepend(...cards);
    }
  }

  init() {
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

var unthinkSamskaraWidget = new MainUnthinkSamskaraWidget();
