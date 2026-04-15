import React, { useEffect } from "react";

const GoogleTagManagerNoscript = () => {
    useEffect(() => {
        // Create a noscript element
        const noscript = document.createElement("noscript");

        // Create the iframe element
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-MN5D7F2Z";
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";

        // Append the iframe inside the noscript tag
        noscript.appendChild(iframe);

        // Append the noscript to the body
        document.body.appendChild(noscript);
    }, []);

    return null;
};

export default GoogleTagManagerNoscript;

