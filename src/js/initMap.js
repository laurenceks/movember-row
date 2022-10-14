import mapboxgl from "mapbox-gl";
import midpoint from "@turf/midpoint";
import MAPBOX_ACCESS_TOKEN from "./tokens";
import { coordinates } from "./geoData";
import loadMap from "./loadMap";

const initMap = (sheetsData, mapAnimationDurationInMs = 3000) => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // initialise map
    const map = new mapboxgl.Map({
        container: "mapDiv",
        style: "mapbox://styles/laurenceks/cl7bgee30002n15quqh65ph2w",
        projection: "mercator",
        center: midpoint(
            coordinates.start.arrayLongLat,
            coordinates.end.arrayLongLat
        ).geometry.coordinates,
        zoom: 4,
        interactive: false,
    });

    map.on("load", () => loadMap(map, sheetsData, mapAnimationDurationInMs));
};

export default initMap;
