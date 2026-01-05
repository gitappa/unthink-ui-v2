/**
 * this is the dev file for the aura inspiration modal
 * make sure to build the file before pushing the code
 * command to build this js file = npx webpack --config webpack_configs/aura_inspiration_modal_webpack.config.js
 */

// import "./aura_inspiration_modal.css"; // This will be bundled by webpack


(async function initAuraModal() {
    try {
        let apiUrl = "";
        let store_name = "unthink_ai";
        let domain = "";

        const isLocalhost =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1";

        // Localhost: skip API call and set static values
        if (isLocalhost) {
            domain = "http://localhost:8000";
            store_name = "dothelook";
        }
        // If hostname is "unthink.shop", set store_name = "dothelook"
        else if (window.location.hostname === "unthink.shop") {
            domain = "https://unthink.shop";
            store_name = "dothelook";
        }
        // From window.unthink
        else if (window?.unthink?.storeId) {
            const storeId = window?.unthink?.storeId;
            apiUrl = `https://aurastage.unthink.ai/users/store/get_domain/?store_id=${storeId}`;
        }
        // From Shopify domain
        else if (window?.Shopify?.shop) {
            const shopDomain = window.Shopify.shop;
            apiUrl = `https://aurastage.unthink.ai/users/store/get_domain/?domain=${shopDomain}`;
        }
        // No valid ID or domain
        else {
            throw new Error("No valid store ID or domain found.");
        }

        //  Fetch store details only if not localhost or unthink.shop
        if (!isLocalhost && window.location.hostname !== "unthink.shop" && apiUrl) {
            const res = await fetch(apiUrl);
            const json = await res.json();

            if (json.status_code === 200 && json.status === "Success" && json.data) {
                domain = json.data.admin_url?.mapped_url || json.data.admin_url?.main_url;
                store_name = json.data.store_name || store_name;
            } else {
                console.error("API error:", json.status_desc || "Invalid response");
                return;
            }
        }

        const UNaura_inspiration_modal_url = `${domain}/aura-search/${store_name}`;
        const UNopen_modal_id = "aura-inspiration-modal-button";
        const UNaura_inspiration_modal_wrapper_id = "unthink-aura-inspiration-modal-wrapper";

        class AuraInspirationModal {
            constructor() {
                const existingModal = document.getElementById(UNaura_inspiration_modal_wrapper_id);
                if (existingModal) existingModal.remove();
                this.loadUI();
            }

            handleOpenModal = (modalWrapper, style) => {
                const iframe = modalWrapper.querySelector("iframe");
                if (iframe) {
                    const currentSrc = iframe.src;
                    iframe.src = "";
                    setTimeout(() => {
                        iframe.src = currentSrc;
                    }, 50);
                }
                modalWrapper.style = `
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                `;
                style.overflow = "hidden";
            };

            handleCloseModal = (modalWrapper, style) => {
                modalWrapper.style.display = "none";
                style.overflow = "unset";

                if (typeof window.handleAuraClose === "function") {
                    window.handleAuraClose();
                }
            };

            loadUI() {
                const modalWrapper = document.createElement("div");
                modalWrapper.id = UNaura_inspiration_modal_wrapper_id;
                modalWrapper.style.display = "none";

                const modalInnerContainer = document.createElement("div");
                modalInnerContainer.className = "modal-inner-container";
                modalInnerContainer.style = `
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    height: 100%;
                    margin: 0px 50px;
                `;
                modalWrapper.append(modalInnerContainer);

                const closeModalButton = document.createElement("span");
                closeModalButton.style = `
                    display: flex;
                    justify-content: end;
                    width: 100%;
                    max-width: 1500px;
                    margin-top: -35px;
                    margin-bottom: 5px;
                    cursor: pointer;
                `;
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

                const iFrameContainer = document.createElement("div");
                iFrameContainer.className = "iFrame-container";
                iFrameContainer.style = `
                    display: flex;
                    background-color: white;
                    width: 100%;
                    max-width: 1500px;
                    height: calc(100% - 100px);
                `;

                const iFrame = document.createElement("iframe");
                iFrame.src = UNaura_inspiration_modal_url;
                iFrame.height = "100%";
                iFrame.width = "100%";
                iFrame.style = "border: 1px solid white;";
                iFrameContainer.append(iFrame);

                modalInnerContainer.append(closeModalButton);
                modalInnerContainer.append(iFrameContainer);

                const styleComponent = document.createElement("style");
                styleComponent.innerHTML = `
                    @media only screen and (max-width: 767px) {
                        .modal-inner-container {
                            margin: 10px 10px !important;
                        }
                    }
                `;
                document.head.appendChild(styleComponent);
                document.body.appendChild(modalWrapper);

                const waitForElement = (selector, callback) => {
                    const interval = setInterval(() => {
                        const el = document.getElementById(selector);
                        if (el) {
                            clearInterval(interval);
                            callback(el);
                        }
                    }, 100);
                };

                waitForElement(UNopen_modal_id, (btn) => {
                    btn.addEventListener("click", () =>
                        this.handleOpenModal(modalWrapper, document.body.style)
                    );
                });
            }
        }

        new AuraInspirationModal();
    } catch (err) {
        console.error("Error initializing Aura modal:", err);
    }
})();
