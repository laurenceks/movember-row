import mapboxgl from "mapbox-gl";
import midpoint from "@turf/midpoint";
import MAPBOX_ACCESS_TOKEN from "./data/tokens";
import loadMap from "./loadMap";
import { routeEnd, routeStart } from "./data/route";

const initMap = (sheetsData, mapAnimationDurationInMs = 3000) => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // initialise map
    const map = new mapboxgl.Map({
        container: "mapDiv",
        style: "mapbox://styles/laurenceks/cl7bgee30002n15quqh65ph2w",
        projection: "mercator",
        center: midpoint(
            routeStart.geometry.coordinates,
            routeEnd.geometry.coordinates
        ).geometry.coordinates,
        zoom: 4,
        interactive: false,
    });

    map.on("load", () => loadMap(map, sheetsData, mapAnimationDurationInMs));
};

export default initMap;
