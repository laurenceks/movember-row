export default class Bio extends HTMLElement {
    connectedCallback() {
        const vars = this.attributes;
        this.innerHTML = `<div class="peopleWrap">
            <div class="peopleContainer d-flex flex-wrap flex-sm-nowrap justify-content-center justify-content-sm-start align-items-center">
                <div class="text-center img-circle-container">
                    <div class="img-circle-wrap">
                        <img class="img-circle" ${
                            vars.src ? `src="${vars.src.value}" ${vars.src2x ? `srcset="${vars.src.value}, ${vars.src.value.replace(/\.(png|jpg|jpeg)$/i, "@2x.$1")} 2x"` : ""}` : ""
                        } alt=""/>
                    </div>
                    <h3 class="my-3">${vars.name.value}</h3>
                </div>
                <p class="p-3 m-0 mb-sm-5">${vars.body.value}</p>
            </div>
        </div>`;
    }
}
