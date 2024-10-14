import mapboxgl from "mapbox-gl";
import greatCircle from "@turf/great-circle";
import length from "@turf/length";
import linestring from "turf-linestring";
import { routeStart, routeEnd, routeLinestring } from "./data/route";

// overall route

const routeDirection = {
    horizontal:
        routeStart.geometry.coordinates[0] >= routeEnd.geometry.coordinates[0]
            ? "rightToLeft"
            : "leftToRight",
    vertical:
        routeStart.geometry.coordinates[1] >= routeEnd.geometry.coordinates[1]
            ? "down"
            : "up",
};

// create more convenient properties
/*
Object.keys(coordinates).forEach((x) => {
    const val = coordinates[x];
    coordinates[x].LngLat = new mapboxgl.LngLat(val.long, val.lat);
    coordinates[x].fullLongLat = `${val.long}, ${val.lat}`;
    coordinates[x].arrayLongLat = [val.long, val.lat];
});
*/

const totalDistanceInKilometres = length(routeLinestring);

console.log(totalDistanceInKilometres);
// route from start to current total distance rowed - starts with 0 distance initially
// route from current position to end

/*
const remainingRoute = {
    type: "geojson",
    data: greatCircle(
        coordinates.start.arrayLongLat,
        coordinates.end.arrayLongLat
    ),
};
const progressRoute = {
    type: "geojson",
    data: {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [
                coordinates.start.arrayLongLat,
                coordinates.start.arrayLongLat,
            ],
        },
    },
};
*/

/*
const progressMarker = {
    type: "Feature",
    properties: null,
    geometry: {
        type: "Point",
        coordinates: [...progressRoute.data.geometry.coordinates].pop(),
    },
};
*/

export { routeDirection, routeLinestring, totalDistanceInKilometres };
