import BezierEasing from "bezier-easing";
import lineSliceAlong from "@turf/line-slice-along";
import { routeLinestring } from "./data/route";
import {
    channelCrossingLengthsAlongRoute,
    totalDistanceInKilometres,
} from "./geoData";

const animateMap = (
    map,
    sheetsData,
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
            // if progress is above zero (i.e. if animation has started), then update each team's line and marker
            sheetsData.leaderboards.teams.forEach((team) => {
                // calculate progress distance
                const progressDistance = progressPercent * team.distance;

                // line data
                const newData = lineSliceAlong(
                    routeLinestring,
                    0,
                    progressDistance,
                    { units: "kilometers" }
                );
                map.getSource(team.sourceId).setData(newData);

                // move marker to last point in new linestring
                team.marker.setLngLat(newData.geometry.coordinates.pop());

                // update marker text
                team.markerElement.lastElementChild.innerText = `${Math.round(
                    progressDistance
                )}km (${Math.round(
                    (progressDistance / totalDistanceInKilometres) * 100
                )}%)`;

                // if over channel and marker doesn't have swimming icon class
                if (
                    progressDistance >=
                        channelCrossingLengthsAlongRoute.start &&
                    progressDistance < channelCrossingLengthsAlongRoute.end
                ) {
                    if (
                        !team.markerElement.classList.contains(
                            "progress-marker-swimmer-icon"
                        )
                    ) {
                        // add class
                        team.markerElement.classList.add(
                            "progress-marker-swimmer-icon"
                        );
                    }
                } else if (
                    team.markerElement.classList.contains(
                        "progress-marker-swimmer-icon"
                    )
                ) {
                    // remove class
                    team.markerElement.classList.remove(
                        "progress-marker-swimmer-icon"
                    );
                }
            });
        }

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
