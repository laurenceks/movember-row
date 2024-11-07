import bbox from "@turf/bbox";
import camelcase from "camelcase";
import mapboxgl from "mapbox-gl";
import lineSliceAlong from "@turf/line-slice-along";
import { routeLinestring, totalDistanceInKilometres } from "./geoData";
import { routeStart } from "./data/route";
import setScrolledIntoView from "./setScrolledIntoView";
import createMapMarker from "./createMarker";

const routeSource = { type: "geojson", data: { ...routeLinestring } };

let currentMapZoomFitBoxIndex = 0;
const mapZoomToFitBoxes = [bbox(routeLinestring)];

const zoomToFit = (map) => {
    map.fitBounds(mapZoomToFitBoxes[currentMapZoomFitBoxIndex], {
        padding: Math.min(
            Math.max(window.innerWidth * 0.05, map.widestMarkerWidth / 2 || 10),
            75
        ),
        offset: [0, 10],
    });
};

const loadMap = (map, sheetsData) => {
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

    sheetsData.leaderboards.teams.forEach((team, i) => {
        // assign team properties
        team.teamId = camelcase(team.teamName);
        team.sourceId = `teamSource-${team.teamId}`;
        team.layerId = `teamRoute-${team.teamId}`;
        team.safeDistance = Math.min(
            totalDistanceInKilometres,
            team.distance || 0
        );

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
            id: team.layerId,
            type: "line",
            source: team.sourceId,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": team.lineColour,
                "line-width": 2,
                "line-offset": 2 * i,
            },
        });

        team.marker = new mapboxgl.Marker(createMapMarker(team))
            .setLngLat(routeStart.geometry.coordinates)
            .addTo(map);

        team.markerElement = team.marker.getElement();
        team.markerElement.style.zIndex =
            sheetsData.leaderboards.teams.length - i;

        // if first or last marker, check if width is wider than currently recorded widest marker and update if needed
        if (
            (i === 0 || i === sheetsData.leaderboards.teams.length - 1) &&
            (team.markerElement.offsetWidth > map.widestMarkerWidth ||
                !map.widestMarkerWidth)
        ) {
            map.widestMarkerWidth = team.markerElement.offsetWidth;
        }
        team.markerElement
            .querySelectorAll(
                ".map-progress-marker-icon, .progress-marker-text"
            )
            .forEach((markerElementChild) => {
                markerElementChild.addEventListener("mouseover", () => {
                    sheetsData.leaderboards.teams.forEach((t) => {
                        if (t.teamId !== team.teamId) {
                            map.setPaintProperty(
                                t.layerId,
                                "line-opacity",
                                0.2
                            );
                        }
                    });
                });
                markerElementChild.addEventListener("mouseout", () => {
                    sheetsData.leaderboards.teams.forEach((t) => {
                        map.setPaintProperty(t.layerId, "line-opacity", 1);
                    });
                });
            });
    });

    // calculate bounding boxes for zoom button

    if (sheetsData.leaderboards.teams[0]?.safeDistance) {
        mapZoomToFitBoxes.push(
            bbox(
                lineSliceAlong(
                    routeLinestring,
                    0,
                    sheetsData.leaderboards.teams[0]?.safeDistance,
                    { units: "kilometers" }
                )
            )
        );
        if (
            sheetsData.leaderboards.teams[
                sheetsData.leaderboards.teams.length - 1
            ]?.safeDistance
        ) {
            mapZoomToFitBoxes.push(
                bbox(
                    lineSliceAlong(
                        routeLinestring,
                        sheetsData.leaderboards.teams[
                            sheetsData.leaderboards.teams.length - 1
                        ]?.safeDistance,
                        sheetsData.leaderboards.teams[0]?.safeDistance,
                        { units: "kilometers" }
                    )
                )
            );
        }
    }

    zoomToFit(map);

    if (mapZoomToFitBoxes.length > 1) {
        // add zoom button
        const zoomButton = document.createElement("button");
        zoomButton.className = `btn btn-outline-light btn-map-zoom btn-map-zoom-icon-${currentMapZoomFitBoxIndex}`;
        zoomButton.appendChild(document.createElement("span"));
        zoomButton.setAttribute("id", "btnMapZoom");
        zoomButton.addEventListener("click", () => {
            zoomButton.classList.remove(
                `btn-map-zoom-icon-${currentMapZoomFitBoxIndex}`
            );
            currentMapZoomFitBoxIndex =
                currentMapZoomFitBoxIndex === mapZoomToFitBoxes.length - 1
                    ? 0
                    : currentMapZoomFitBoxIndex + 1;
            zoomButton.classList.add(
                `btn-map-zoom-icon-${currentMapZoomFitBoxIndex}`
            );
            zoomToFit(map);
        });
        document.getElementById("mapDiv").appendChild(zoomButton);
    }

    // add hidden replay button to be revealed after first animation
    const replayButton = document.createElement("button");
    replayButton.appendChild(document.createElement("span"));
    replayButton.className = "btn btn-outline-light btn-map-replay hidden";
    replayButton.setAttribute("id", "btnMapReplay");

    document.getElementById("mapDiv").appendChild(replayButton);

    // on window resize, fit the map to the screen
    window.addEventListener("resize", () => zoomToFit(map));
    setScrolledIntoView({
        map,
        sheetsData,
        replayButton,
    });
};

export default loadMap;
