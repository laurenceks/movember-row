import BezierEasing from "bezier-easing";
import lineSliceAlong from "@turf/line-slice-along";
import { routeLinestring } from "./data/route";

const animateMap = (
    map,
    progressMarkerMapBoxGl,
    sheetsData,
    distance = 0,
    scrolledIntoView = null,
    durationInMs = 3000
) => {
    if (scrolledIntoView) {
        // make sure the event listener only fires once
        scrolledIntoView.unobserve(document.querySelector("#map"));
    }

    // make sure replay button is hidden
    document.getElementById("btnMapReplay").classList.add("hidden");

    const easing = BezierEasing(0.16, 1, 0.3, 1); // easeOutExpo to match countUp
    let startTime = null;
    const progressAnimation = (timestamp) => {
        if (!startTime) {
            startTime = timestamp;
        }
        const runtime = timestamp - startTime;
        const progressPercent = easing(runtime / durationInMs);

        if (progressPercent) {
            sheetsData.leaderboards.teams.forEach((team) => {
                map.getSource(team.sourceId).setData(
                    lineSliceAlong(
                        routeLinestring,
                        0,
                        progressPercent * team.distance,
                        { units: "kilometers" }
                    )
                );
            });
        }

        /*
                // calculate new coordinates based on current progress
                const progressMarkerCoordinates = along(
                    routeLinestring,
                    distance * progressPercent,
                    { units: "kilometers" }
                ).geometry.coordinates;

                const progressRouteCoordinates =
                    progressMarkerCoordinates[0] === coordinates.start.long &&
                    progressMarkerCoordinates[1] === coordinates.start.lat
                        ? [coordinates.start.arrayLongLat, progressMarkerCoordinates]
                        : greatCircle(
                              coordinates.start.arrayLongLat,
                              progressMarkerCoordinates
                          ).geometry.coordinates;
                const remainingRouteCoordinates = greatCircle(
                    [...progressRouteCoordinates].pop(),
                    coordinates.end.arrayLongLat
                ).geometry.coordinates;
                // update marker and lines
                progressMarkerMapBoxGl.setLngLat(progressMarkerCoordinates);
                map.getSource("progressRoute").setData({
                    ...progressRoute.data,
                    geometry: {
                        ...progressRoute.data.geometry,
                        coordinates: progressRouteCoordinates,
                    },
                });
        */
        /* map.getSource("remainingRoute").setData({
            ...remainingRoute.data,
            geometry: {
                ...remainingRoute.data.geometry,
                coordinates: remainingRouteCoordinates,
            },
        }); */

        // if not yet complete, request a new frame
        if (progressPercent < 1) {
            requestAnimationFrame(progressAnimation);
        } else {
            // animation finished - show replay button
            document.getElementById("btnMapReplay").classList.remove("hidden");
        }
    };
    requestAnimationFrame(progressAnimation);
};

export default animateMap;
