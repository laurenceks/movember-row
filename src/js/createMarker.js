import { routeDirection } from "./geoData";

const createMapMarkerIcon = (type = "run") => {
    const markerIcon = document.createElement("div");
    markerIcon.className = `map-progress-marker-icon map-progress-marker-icon-${type}`;
    return markerIcon;
};
const createMapMarker = ({ teamId, teamName, modeActivity }) => {
    const newMapMarker = document.createElement("div");
    newMapMarker.id = `progressMarker-${teamId}`;
    newMapMarker.className = `progress-marker p-2 ${routeDirection.horizontal} ${routeDirection.vertical}`;

    const markerTextTeamName = document.createElement("p");
    markerTextTeamName.className = "marker-text marker-text-team-name p-1";
    markerTextTeamName.id = `${teamId}-markerTextTeamName`;
    markerTextTeamName.innerText = teamName;

    const markerTextProgress = document.createElement("p");
    markerTextProgress.className = "marker-text marker-text-progress p-1";
    markerTextProgress.id = `${teamId}-markerTextProgress`;
    markerTextProgress.innerText = `0km (0%)`;

    const markerContainer = document.createElement("div");
    markerContainer.className = "map-progress-marker-container";

    // type icon
    markerContainer.appendChild(
        createMapMarkerIcon(modeActivity.toLowerCase())
    );

    // swimmer icon
    markerContainer.appendChild(createMapMarkerIcon("swim"));

    newMapMarker.appendChild(markerContainer);
    newMapMarker.appendChild(markerTextTeamName);
    newMapMarker.appendChild(markerTextProgress);
    return newMapMarker;
};

export default createMapMarker;
