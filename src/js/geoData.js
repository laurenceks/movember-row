import length from "@turf/length";
import lineSlice from "@turf/line-slice";
import {
    channelCrossingCoordinates,
    routeEnd,
    routeLinestring,
    routeStart,
} from "./data/route";

// calculate direction for icons
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

// calculate key distances
const totalDistanceInKilometres = length(routeLinestring);
const channelCrossingLengthsAlongRoute = {
    start: length(
        lineSlice(
            routeStart.geometry.coordinates,
            channelCrossingCoordinates.start,
            routeLinestring
        )
    ),
    end: length(
        lineSlice(
            routeStart.geometry.coordinates,
            channelCrossingCoordinates.end,
            routeLinestring
        )
    ),
};

console.log(totalDistanceInKilometres);

export {
    routeDirection,
    routeLinestring,
    totalDistanceInKilometres,
    channelCrossingLengthsAlongRoute,
};
