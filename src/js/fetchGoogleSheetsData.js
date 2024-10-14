import camelCase from "camelcase";
import { totalDistanceInKilometres } from "./geoData";

const fetchGoogleSheetsData = async () => {
    const sheetId = "1LAUjBLkDdhD1oQNqXP9-k9Vbn9sKOM5OHDKDo14UpeU";
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = "Statistics";
    const query = encodeURIComponent("Select *");
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    // call Google Sheets API
    const sheetsQuery = await fetch(url);
    const sheetsData = {
        leaderboards: {
            latest: [],
            distance: [],
            time: [],
            teams: [],
        },
    };
    if (sheetsQuery.ok) {
        // Strip leading characters Google send back
        const responseJson = JSON.parse(
            (await sheetsQuery.text()).substring(47).slice(0, -2)
        );
        // get rows
        let sheetsRows = responseJson.table.rows;
        // Unwind
        sheetsRows = sheetsRows.map((x) => x.c);

        // map columns to leaderboard keys
        const colKeys = {
            2: { colKey: "latest", cols: 6 },
            8: { colKey: "distance", cols: 3 },
            12: { colKey: "time", cols: 3 },
            19: { colKey: "teams", cols: 5 },
        };

        Object.keys(colKeys).forEach(
            // get headings
            (x) => {
                const n = Number(x);
                colKeys[n].headers = [...responseJson.table.cols].slice(
                    n,
                    n + Math.max(colKeys[n].cols || 0, 0)
                );
            }
        );

        const mapColToValues = (col, rowNum, colNum) => {
            // map columns to leaderboard structure
            const returnObject = {};
            colKeys[colNum].headers.forEach((heading, i) => {
                returnObject[camelCase(heading.label)] =
                    sheetsRows[rowNum][colNum + i].v;
            });
            sheetsData.leaderboards[colKeys[colNum].colKey].push(returnObject);
        };

        // process rows into usable sheetsData object
        sheetsRows.forEach((row, rowNum) => {
            row.forEach((col, colNum) => {
                if (colNum === 0 && col) {
                    // cols A:B - stats
                    sheetsData[col.v] =
                        sheetsRows[rowNum][colNum + 1]?.v || null;
                } else if (colKeys[colNum] && col) {
                    // Other cols - leaderboards
                    mapColToValues(col, rowNum, colNum);
                }
            });
        });
    } else {
        // console.error("Error fetching Google Sheets data");
    }

    // make sure total distance is never more than the maximum possible distance according to the route
    sheetsData["Total distance"] = Math.max(
        Math.min(sheetsData["Total distance"], totalDistanceInKilometres),
        0
    );

    console.log(sheetsData);

    return sheetsData;
};

export default fetchGoogleSheetsData;
