import Cookies from "js-cookie";
import Modal from "bootstrap/js/dist/modal";
import {clickyId} from "./data/tokens";

const startClickyAnalytics = () => {
    const analyticsScript = document.createElement('script');
    analyticsScript.type = 'text/javascript';
    analyticsScript.async = true;
    analyticsScript.src = `//static.getclicky.com/${clickyId}.js`;

    const analyticsNoScript = document.createElement("noscript");
    const analyticsNoScriptImg = document.createElement("img");
    analyticsNoScriptImg.style.display = "none";
    analyticsNoScriptImg.setAttribute("src", ` //in.getclicky.com/${clickyId}ns.gif`);
    analyticsNoScript.appendChild(analyticsNoScriptImg);

    document.head.appendChild(analyticsScript);
    document.body.appendChild(analyticsNoScript);
};

const getCookieConsent = (callback) => {
    if (!Cookies.get("cookie-consent-given-essential")) {
        // no cookie for consenting to cookies
        const cookieModalElement = document.getElementById("cookie-modal");
        const cookieModal = new Modal(cookieModalElement, {
            backdrop: "static",
            keyboard: false,
        });
        cookieModal.show();
        cookieModalElement.querySelectorAll("button").forEach((x) => x.addEventListener("click", (e) => {
            if (e.target.dataset["cookieBtn"] === "all") {
                Cookies.set("cookie-consent-given-all", true, {
                    expires: 30,
                    sameSite: "strict",
                });
                startClickyAnalytics();
            } else {
                Cookies.remove("cookie-consent-given-all");
                Cookies.remove("_jsuid");
            }
            Cookies.set("cookie-consent-given-essential", true, {
                expires: e.target.dataset["cookieBtn"] === "all" ? 30 : 1,
                sameSite: "strict",
            });
            callback();
        }));
    } else {
        callback();
        if (Cookies.get("cookie-consent-given-all")) {
            startClickyAnalytics();
        }
    }
};

export default getCookieConsent;
