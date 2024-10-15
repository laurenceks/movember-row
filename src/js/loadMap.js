import bbox from "@turf/bbox";
import camelcase from "camelcase";
import mapboxgl from "mapbox-gl";
import { routeLinestring } from "./geoData";
import { routeStart } from "./data/route";
import setScrolledIntoView from "./setScrolledIntoView";
import createMapMarker from "./createMarker";

const routeSource = { type: "geojson", data: { ...routeLinestring } };

const zoomToFit = (map) =>
    map.fitBounds(bbox(routeLinestring), {
        padding: 75,
        offset: [0, 10],
    });

const loadMap = (map, sheetsData, mapAnimationDurationInMs = 3000) => {
    map.addSource("route", routeSource);
    map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
            "line-join": "round",
            "line-cap": "round",
        },
        paint: {
            "line-color": "#888888",
            "line-width": 2,
        },
    });
    sheetsData.leaderboards.teams
        .sort((a, b) => (a.distance <= b.distance ? 1 : -1))
        .forEach((team, i) => {
            team.teamId = camelcase(team.teamName);
            team.sourceId = `teamSource-${team.teamId}`;
            // add source and layer for each team
            map.addSource(team.sourceId, {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: { ...routeStart.geometry },
                        },
                    ],
                },
            });
            map.addLayer({
                id: `teamRoute-${team.teamId}`,
                type: "line",
                source: team.sourceId,
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": team.colour,
                    "line-width": 2,
                    "line-offset": 2 * i,
                },
            });
            team.marker = new mapboxgl.Marker(
                createMapMarker(team.teamId, team.teamName)
            )
                .setLngLat(routeStart.geometry.coordinates)
                .addTo(map);
        });

    zoomToFit(map);

    // add hidden replay button to be revealed after first animation
    const replayButton = document.createElement("button");
    replayButton.className = "btn btn-outline-light btn-map-replay hidden";
    replayButton.setAttribute("id", "btnMapReplay");
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
        mapAnimationDurationInMs,
        replayButton,
    });
};

export default loadMap;
