import { routeDirection } from "./geoData";

const createMapMarkerIcon = (type = "run", colour = "#ffffff") => {
    const markerIconContainer = document.createElement("div");
    markerIconContainer.className = `map-progress-marker-icon map-progress-marker-icon-${type}`;
    const makerIconImage = document.createElement("div");
    makerIconImage.className = "map-progress-marker-icon-image";
    makerIconImage.style.backgroundColor = colour;
    const makerIconBg = document.createElement("div");
    makerIconBg.className = "map-progress-marker-icon-bg";
    markerIconContainer.append(makerIconBg, makerIconImage);
    return markerIconContainer;
};
const createMapMarker = ({
    teamId,
    teamName,
    iconColour,
    textColour,
    modeActivityLand,
    modeActivityWater,
}) => {
    const newMapMarker = document.createElement("div");
    newMapMarker.id = `progressMarker-${teamId}`;
    newMapMarker.className = `progress-marker p-2 ${routeDirection.horizontal} ${routeDirection.vertical}`;

    const markerTextTeamName = document.createElement("p");
    markerTextTeamName.className =
        "progress-marker-text progress-marker-text-team-name p-1";
    markerTextTeamName.id = `${teamId}-markerTextTeamName`;
    markerTextTeamName.innerText = teamName;
    markerTextTeamName.style.color = textColour;

    const markerTextProgress = document.createElement("p");
    markerTextProgress.className =
        "progress-marker-text progress-marker-text-progress p-1";
    markerTextProgress.id = `${teamId}-markerTextProgress`;
    markerTextProgress.innerText = `0km (0%)`;
    markerTextProgress.style.color = textColour;

    const markerContainer = document.createElement("div");
    markerContainer.className = "map-progress-marker-container";

    // type icon
    markerContainer.appendChild(
        createMapMarkerIcon(modeActivityLand.toLowerCase(), iconColour)
    );

    // swimmer icon
    markerContainer.appendChild(
        createMapMarkerIcon(modeActivityWater.toLowerCase(), iconColour)
    );

    newMapMarker.appendChild(markerContainer);
    newMapMarker.appendChild(markerTextTeamName);
    newMapMarker.appendChild(markerTextProgress);
    return newMapMarker;
};

export default createMapMarker;
