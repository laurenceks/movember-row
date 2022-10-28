import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";
import {
    coordinates,
    coordinatesDirection,
    progressMarker,
    progressRoute,
    remainingRoute,
    route,
    totalDistanceInKilometres,
} from "./geoData";
import setScrolledIntoView from "./setScrolledIntoView";

const zoomToFit = (map) =>
    map.fitBounds(bbox(route.data), {
        padding: 75,
        offset: [0, 10],
    });

const loadMap = (map, sheetsData, mapAnimationDurationInMs = 3000) => {
    map.addSource("progressRoute", progressRoute);
    map.addSource("remainingRoute", remainingRoute);
    map.addLayer({
        id: "progressRoute",
        type: "line",
        source: "progressRoute",
        layout: {
            "line-join": "round",
            "line-cap": "round",
        },
        paint: {
            "line-color": "#FFFFFF",
            "line-width": 2,
        },
    });
    map.addLayer({
        id: "remainingRoute",
        type: "line",
        source: "remainingRoute",
        layout: {
            "line-join": "round",
            "line-cap": "round",
        },
        paint: {
            "line-color": "#888888",
            "line-width": 2,
        },
    });
    new mapboxgl.Marker({ color: "#FFFFFF" })
        .setLngLat(coordinates.start.LngLat)
        .addTo(map);
    new mapboxgl.Marker({ color: "#FFFFFF" })
        .setLngLat(coordinates.end.LngLat)
        .addTo(map);
    const newMarker = document.createElement("div");
    const markerIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    const markerPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    newMarker.className = `progressMarker p-2 ${coordinatesDirection.horizontal} ${coordinatesDirection.vertical}`;
    markerIcon.setAttribute("stroke", "currentColor");
    markerIcon.setAttribute("fill", "currentColor");
    markerIcon.setAttribute("stroke-width", "0");
    markerIcon.setAttribute("viewBox", "0 0 25 25");
    markerIcon.setAttribute("width", "50");
    markerIcon.setAttribute("height", "50");
    markerIcon.setAttribute("preserveAspectRatio", "xMinYMin meet");
    markerIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    markerPath.setAttribute(
        "d",
        "M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5zM15 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 20.01L18 24l-2.99-3.01V19.5l-7.1-7.09c-.31.05-.61.07-.91.07v-2.16c1.66.03 3.61-.87 4.67-2.04l1.4-1.55c.19-.21.43-.38.69-.5.29-.14.62-.23.96-.23h.03C15.99 6.01 17 7.02 17 8.26v5.75c0 .84-.35 1.61-.92 2.16l-3.58-3.58v-2.27c-.63.52-1.43 1.02-2.29 1.39L16.5 18H18l3 3.01z"
    );
    markerIcon.appendChild(markerPath);
    const markerText = document.createElement("p");
    markerText.className = "markerText p-1";
    markerText.id = "mapCurrentDistance";
    markerText.innerText = `${`${sheetsData["Total distance"].toLocaleString(
        "en-GB"
    )}km`} ${Math.round(
        (sheetsData["Total distance"] / totalDistanceInKilometres) * 100
    )}%`;
    newMarker.appendChild(markerIcon);
    newMarker.appendChild(markerText);
    const progressMarkerMapBoxGl = new mapboxgl.Marker(newMarker)
        .setLngLat(progressMarker.geometry.coordinates)
        .addTo(map);
    zoomToFit(map);

    //add hidden replay button to be revealed after first animation
    const replayButton = document.createElement("button");
    replayButton.className = "btn btn-outline-light btn-map-replay hidden";
    replayButton.setAttribute("id", "btnMapReplay")
    const replayIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    const replayPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    replayIcon.setAttribute("stroke", "currentColor");
    replayIcon.setAttribute("fill", "currentColor");
    replayIcon.setAttribute("stroke-width", "0");
    replayIcon.setAttribute("viewBox", "0 0 50 50");
    replayIcon.setAttribute("width", "50");
    replayIcon.setAttribute("height", "50");
    replayIcon.setAttribute("preserveAspectRatio", "xMidYMid meet");
    replayIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    replayPath.setAttribute(
        "d",
        "M24 44q-3.75 0-7.025-1.4-3.275-1.4-5.725-3.85Q8.8 36.3 7.4 33.025 6 29.75 6 26h3q0 6.25 4.375 10.625T24 41q6.25 0 10.625-4.375T39 26q0-6.25-4.25-10.625T24.25 11H23.1l3.65 3.65-2.05 2.1-7.35-7.35 7.35-7.35 2.05 2.05-3.9 3.9H24q3.75 0 7.025 1.4 3.275 1.4 5.725 3.85 2.45 2.45 3.85 5.725Q42 22.25 42 26q0 3.75-1.4 7.025-1.4 3.275-3.85 5.725-2.45 2.45-5.725 3.85Q27.75 44 24 44Z"
    );
    replayIcon.appendChild(replayPath);
    replayButton.appendChild(replayIcon);
    document.getElementById("mapDiv").appendChild(replayButton);

    // on window resize, fit the map to the screen
    window.addEventListener("resize", () => zoomToFit(map));
    setScrolledIntoView({
        map,
        sheetsData,
        progressMarkerMapBoxGl,
        mapAnimationDurationInMs,
        replayButton
    });
};

export default loadMap;
