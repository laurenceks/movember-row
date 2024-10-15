/* eslint-disable no-use-before-define */
import setCountUps from "./setCountUps";
import animateMap from "./animateMap";

const setScrolledIntoView = ({
    map,
    mapAnimationDurationInMs,
    sheetsData,
    replayButton,
}) => {
    const scrolledIntoView = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                scrolledIntoViewFunctionMap[entries[0].target.id]();
            }
        },
        { threshold: [1] }
    );

    const { countUpRowed, countUpRaised, countUpMarker } = setCountUps(
        sheetsData,
        mapAnimationDurationInMs
    );

    const scrolledIntoViewFunctionMap = {
        statRowed: () => {
            scrolledIntoView.unobserve(document.querySelector("#statRowed"));
            countUpRowed.start();
        },
        statRaised: () => {
            scrolledIntoView.unobserve(document.querySelector("#statRaised"));
            countUpRaised.start();
        },
        map: () => {
            // countUpMarker.reset();
            // countUpMarker.start();
            animateMap(
                map,
                sheetsData,
                scrolledIntoView,
                mapAnimationDurationInMs
            );
        },
    };

    Object.keys(scrolledIntoViewFunctionMap).forEach((x) => {
        const el = document.querySelector(`#${x}`);
        const elBox = el.getBoundingClientRect();
        if (
            elBox.top >= 0 &&
            elBox.left >= 0 &&
            elBox.right <=
                (window.innerWidth || document.documentElement.clientWidth) &&
            elBox.bottom <=
                (window.innerHeight || document.documentElement.clientHeight)
        ) {
            scrolledIntoViewFunctionMap[x]();
        } else {
            scrolledIntoView.observe(el);
        }
    });

    replayButton.addEventListener("click", scrolledIntoViewFunctionMap.map);
};
export default setScrolledIntoView;
