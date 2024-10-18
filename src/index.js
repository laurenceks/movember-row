import "./style.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import getCookieConsent from "./js/getCookieConsent";
import fetchGoogleSheetsData from "./js/fetchGoogleSheetsData";
import setTables from "./js/setTables";
import initMap from "./js/initMap";
import setBios from "./js/setBios";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/button";
import "bootstrap/js/dist/collapse";

const init = async () => {
    const mapAnimationDurationInMs = 3000;
    const sheetsData = await fetchGoogleSheetsData();

    // populate bios
    setBios(sheetsData);

    // populate tables
    setTables(sheetsData);

    // initialise map - on load scrolled into view and CountUps applied
    initMap(sheetsData, mapAnimationDurationInMs);
};

document.addEventListener("DOMContentLoaded", () => getCookieConsent(init));
