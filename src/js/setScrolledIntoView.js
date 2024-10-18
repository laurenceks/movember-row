/* eslint-disable no-use-before-define */
import setCountUps from "./setCountUps";
import animateMap from "./animateMap";

const setScrolledIntoView = ({ map, sheetsData, replayButton }) => {
    const scrolledIntoView = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                scrolledIntoViewFunctionMap[entries[0].target.id]();
            }
        },
        { threshold: [1] }
    );

    const { countUpRowed, countUpRaised } = setCountUps(sheetsData);

    const scrolledIntoViewFunctionMap = {
        statDistance: () => {
            scrolledIntoView.unobserve(document.querySelector("#statDistance"));
            countUpRowed.start();
        },
        statRaised: () => {
            scrolledIntoView.unobserve(document.querySelector("#statRaised"));
            countUpRaised.start();
        },
        map: () => {
            animateMap(map, sheetsData, scrolledIntoView);
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
