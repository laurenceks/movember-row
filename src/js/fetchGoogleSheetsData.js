import {totalDistanceInKilometres} from "./geoData";

const fetchGoogleSheetsData = async () => {
    const sheetId = "1_qii19Q1Aa81zD1bPBEPS-ezK9L4WX_LEGSHekWERRM";
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
            2: "latest",
            7: "distance",
            10: "time",
        };

        const mapColToValue = (key, col, rowNum, colNum) => {
            // map columns to leaderboard structure
            sheetsData.leaderboards[key].push({
                position: col.v,
                name: sheetsRows[rowNum][colNum + 1].v,
                value: sheetsRows[rowNum][colNum + 2].v,
                distance:
                    key === "latest" ? sheetsRows[rowNum][colNum + 3].v : null,
                time:
                    key === "latest" ? sheetsRows[rowNum][colNum + 4].v : null,
            });
        };

        // process rows into usable sheetsData object
        sheetsRows.forEach((row, rowNum) => {
            row.forEach((col, colNum) => {
                if (colNum === 0 && col) {
                    // cols A:B - stats
                    sheetsData[col.v] = sheetsRows[rowNum][colNum + 1].v;
                } else if (colKeys[colNum] && col) {
                    // Other cols - leaderboards
                    mapColToValue(colKeys[colNum], col, rowNum, colNum);
                }
            });
        });
    } else {
        // console.error("Error fetching Google Sheets data");
    }

    //make sure total distance is never more than the maximum possible distance according to the route
    sheetsData["Total distance"] = Math.max(Math.min(sheetsData["Total distance"], totalDistanceInKilometres), 0);

    return sheetsData;
};

export default fetchGoogleSheetsData;
