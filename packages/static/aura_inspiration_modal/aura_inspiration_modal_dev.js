/**
 * this is the dev file for the aura inspiration modal
 * make sure to build the file before pushing the code
 * command to build this js file = npx webpack --config webpack_configs/aura_inspiration_modal_webpack.config.js
 * webpack configuration added in webpack_configs/aura_inspiration_modal_webpack.config.js
 * css file will also be added in the final js single file if present
 */

// import "./aura_inspiration_modal.css"; // will be build in single file with webpack to the file = aura_inspiration_modal.js

let UNuser_name = "";
var UNcurrentHost = window.location.host;
let UNaura_inspiration_modal_url = "";
let UNopen_modal_id = "";
let UNaura_inspiration_modal_wrapper_id = "";

switch (UNcurrentHost) {
	case "heroesvillains.com":
	case "https://inspiration.heroesvillains.com":
		UNuser_name = "heroesvillains";
		UNopen_modal_id = "aura-inspiration-modal-button";
		UNaura_inspiration_modal_url =
			"https://inspiration.heroesvillains.com/aura-search/heroesvillains";
		UNaura_inspiration_modal_wrapper_id =
			"unthink-aura-inspiration-modal-wrapper";
		break;
	case "unthink.shop":
	case "www.unthink.shop":
		UNuser_name = "fashiondemo";
		UNopen_modal_id = "aura-inspiration-modal-button";
		UNaura_inspiration_modal_url =
			"https://unthink.shop/aura-search/fashiondemo/";
		UNaura_inspiration_modal_wrapper_id =
			"unthink-aura-inspiration-modal-wrapper";
		break;
	case "swiftly-styled.com":
	case "https://swiftly-styled.com":
		UNuser_name = "swiftlystyled";
		UNopen_modal_id = "aura-inspiration-modal-button";
		UNaura_inspiration_modal_url =
			"https://swiftly-styled.com/aura-search/swiftlystyled/";
		UNaura_inspiration_modal_wrapper_id =
			"unthink-aura-inspiration-modal-wrapper";
		break;
	case "dothelook.com":
	case "https://dothelook.com":
		UNuser_name = "dothelook";
		UNopen_modal_id = "aura-inspiration-modal-button";
		UNaura_inspiration_modal_url =
			"https://dothelook.com/aura-search/dothelook/";
		UNaura_inspiration_modal_wrapper_id =
			"unthink-aura-inspiration-modal-wrapper";
		break;
	case "shop.budgettravel.com":
	case "https://shop.budgettravel.com":
		UNuser_name = "budgettravel";
		UNopen_modal_id = "aura-inspiration-modal-button";
		UNaura_inspiration_modal_url =
			"https://shop.budgettravel.com/aura-search/budgettravel/";
		UNaura_inspiration_modal_wrapper_id =
			"unthink-aura-inspiration-modal-wrapper";
		break;
	case "inspiration.samskarahome.com":
	case "https://inspiration.samskarahome.com":
		UNuser_name = "budgettravel";
		UNopen_modal_id = "aura-inspiration-modal-button";
		UNaura_inspiration_modal_url =
			"https://shop.budgettravel.com/aura-search/samskarahome/";
		UNaura_inspiration_modal_wrapper_id =
			"unthink-aura-inspiration-modal-wrapper";
		break;
	case "localhost:8000":
	case "127.0.0.1:5500":
		UNuser_name = "unthink_ai";
		UNopen_modal_id = "aura-inspiration-modal-button";
		UNaura_inspiration_modal_url =
			"http://localhost:8000/aura-search/dothelook";
		UNaura_inspiration_modal_wrapper_id =
			"unthink-aura-inspiration-modal-wrapper";
		break;
	default:
		break;
}

class AuraInspirationModal {
	constructor() {
		const modalId = document.getElementById(
			UNaura_inspiration_modal_wrapper_id
		);
		if (modalId) {
			modalId.remove(); // removes modalWrapper element from the DOM, if already exist
		}

		this.loadUI();
	}

	// open modal
	handleOpenModal = (modalWrapper, style) => {
		modalWrapper.style =
			"display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999;";
		style.overflow = "hidden"; // Set body overflow hidden when loading iFrame
	};

	// close modal
	handleCloseModal = (modalWrapper, style) => {
		modalWrapper.style.display = "none";
		style.overflow = "unset"; // Set body overflow unset when closing the modal
	};

	loadUI() {
		const modalWrapper = document.createElement("div");
		modalWrapper.id = UNaura_inspiration_modal_wrapper_id;
		modalWrapper.style.display = "none";

		const modalInnerContainer = document.createElement("div");
		modalInnerContainer.className = "modal-inner-container";
		modalInnerContainer.style =
			"display: flex; justify-content: center; align-items: center; flex-direction: column; height:100%; margin: 0px 50px;";
		modalWrapper.append(modalInnerContainer);

		// close modal button : start
		const closeModalButton = document.createElement("span");
		closeModalButton.style =
			"display: flex; justify-content: end; width: 100%; max-width: 1500px; margin-top:-35px; margin-bottom:5px; cursor: pointer;";

		closeModalButton.innerHTML = `
			<svg viewBox="0 0 50 50" height="30" width="30">
			  <path
				d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"
				fill="white"
			  ></path>
			</svg>
		  `;

		closeModalButton.addEventListener("click", () =>
			this.handleCloseModal(modalWrapper, document.body.style)
		);
		// close modal button : end

		// iframe container
		const iFrameContainer = document.createElement("div");
		iFrameContainer.className = "iFrame-container";
		iFrameContainer.style =
			"display: flex; background-color: white; width: 100%; max-width: 1500px; height: calc(100% - 100px);";

		// iframe
		const iFrame = document.createElement("iframe");
		iFrame.src = UNaura_inspiration_modal_url;
		iFrame.height = "100%";
		iFrame.width = "100%";
		iFrame.style = "border: 1px solid white;";
		iFrameContainer.append(iFrame);

		// append close button and iframe in modal
		modalInnerContainer.prepend(closeModalButton);
		modalInnerContainer.append(iFrameContainer);

		// get open modal ID
		const openModalButton = document.getElementById(UNopen_modal_id);
		openModalButton.addEventListener("click", () =>
			this.handleOpenModal(modalWrapper, document.body.style)
		);

		// media query
		const styleComponent = document.createElement("style");
		styleComponent.innerHTML = `
		@media only screen and (max-width: 767px) {
			.modal-inner-container {
				margin: 10px 10px !important;   
			}
		}`;

		document.head.appendChild(styleComponent);
		document.body.appendChild(modalWrapper);
	}
}

var auraInspirationModal = new AuraInspirationModal();
