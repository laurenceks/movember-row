import {
    coordinates, coordinatesDirection, progressMarker, progressRoute, remainingRoute, route, totalDistanceInKilometres,
} from "./geoData.js";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";
import animateMap from "./animateMap.js";
import setScrolledIntoView from "./setScrolledIntoView.js";

const zoomToFit = (map) => map.fitBounds(bbox(route.data), {
    padding: 75,
    offset: [0, 10],
});

const loadMap = (map, sheetsData, mapAnimationDurationInMs = 3000) => {
    map.addSource("progressRoute", progressRoute);
    map.addSource("remainingRoute", remainingRoute);
    map.addLayer({
        "id": "progressRoute",
        "type": "line",
        "source": "progressRoute",
        "layout": {
            "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            "line-color": "#FFFFFF",
            "line-width": 2,
        },
    });
    map.addLayer({
        "id": "remainingRoute",
        "type": "line",
        "source": "remainingRoute",
        "layout": {
            "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            "line-color": "#888888",
            "line-width": 2,
        },
    });
    new mapboxgl.Marker({color: "#FFFFFF"}).setLngLat(coordinates.start.LngLat).addTo(map);
    new mapboxgl.Marker({color: "#FFFFFF"}).setLngLat(coordinates.end.LngLat).addTo(map);
    const newMarker = document.createElement("div");
    const markerIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    newMarker.className = `progressMarker p-2 ${coordinatesDirection.horizontal} ${coordinatesDirection.vertical}`;
    markerIcon.setAttribute("stroke", "currentColor");
    markerIcon.setAttribute("fill", "currentColor");
    markerIcon.setAttribute("stroke-width", "0");
    markerIcon.setAttribute("viewBox", "0 0 25 25");
    markerIcon.setAttribute("width", "50");
    markerIcon.setAttribute("height", "50");
    markerIcon.setAttribute("preserveAspectRatio", "xMinYMin meet");
    markerIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    markerPath.setAttribute("d",
        "M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5zM15 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 20.01L18 24l-2.99-3.01V19.5l-7.1-7.09c-.31.05-.61.07-.91.07v-2.16c1.66.03 3.61-.87 4.67-2.04l1.4-1.55c.19-.21.43-.38.69-.5.29-.14.62-.23.96-.23h.03C15.99 6.01 17 7.02 17 8.26v5.75c0 .84-.35 1.61-.92 2.16l-3.58-3.58v-2.27c-.63.52-1.43 1.02-2.29 1.39L16.5 18H18l3 3.01z");
    markerIcon.appendChild(markerPath);
    const markerText = document.createElement("p");
    markerText.className = "markerText p-1";
    markerText.id = "mapCurrentDistance";
    markerText.innerText = `${`${sheetsData["Total distance"].toLocaleString("en-GB")}km`} ${Math.round(
        (sheetsData["Total distance"] / totalDistanceInKilometres) * 100)}%`;
    newMarker.appendChild(markerIcon);
    newMarker.appendChild(markerText);
    const progressMarkerMapBoxGl = new mapboxgl.Marker(newMarker)
        .setLngLat(progressMarker.geometry.coordinates)
        .addTo(map);
    zoomToFit(map);
    //on window resize, fit the map to the screen
    window.addEventListener("resize", () =>zoomToFit(map));
    setScrolledIntoView({animateMap, map, sheetsData, progressMarkerMapBoxGl, mapAnimationDurationInMs});
};

export default loadMap;
