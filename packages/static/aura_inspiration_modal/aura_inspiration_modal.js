(() => {
    let t = "";
    var e = window.location.host;
    let a = "",
        n = "",
        o = "";
    switch (e) {
        case "heroesvillains.com":
        case "https://inspiration.heroesvillains.com":
            (t = "heroesvillains"),
                (n = "aura-inspiration-modal-button"),
                (a =
                    "https://inspiration.heroesvillains.com/aura-search/heroesvillains"),
                (o = "unthink-aura-inspiration-modal-wrapper");
            break;
        case "unthink.shop":
        case "www.unthink.shop":
            (t = "fashiondemo"),
                (n = "aura-inspiration-modal-button"),
                (a = "https://unthink.shop/aura-search/fashiondemo/"),
                (o = "unthink-aura-inspiration-modal-wrapper");
            break;
        case "swiftly-styled.com":
        case "https://swiftly-styled.com":
            (t = "swiftlystyled"),
                (n = "aura-inspiration-modal-button"),
                (a = "https://swiftly-styled.com/aura-search/swiftlystyled/"),
                (o = "unthink-aura-inspiration-modal-wrapper");
            break;
        case "dothelook.com":
        case "https://dothelook.com":
            (t = "dothelook"),
                (n = "aura-inspiration-modal-button"),
                (a = "https://dothelook.com/aura-search/dothelook/"),
                (o = "unthink-aura-inspiration-modal-wrapper");
            break;
        case "shop.budgettravel.com":
        case "https://shop.budgettravel.com":
            (t = "budgettravel"),
                (n = "aura-inspiration-modal-button"),
                (a = "https://shop.budgettravel.com/aura-search/budgettravel/"),
                (o = "unthink-aura-inspiration-modal-wrapper");
            break;
        case "inspiration.samskarahome.com":
        case "https://inspiration.samskarahome.com":
            (t = "budgettravel"),
                (n = "aura-inspiration-modal-button"),
                (a = "https://shop.budgettravel.com/aura-search/samskarahome/"),
                (o = "unthink-aura-inspiration-modal-wrapper");
            break;
        case "localhost:8000":
        case "127.0.0.1:5500":
            (t = "unthink_ai"),
                (n = "aura-inspiration-modal-button"),
                (a = "http://localhost:8000/aura-search/dothelook"),
                (o = "unthink-aura-inspiration-modal-wrapper");
    }
    new (class {
        constructor() {
            const t = document.getElementById(o);
            t && t.remove(), this.loadUI();
        }
        handleOpenModal = (t, e) => {
            (t.style =
                "display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999;"),
                (e.overflow = "hidden");
        };
        handleCloseModal = (t, e) => {
            (t.style.display = "none"), (e.overflow = "unset");
        };
        loadUI() {
            const t = document.createElement("div");
            (t.id = o), (t.style.display = "none");
            const e = document.createElement("div");
            (e.className = "modal-inner-container"),
                (e.style =
                    "display: flex; justify-content: center; align-items: center; flex-direction: column; height:100%; margin: 0px 50px;"),
                t.append(e);
            const i = document.createElement("span");
            (i.style =
                "display: flex; justify-content: end; width: 100%; max-width: 1500px; margin-top:-35px; margin-bottom:5px; cursor: pointer;"),
                (i.innerHTML =
                    '\n\t\t\t<svg viewBox="0 0 50 50" height="30" width="30">\n\t\t\t  <path\n\t\t\t\td="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"\n\t\t\t\tfill="white"\n\t\t\t  ></path>\n\t\t\t</svg>\n\t\t  '),
                i.addEventListener("click", () =>
                    this.handleCloseModal(t, document.body.style)
                );
            const s = document.createElement("div");
            (s.className = "iFrame-container"),
                (s.style =
                    "display: flex; background-color: white; width: 100%; max-width: 1500px; height: calc(100% - 100px);");
            const r = document.createElement("iframe");
            (r.src = a),
                (r.height = "100%"),
                (r.width = "100%"),
                (r.style = "border: 1px solid white;"),
                s.append(r),
                e.prepend(i),
                e.append(s),
                document
                    .getElementById(n)
                    .addEventListener("click", () =>
                        this.handleOpenModal(t, document.body.style)
                    );
            const l = document.createElement("style");
            (l.innerHTML =
                "\n\t\t@media only screen and (max-width: 767px) {\n\t\t\t.modal-inner-container {\n\t\t\t\tmargin: 10px 10px !important;   \n\t\t\t}\n\t\t}"),
                document.head.appendChild(l),
                document.body.appendChild(t);
        }
    })();
})();
