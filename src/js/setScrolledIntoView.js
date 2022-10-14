import setCountUps from "./setCountUps.js";

const setScrolledIntoView = ({
    animateMap,
    map,
    mapAnimationDurationInMs,
    progressMarkerMapBoxGl,
    sheetsData,
}) => {
    const scrolledIntoView = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            scrolledIntoViewFunctionMap[entries[0].target.id]();
        }
    }, {threshold: [1]});

    const {countUpRowed, countUpRaised, countUpMarker} = setCountUps(sheetsData, mapAnimationDurationInMs);

    const scrolledIntoViewFunctionMap = {
        "statRowed": () => {
            scrolledIntoView.unobserve(document.querySelector("#statRowed"));
            countUpRowed.start();
        },
        "statRaised": () => {
            scrolledIntoView.unobserve(document.querySelector("#statRaised"));
            countUpRaised.start();
        },
        "map": () => {
            countUpMarker.start();
            animateMap(map, sheetsData["Total distance"], scrolledIntoView, mapAnimationDurationInMs,
                progressMarkerMapBoxGl);
        },
    };

    Object.keys(scrolledIntoViewFunctionMap).forEach((x) => {
        const el = document.querySelector(`#${x}`);
        const elBox = el.getBoundingClientRect();
        if (elBox.top >= 0 && elBox.left >= 0 && elBox.right <= (window.innerWidth || document.documentElement.clientWidth) && elBox.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
            scrolledIntoViewFunctionMap[x]();
        } else {
            scrolledIntoView.observe(el);
        }
    });
};
export default setScrolledIntoView;
