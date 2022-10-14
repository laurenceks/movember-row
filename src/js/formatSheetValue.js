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
        return `${Math.floor(val * 24)}:${("" + Math.floor((val * 24 * 60) % 60)).padStart(2, "0")}:${("" + Math.floor(
            (val * 24 * 60 * 60) % 60)).padStart(2, "0")}`;
    } else if (type === "distance") {
        return `${val.toFixed(2)}km`;
    } else {
        return val;
    }
};

export default formatSheetValue;
