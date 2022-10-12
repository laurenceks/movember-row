import Cookies from "js-cookie";
import "bootstrap/js/dist/modal.js";

const getCookieConsent = (callback) => {
    if (!Cookies.get("cookie-banner-ok-clicked")) {
        //no cookie for dismissing banner
        const cookieModalElement = document.getElementById("cookie-modal");
        const cookieModal = new bootstrap.Modal(document.getElementById("cookie-modal"), {
            backdrop: "static",
            keyboard: false,
        });
        cookieModal.show();
        
    }else{
        callback();
    }
};

export default getCookieConsent;
