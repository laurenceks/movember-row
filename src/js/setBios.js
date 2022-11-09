import Bio from "../components/Bio";
import bios from "./data/bios";

const setBios = () => {

    customElements.define("rower-bio", Bio);

    bios.forEach((x) => {
        const newBio = document.createElement("rower-bio");
        if (x.imgSrc) {
            newBio.setAttribute("src", x.imgSrc);
            if(x.src2x){
                newBio.setAttribute("src2x", x.src2x);
            }
        }
        newBio.setAttribute("name", x.name);
        newBio.setAttribute("body", x.body);
        document.getElementById("bioContainer").appendChild(newBio);
    });
};

export default setBios;
