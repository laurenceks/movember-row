import Cookies from "js-cookie";
import {Modal} from "bootstrap";

const getCookieConsent = (callback) => {
    if (!Cookies.get("cookie-consent-given")) {
        //no cookie for consenting to cookies
        const cookieModalElement = document.getElementById("cookie-modal");
        const cookieModal = new Modal(cookieModalElement, {
            backdrop: "static",
            keyboard: false,
        });
        cookieModal.show();
        cookieModalElement.addEventListener("hide.bs.modal", () => {
            Cookies.set("cookie-consent-given", true, {
                expires: 30,
                sameSite: "strict",
            });
            callback();
        });
    }else{
        callback();
    }
};

export default getCookieConsent;
