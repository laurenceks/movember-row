import BezierEasing from "bezier-easing";
import lineSliceAlong from "@turf/line-slice-along";
import { routeLinestring } from "./data/route";
import {
    channelCrossingLengthsAlongRoute,
    totalDistanceInKilometres,
} from "./geoData";

const animateMap = (map, sheetsData, scrolledIntoView = null) => {
    if (scrolledIntoView) {
        // make sure the event listener only fires once
        scrolledIntoView.unobserve(document.querySelector("#map"));
    }

    // make sure replay button is hidden
    document.getElementById("btnMapReplay").classList.add("hidden");

    const easing = BezierEasing(0.16, 1, 0.3, 1); // easeOutExpo to match countUp
    // calculate total duration based on percentage of goal
    let startTime = null;
    const durationInMs =
        10000 *
        Math.min(
            1,
            (sheetsData.leaderboards.teams[0]?.distance || 0) /
                totalDistanceInKilometres
        );

    const progressAnimation = (timestamp) => {
        if (!startTime) {
            startTime = timestamp;
        }

        const runtime = timestamp - startTime;

        // calculate progress distance
        const progressPercent = easing(runtime / durationInMs);

        if (progressPercent) {
            // if progress is above zero (i.e. if animation has started), then update each team's line and marker
            sheetsData.leaderboards.teams.forEach((team) => {
                if (team.distance) {
                    const safeTeamDistance = Math.min(
                        totalDistanceInKilometres,
                        team.distance || 0
                    );
                    // calculate total duration based on percentage of goal
                    const teamDurationInMs =
                        durationInMs *
                        Math.min(
                            1,
                            safeTeamDistance /
                                Math.min(
                                    totalDistanceInKilometres,
                                    sheetsData.leaderboards.teams[0]
                                        ?.distance || 0
                                )
                        );
                    // calculate progress distance
                    const teamProgressDistance =
                        Math.min(1, easing(runtime / teamDurationInMs)) *
                        safeTeamDistance;

                    // line data
                    const newData = lineSliceAlong(
                        routeLinestring,
                        0,
                        teamProgressDistance,
                        { units: "kilometers" }
                    );
                    map.getSource(team.sourceId).setData(newData);

                    // move marker to last point in new linestring
                    team.marker.setLngLat(newData.geometry.coordinates.pop());

                    // update marker text
                    team.markerElement.lastElementChild.innerText = `${Math.round(
                        teamProgressDistance
                    )}km (${Math.round(
                        (teamProgressDistance / totalDistanceInKilometres) * 100
                    )}%)`;

                    // if over channel and marker doesn't have swimming icon class
                    if (
                        teamProgressDistance >=
                            channelCrossingLengthsAlongRoute.start &&
                        teamProgressDistance <
                            channelCrossingLengthsAlongRoute.end
                    ) {
                        if (
                            !team.markerElement.classList.contains(
                                "map-progress-marker-over-channel"
                            )
                        ) {
                            // add class
                            team.markerElement.classList.add(
                                "map-progress-marker-over-channel"
                            );
                        }
                    } else if (
                        team.markerElement.classList.contains(
                            "map-progress-marker-over-channel"
                        )
                    ) {
                        // remove class
                        team.markerElement.classList.remove(
                            "map-progress-marker-over-channel"
                        );
                    }
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
