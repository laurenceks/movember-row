import "./style.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import getCookieConsent from "./js/getCookieConsent.js";
import fetchGoogleSheetsData from "./js/fetchGoogleSheetsData.js";
import setTables from "./js/setTables.js";
import initMap from "./js/initMap.js";

//TODO - hide # from URL
/*
window.addEventListener("hashchange", (e) => {
    history.pushState(null,null,window.location.href.replace("#",""));
});
*/

const init = async () => {
    const mapAnimationDurationInMs = 3000;
    const sheetsData = await fetchGoogleSheetsData();

    //populate tables
    setTables(sheetsData);

    //initialise map - on load scrolled into view and countups applied
    initMap(sheetsData, mapAnimationDurationInMs);

};

document.addEventListener("DOMContentLoaded", () => getCookieConsent(init));
