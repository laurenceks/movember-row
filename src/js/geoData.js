import mapboxgl from "mapbox-gl";
import greatCircle from "@turf/great-circle";
import length from "@turf/length";

const coordinates = {
    start: {
        long: -17.1104943,
        lat: 28.083006,
        label: "San Sabastian de la Gomera",
    },
    end: {
        long: -61.7642905,
        lat: 17.0092287,
        label: "English Harbour, Antigua",
    },
};

const coordinatesDirection = {
    horizontal:
        coordinates.start.long >= coordinates.end.long
            ? "rightToLeft"
            : "leftToRight",
    vertical: coordinates.start.lat >= coordinates.end.lat ? "down" : "up",
};

// create more convenient properties
Object.keys(coordinates).forEach((x) => {
    const val = coordinates[x];
    coordinates[x].LngLat = new mapboxgl.LngLat(val.long, val.lat);
    coordinates[x].fullLongLat = `${val.long}, ${val.lat}`;
    coordinates[x].arrayLongLat = [val.long, val.lat];
});

// overall route
const route = {
    type: "geojson",
    data: greatCircle(
        coordinates.start.arrayLongLat,
        coordinates.end.arrayLongLat
    ),
};

const totalDistanceInKilometres = length(route.data);
// route from start to current total distance rowed - starts with 0 distance initially
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

// route from current position to end
const remainingRoute = {
    type: "geojson",
    data: greatCircle(
        coordinates.start.arrayLongLat,
        coordinates.end.arrayLongLat
    ),
};

const progressMarker = {
    type: "Feature",
    properties: null,
    geometry: {
        type: "Point",
        coordinates: [...progressRoute.data.geometry.coordinates].pop(),
    },
};

export {
    coordinates,
    coordinatesDirection,
    route,
    totalDistanceInKilometres,
    remainingRoute,
    progressMarker,
    progressRoute,
};
