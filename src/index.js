import "./style.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@fortawesome/fontawesome-free/js/all.js";
import mapboxgl from "mapbox-gl";
import {MAPBOX_ACCESS_TOKEN} from "./tokens.js";
import * as turf from "@turf/turf";

const init = async (e) => {

    const sheetId = "1_qii19Q1Aa81zD1bPBEPS-ezK9L4WX_LEGSHekWERRM";
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = "Statistics";
    const query = encodeURIComponent("Select *");
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    //call Google Sheets API
    const sheetsQuery = await fetch(url);
    let sheetsData = {
        leaderboards: {
            recent: [],
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
            2: "recent",
            7: "distance",
            10: "time",
        };

        const mapColToValue = (key, col, rowNum, colNum) => {
            //map columns to leaderboard structure
            sheetsData.leaderboards[key].push({
                position: col.v,
                name: sheetsRows[rowNum][colNum + 1].v,
                value: sheetsRows[rowNum][colNum + 2].v,
                distance: key === "recent" ? sheetsRows[rowNum][colNum + 3].v : null,
                time: key === "recent" ? sheetsRows[rowNum][colNum + 4].v : null,
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
    document.querySelector("#statRowed").innerText = distanceRowedFormattedString;
    document.querySelector("#statRaised").innerText = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
    }).format(sheetsData["Amount raised"]);

    const formatSheetValue = (val, type) => {
        if (type === "dateTime") {
            const d = new Date(val);
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
        id: "tRecent",
        key: "recent",
        types: ["dateTime", "distance", "duration"],
    },
    {
        id: "tDistance",
        key: "distance",
        type: "distance",
    },
    {
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
            if (x.key !== "recent") {
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
            lat: 12.35574825283084,
            long: -16.729955127546244,
            label: "Cap Skirring, Senegal",
        },
        end: {
            lat: -5.155730691299459,
            long: -35.49889472935634,
            label: "State of Rio Grande de Norte, Brazil",
        },
        mid: {
            lat: 3.648708,
            long: -26.206182,
        },
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
        data: {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [coordinates.start.arrayLongLat, coordinates.end.arrayLongLat],
            },
        },
    };

    const totalDistanceInKilometres = turf.length(route.data);

    //route from start to current total distance rowed
    const progressRoute = {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [coordinates.start.arrayLongLat,
                    turf.along(route.data, sheetsData["Total distance"],
                        {units: "kilometers"}).geometry.coordinates],
            },
        },
    };

    //route form current position to end
    const remainingRoute = {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [[...progressRoute.data.geometry.coordinates].pop(), coordinates.end.arrayLongLat],
            },
        },
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
        center: [coordinates.mid.long, coordinates.mid.lat],
        zoom: 4,
        interactive: false,
    });

    const zoomToFit = () => map.fitBounds([coordinates.end.arrayLongLat, coordinates.start.arrayLongLat], {padding: 75, offset: [0,10]});

    map.on("load", () => {
        map.addSource("route", route);
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
        const markerIcon = document.createElement("i");
        newMarker.className = "progressMarker p-2";
        markerIcon.className = "icon p-1 fas fa-sailboat";
        const markerText = document.createElement("p");
        markerText.className = "markerText p-1";
        markerText.innerText = `${distanceRowedFormattedString} ${Math.round(
            (sheetsData["Total distance"] / totalDistanceInKilometres) * 100)}%`;
        newMarker.appendChild(markerIcon);
        newMarker.appendChild(markerText);
        new mapboxgl.Marker(newMarker).setLngLat(progressMarker.geometry.coordinates).addTo(map);
        zoomToFit();
        //on window resize, fit the map to the screen
        window.addEventListener("resize", zoomToFit);
    });
};

document.addEventListener("DOMContentLoaded", init);
