import { routeDirection } from "./geoData";

const createMapMarkerIcon = (type = "runner") => {
    const markerIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    const markerPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

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
        type === "runner"
            ? "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"
            : "m10 8-3.25 3.25c.31.12.56.27.77.39.37.23.59.36 1.15.36s.78-.13 1.15-.36c.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.55 0 .78-.13 1.15-.36.12-.07.26-.15.41-.23L10.48 5C8.93 3.45 7.5 2.99 5 3v2.5c1.82-.01 2.89.39 4 1.5l1 1zm12 8.5h-.02.02zm-16.65-1c.55 0 .78.14 1.15.36.45.27 1.07.64 2.18.64s1.73-.37 2.18-.64c.37-.23.59-.36 1.15-.36.55 0 .78.14 1.15.36.45.27 1.07.64 2.18.64s1.73-.37 2.18-.64c.37-.23.59-.36 1.15-.36.55 0 .78.14 1.15.36.45.27 1.06.63 2.16.64v-2c-.55 0-.78-.14-1.15-.36-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.18.64c-.37.23-.6.36-1.15.36s-.78-.14-1.15-.36c-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.18.64c-.37.23-.59.36-1.15.36-.55 0-.78-.14-1.15-.36-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.18.64c-.37.23-.59.36-1.15.36v2c1.11 0 1.73-.37 2.2-.64.37-.23.6-.36 1.15-.36zM18.67 18c-1.11 0-1.73.37-2.18.64-.37.23-.6.36-1.15.36-.55 0-.78-.14-1.15-.36-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.19.64c-.37.23-.59.36-1.15.36s-.78-.13-1.15-.36c-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.19.64c-.37.23-.59.36-1.15.36v2c1.11 0 1.73-.37 2.19-.64.37-.23.6-.36 1.15-.36.55 0 .78.13 1.15.36.45.27 1.07.64 2.18.64s1.73-.37 2.19-.64c.37-.23.59-.36 1.15-.36.55 0 .78.14 1.15.36.45.27 1.07.64 2.18.64s1.72-.37 2.18-.64c.37-.23.59-.36 1.15-.36.55 0 .78.14 1.15.36.45.27 1.07.64 2.18.64v-2c-.56 0-.78-.13-1.15-.36-.45-.27-1.07-.64-2.18-.64z"
    );

    markerIcon.appendChild(markerPath);

    // TODO fix swimmer SVG head not appearing

    if (type !== "runner") {
        const swimmerHead = document.createElement("circle");
        swimmerHead.setAttribute("cx", 16.5);
        swimmerHead.setAttribute("cy", 5.5);
        swimmerHead.setAttribute("r", 2.5);
        markerIcon.appendChild(swimmerHead);
    }

    return markerIcon;
};
const createMapMarker = (id, teamName = "") => {
    const newMapMarker = document.createElement("div");
    newMapMarker.id = `progressMarker-${id}`;
    newMapMarker.className = `progress-marker p-2 ${routeDirection.horizontal} ${routeDirection.vertical}`;

    const markerTextTeamName = document.createElement("p");
    markerTextTeamName.className = "marker-text marker-text-team-name p-1";
    markerTextTeamName.id = `${id}-markerTextTeamName`;
    markerTextTeamName.innerText = teamName;

    const markerTextProgress = document.createElement("p");
    markerTextProgress.className = "marker-text marker-text-progress p-1";
    markerTextProgress.id = `${id}-markerTextProgress`;
    markerTextProgress.innerText = `0km (0%)`;

    const markerContainer = document.createElement("div");
    markerContainer.className = "map-progress-marker-container";

    // runner icon
    markerContainer.appendChild(createMapMarkerIcon("runner"));

    // swimmer icon
    markerContainer.appendChild(createMapMarkerIcon("swimmer"));

    newMapMarker.appendChild(markerContainer);
    newMapMarker.appendChild(markerTextTeamName);
    newMapMarker.appendChild(markerTextProgress);
    return newMapMarker;
};

export default createMapMarker;
