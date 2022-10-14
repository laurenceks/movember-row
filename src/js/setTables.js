import formatSheetValue from "./formatSheetValue.js";

const setTables = (sheetsData) => {
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

};
export default setTables;
