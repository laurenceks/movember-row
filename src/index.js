import "./style.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import getCookieConsent from "./js/getCookieConsent";
import fetchGoogleSheetsData from "./js/fetchGoogleSheetsData";
import setTables from "./js/setTables";
import initMap from "./js/initMap";
import setBios from "./js/setBios";

// TODO - hide # from URL ?

/*
window.addEventListener("hashchange", (e) => {
    history.pushState(
        "",
        document.title,
        e.newURL.match(/#[/\-\w]+/)[0]?.replace("#", "")
    );
});
*/

const init = async () => {
    const mapAnimationDurationInMs = 3000;
    const sheetsData = await fetchGoogleSheetsData();

    setBios();

    // populate tables
    setTables(sheetsData);

    // initialise map - on load scrolled into view and CountUps applied
    initMap(sheetsData, mapAnimationDurationInMs);
};

document.addEventListener("DOMContentLoaded", () => getCookieConsent(init));
