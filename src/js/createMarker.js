import { routeDirection } from "./geoData";

const createMapMarker = (id, teamName = "") => {
    const newMapMarker = document.createElement("div");
    const markerIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    const markerPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    newMapMarker.className = `progressMarker p-2 ${routeDirection.horizontal} ${routeDirection.vertical}`;
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
        "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"
    );
    markerIcon.appendChild(markerPath);
    const markerTextTeamName = document.createElement("p");
    markerTextTeamName.className = "markerText markerTextTeamName p-1";
    markerTextTeamName.id = `${id}-markerTextTeamName`;
    markerTextTeamName.innerText = teamName;
    const markerTextProgress = document.createElement("p");
    markerTextProgress.className = "markerText markerTextProgress p-1";
    markerTextProgress.id = `${id}-markerTextProgress`;
    markerTextProgress.innerText = `0km (0%)`;
    newMapMarker.appendChild(markerIcon);
    newMapMarker.appendChild(markerTextTeamName);
    newMapMarker.appendChild(markerTextProgress);
    return newMapMarker;
};

export default createMapMarker;
