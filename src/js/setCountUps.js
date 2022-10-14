import { CountUp } from "countup.js";
import { totalDistanceInKilometres } from "./geoData";

const setCountUps = (sheetsData, mapAnimationDurationInMs) => {
    const countUpRowed = new CountUp(
        "statRowed",
        sheetsData["Total distance"],
        {
            decimalPlaces: 0,
            duration: 5,
            suffix: "km",
        }
    );

    const countUpRaised = new CountUp(
        "statRaised",
        sheetsData["Amount raised"],
        {
            decimalPlaces: 0,
            duration: 5,
            prefix: "£",
        }
    );

    const countUpMarker = new CountUp(
        "mapCurrentDistance",
        sheetsData["Total distance"],
        {
            duration: mapAnimationDurationInMs / 1000,
            formattingFn: (x) =>
                `${x}km ${Math.round((x / totalDistanceInKilometres) * 100)}%`,
        }
    );

    return {
        countUpMarker,
        countUpRaised,
        countUpRowed,
    };
};

export default setCountUps;
