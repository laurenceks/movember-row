import Cookies from "js-cookie";
import {Modal} from "bootstrap";
import {googleTag} from "./data/tokens";

const startGoogleAnalytics = () => {
    //set Google analytics here
    //https://stackoverflow.com/questions/69685735/how-to-load-an-external-javascript-on-a-condition
    //https://github.com/DavidWells/analytics/blob/master/packages/analytics-plugin-google-analytics/src/browser.js
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleTag}`;
    document.head.append(script);
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', googleTag);
};

const getCookieConsent = (callback) => {
    if (!Cookies.get("cookie-consent-given")) {
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
                startGoogleAnalytics();
            }
            Cookies.set("cookie-consent-given", true, {
                expires: 30,
                sameSite: "strict",
            });
            callback();
        }));
    } else {
        callback();
        if(Cookies.get("cookie-consent-given-all")){
            startGoogleAnalytics();
        }
    }
};

export default getCookieConsent;
