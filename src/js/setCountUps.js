import { CountUp } from "countup.js";

const setCountUps = (sheetsData) => {
    const countUpRowed = new CountUp(
        "statDistance",
        sheetsData["Max distance"],
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

    return {
        countUpRaised,
        countUpRowed,
    };
};

export default setCountUps;
