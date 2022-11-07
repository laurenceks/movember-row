export default class Bio extends HTMLElement {
    connectedCallback() {
        const vars = this.attributes;
        this.innerHTML = `<div class="peopleWrap">
            <div class="peopleContainer mb-sm-3 d-flex flex-wrap flex-sm-nowrap align-items-start justify-content-center">
                <div class="text-center img-circle-container">
                    <div class="img-circle-wrap">
                        <img class="img-circle" ${vars.src ?
                            `${vars.src2x ?
                                `srcset="${vars.src.value}, ${vars.src.value.replace(/\.(png|jpg|jpeg)$/i, "@2x.$1")} 2x"` :
                                ""} src="${vars.src.value}"` :
                            ""} alt=""/>
                    </div>
                        <h3 class="my-3">${vars.name.value}</h3>
                </div>
                <div class="py-0 p-sm-3 d-flex flex-grow-1 flex-column justify-content-center min-h-sm-250">
                    <h4 class="m-0 py-1">${vars.distance.value}</h4>
                    <h6 class="m-0 py-1">${vars.time.value}</h6>
                </div>
                <div class="p-3 mb-5 mb-sm-0 d-flex flex-grow-1 flex-column justify-content-center min-h-sm-250">
                    <p class="m-0">${vars.body.value}</p>
                <div>
            </div>
        </div>`;
    }
}
