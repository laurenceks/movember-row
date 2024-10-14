import formatSheetValue from "./formatSheetValue";

const setTables = (sheetsData) => {
    // map table ids to keys and data formats
    const tables = [
        {
            id: "tLatest",
            key: "latest",
            cols: [
                { key: "timestamp", type: "dateTime" },
                { key: "activity", type: "string" },
                { key: "distance", type: "distance" },
                { key: "time", type: "duration" },
            ],
        },
        {
            id: "tDistance",
            key: "distance",
            cols: [{ key: "distance", type: "distance" }],
        },
        {
            id: "tTime",
            key: "time",
            type: "duration",
            cols: [{ key: "time", type: "duration" }],
        },
    ];

    tables.forEach((x) => {
        const table = document.getElementById(x.id);
        sheetsData.leaderboards[x.key].forEach((entry, i) => {
            const row = table.insertRow(i);
            row.insertCell(0).innerText = entry.position || i + 1;
            row.insertCell(1).innerText = entry.teamName;
            x.cols.forEach((col, colNum) => {
                row.insertCell(2 + colNum).innerText = formatSheetValue(
                    entry[col.key],
                    col.type
                );
            });
        });
    });
};
export default setTables;
