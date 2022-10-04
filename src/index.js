import "./style.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import {MAPBOX_ACCESS_TOKEN} from "./tokens.js";
import length from "@turf/length";
import along from "@turf/along";
import bbox from "@turf/bbox";
import midpoint from "@turf/midpoint";
import greatCircle from "@turf/great-circle";
import linestring from "turf-linestring";
import {CountUp} from "countup.js";
import BezierEasing from "bezier-easing";

//TODO - hide # from URL
/*
window.addEventListener("hashchange", (e) => {
    history.pushState(null,null,window.location.href.replace("#",""));
});
*/

const init = async () => {

    const sheetId = "1_qii19Q1Aa81zD1bPBEPS-ezK9L4WX_LEGSHekWERRM";
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = "Statistics";
    const query = encodeURIComponent("Select *");
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    //call Google Sheets API
    const sheetsQuery = await fetch(url);
    let sheetsData = {
        leaderboards: {
            latest: [],
            distance: [],
            time: [],
        },
    };

    if (sheetsQuery.ok) {
        //Strip leading characters Google send back
        const responseJson = JSON.parse((await sheetsQuery.text()).substring(47).slice(0, -2));
        //get rows
        let sheetsRows = responseJson.table.rows;
        //Unwind
        sheetsRows = sheetsRows.map((x) => x.c);

        //map columns to leaderboard keys
        const colKeys = {
            2: "latest",
            7: "distance",
            10: "time",
        };

        const mapColToValue = (key, col, rowNum, colNum) => {
            //map columns to leaderboard structure
            sheetsData.leaderboards[key].push({
                position: col.v,
                name: sheetsRows[rowNum][colNum + 1].v,
                value: sheetsRows[rowNum][colNum + 2].v,
                distance: key === "latest" ? sheetsRows[rowNum][colNum + 3].v : null,
                time: key === "latest" ? sheetsRows[rowNum][colNum + 4].v : null,
            });
        };

        //process rows into usable sheetsData object
        sheetsRows.forEach((row, rowNum) => {
            row.forEach((col, colNum) => {
                if (colNum === 0 && col) {
                    //cols A:B - stats
                    sheetsData[col.v] = sheetsRows[rowNum][colNum + 1].v;
                } else if (colKeys[colNum] && col) {
                    //Other cols - leaderboards
                    mapColToValue(colKeys[colNum], col, rowNum, colNum);
                }
            });
        });
    } else {
        console.error("Something went wrong!");
    }

    //set stats
    const distanceRowedFormattedString = `${sheetsData["Total distance"].toLocaleString("en-GB")}km`;
    const countUpRowed = new CountUp("statRowed", sheetsData["Total distance"], {
        decimalPlaces: 0,
        duration: 5,
        suffix: "km",
    });
    const countUpRaised = new CountUp("statRaised", sheetsData["Amount raised"], {
        decimalPlaces: 0,
        duration: 5,
        prefix: "£",
    });

    const formatSheetValue = (val, type) => {
        if (type === "dateTime") {
            const d = new Date(val.replaceAll("-", "/"));
            if (Date.now() - d.getTime() > 518400000) {
                //over a week ago
                return Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(d);
            } else {
                return Intl.DateTimeFormat("en-GB", {
                    weekday: "short",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(d);
            }
        } else if (type === "duration") {
            return `${Math.floor(val * 24)}:${("" + Math.floor((val * 24 * 60) % 60)).padStart(2,
                "0")}:${("" + Math.floor((val * 24 * 60 * 60) % 60)).padStart(2, "0")}`;
        } else if (type === "distance") {
            return `${val.toFixed(2)}km`;
        } else {
            return val;
        }
    };

    //map table ids to keys and data formats
    const tables = [{
        id: "tLatest",
        key: "latest",
        types: ["dateTime", "distance", "duration"],
    }, {
        id: "tDistance",
        key: "distance",
        type: "distance",
    }, {
        id: "tTime",
        key: "time",
        type: "duration",
    }];

    tables.forEach((x) => {
        const table = document.getElementById(x.id);
        sheetsData.leaderboards[x.key].forEach((entry, i) => {
            const row = table.insertRow(i);
            row.insertCell(0).innerText = entry.position || i + 1;
            row.insertCell(1).innerText = entry.name;
            if (x.key !== "latest") {
                row.insertCell(2).innerText = formatSheetValue(entry.value, x.type);
            } else {
                row.insertCell(2).innerText = formatSheetValue(entry.value, x.types[0]);
                row.insertCell(3).innerText = formatSheetValue(entry.distance, x.types[1]);
                row.insertCell(4).innerText = formatSheetValue(entry.time, x.types[2]);
            }
        });
    });

    //prepare map
    const coordinates = {
        start: {
            long: -17.1104943,
            lat: 28.0830060,
            label: "San Sabastian de la Gomera",
        },
        end: {
            long: -61.7642905,
            lat: 17.0092287,
            label: "English Harbour, Antigua",
        },
    };

    const coordinatesDirection = {
        horizontal: coordinates.start.long >= coordinates.end.long ? "rightToLeft" : "leftToRight",
        vertical: coordinates.start.lat >= coordinates.end.lat ? "down" : "up",
    };

    //create more convenient properties
    Object.keys(coordinates).forEach((x) => {
        const val = coordinates[x];
        coordinates[x].LngLat = new mapboxgl.LngLat(val.long, val.lat);
        coordinates[x].fullLongLat = `${val.long}, ${val.lat}`;
        coordinates[x].arrayLongLat = [val.long, val.lat];
    });

    //overall route
    const route = {
        type: "geojson",
        data: greatCircle(coordinates.start.arrayLongLat, coordinates.end.arrayLongLat),
    };

    const totalDistanceInKilometres = length(route.data);
    //route from start to current total distance rowed - starts with 0 distance initially
    const progressRoute = {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [coordinates.start.arrayLongLat, coordinates.start.arrayLongLat],
            },
        },
    };

    //route from current position to end
    const remainingRoute = {
        type: "geojson",
        data: greatCircle(coordinates.start.arrayLongLat, coordinates.end.arrayLongLat),
    };

    const progressMarker = {
        type: "Feature",
        properties: null,
        geometry: {
            type: "Point",
            coordinates: [...progressRoute.data.geometry.coordinates].pop(),
        },
    };

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    //initialise map
    const map = new mapboxgl.Map({
        container: "mapDiv",
        style: "mapbox://styles/laurenceks/cl7bgee30002n15quqh65ph2w",
        projection: "mercator",
        center: midpoint(coordinates.start.arrayLongLat, coordinates.end.arrayLongLat).geometry.coordinates,
        zoom: 4,
        interactive: false,
    });

    const zoomToFit = () => map.fitBounds(bbox(route.data), {
        padding: 75,
        offset: [0, 10],
    });

    map.on("load", () => {
        map.addSource("progressRoute", progressRoute);
        map.addSource("remainingRoute", remainingRoute);
        map.addLayer({
            "id": "progressRoute",
            "type": "line",
            "source": "progressRoute",
            "layout": {
                "line-join": "round",
                "line-cap": "round",
            },
            "paint": {
                "line-color": "#FFFFFF",
                "line-width": 2,
            },
        });
        map.addLayer({
            "id": "remainingRoute",
            "type": "line",
            "source": "remainingRoute",
            "layout": {
                "line-join": "round",
                "line-cap": "round",
            },
            "paint": {
                "line-color": "#888888",
                "line-width": 2,
            },
        });
        new mapboxgl.Marker({color: "#FFFFFF"}).setLngLat(coordinates.start.LngLat).addTo(map);
        new mapboxgl.Marker({color: "#FFFFFF"}).setLngLat(coordinates.end.LngLat).addTo(map);
        const newMarker = document.createElement("div");
        const markerIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        newMarker.className = `progressMarker p-2 ${coordinatesDirection.horizontal} ${coordinatesDirection.vertical}`;
        markerIcon.setAttribute("stroke", "currentColor");
        markerIcon.setAttribute("fill", "currentColor");
        markerIcon.setAttribute("stroke-width", "0");
        markerIcon.setAttribute("viewBox", "0 0 25 25");
        markerIcon.setAttribute("width", "50");
        markerIcon.setAttribute("height", "50");
        markerIcon.setAttribute("preserveAspectRatio", "xMinYMin meet");
        markerIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        markerPath.setAttribute("d",
            "M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5zM15 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 20.01L18 24l-2.99-3.01V19.5l-7.1-7.09c-.31.05-.61.07-.91.07v-2.16c1.66.03 3.61-.87 4.67-2.04l1.4-1.55c.19-.21.43-.38.69-.5.29-.14.62-.23.96-.23h.03C15.99 6.01 17 7.02 17 8.26v5.75c0 .84-.35 1.61-.92 2.16l-3.58-3.58v-2.27c-.63.52-1.43 1.02-2.29 1.39L16.5 18H18l3 3.01z");
        markerIcon.appendChild(markerPath);
        // markerIcon.className = "progressMarkerIcon";
        const markerText = document.createElement("p");
        markerText.className = "markerText p-1";
        markerText.id = "mapCurrentDistance";
        markerText.innerText = `${distanceRowedFormattedString} ${Math.round(
            (sheetsData["Total distance"] / totalDistanceInKilometres) * 100)}%`;
        newMarker.appendChild(markerIcon);
        newMarker.appendChild(markerText);
        const progressMarkerMapBoxGl = new mapboxgl.Marker(newMarker).setLngLat(progressMarker.geometry.coordinates)
            .addTo(map);
        zoomToFit();
        //on window resize, fit the map to the screen
        window.addEventListener("resize", zoomToFit);

        const mapAnimationDurationInMs = 3000;

        const animateMap = (durationInMs = mapAnimationDurationInMs) => {
            //make sure the event listener only fires once
            scrolledIntoFrame.unobserve(document.querySelector("#map"));
            const easing = BezierEasing(0.16, 1, 0.3, 1); //easeOutExpo to match countUp
            let startTime = null;
            const progressAnimation = (timestamp) => {
                if (!startTime) {
                    startTime = timestamp;
                }
                const runtime = timestamp - startTime;
                const progressPercent = easing(runtime / durationInMs);

                //calculate new coordinates based on current progress
                const progressMarkerCoordinates = along(linestring(route.data.geometry.coordinates),
                    sheetsData["Total distance"] * progressPercent, {units: "kilometers"}).geometry.coordinates;

                const progressRouteCoordinates = progressMarkerCoordinates[0] === coordinates.start.long && progressMarkerCoordinates[1] === coordinates.start.lat ?
                    [coordinates.start.arrayLongLat, progressMarkerCoordinates] :
                    greatCircle(coordinates.start.arrayLongLat, progressMarkerCoordinates).geometry.coordinates;
                const remainingRouteCoordinates = greatCircle([...progressRouteCoordinates].pop(),
                    coordinates.end.arrayLongLat).geometry.coordinates;
                //update marker and lines
                progressMarkerMapBoxGl.setLngLat(progressMarkerCoordinates);
                map.getSource("progressRoute")
                    .setData({
                        ...progressRoute.data,
                        geometry: {
                            ...progressRoute.data.geometry,
                            coordinates: progressRouteCoordinates,
                        },
                    });
                map.getSource("remainingRoute")
                    .setData({
                        ...remainingRoute.data,
                        geometry: {
                            ...remainingRoute.data.geometry,
                            coordinates: remainingRouteCoordinates,
                        },
                    });

                //if not yet complete, request a new frame
                if (progressPercent < 1) {
                    requestAnimationFrame(progressAnimation);
                }
            };
            requestAnimationFrame(progressAnimation);
        };

        const countUpMarker = new CountUp("mapCurrentDistance", sheetsData["Total distance"], {
            duration: mapAnimationDurationInMs / 1000,
            formattingFn: (x) => `${x}km ${Math.round((x / totalDistanceInKilometres) * 100)}%`,
        });
        const scrolledIntoFrameFunctionMap = {
            "statRowed": () => {
                scrolledIntoFrame.unobserve(document.querySelector("#statRowed"));
                countUpRowed.start();
            },
            "statRaised": () => {
                scrolledIntoFrame.unobserve(document.querySelector("#statRaised"));
                countUpRaised.start();
            },
            "map": () => {
                countUpMarker.start();
                animateMap();
            },
        };
        //TODO add fallback for older browsers/systems - maybe check if IntersectionObserver exists and if not just fire the animations?
        const scrolledIntoFrame = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                scrolledIntoFrameFunctionMap[entries[0].target.id]();
            }
        }, {threshold: [1]});

        scrolledIntoFrame.observe(document.querySelector("#statRowed"));
        scrolledIntoFrame.observe(document.querySelector("#statRaised"));
        scrolledIntoFrame.observe(document.querySelector("#map"));
    });
};

document.addEventListener("DOMContentLoaded", init);
