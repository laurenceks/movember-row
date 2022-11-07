import Bio from "../components/Bio";
import formatSheetValue from "./formatSheetValue";

const setBios = (sheetsData) => {
    const bios = [
        {
            id: 8,
            name: "Sam",
            imgSrc: "/img/rowers/rower-sam.jpg",
            body: "Paramedic at Tongham, fifth year in the team. Rowing for Mayes, Bailey and Eric. “I lost my uncle to testicular cancer when I was a child and since leaving school, sadly lost two of my classmates to suicide. The main thing we talk about when we speak about those we’ve lost, is that we wished they could have picked up the phone and called us. The work Movember does to help educate and facilitate these conversations is my drive to finish the challenge.”",
        },
        {
            id: 6,
            name: "Oli R",
            imgSrc: "/img/rowers/rower-oli.jpg",
            src2x: true,
            body: "Paramedic at Tongham, fifth year in the team. “I started participating after my grandfather was diagnosed with prostate cancer, since then Movember’s involvement with men’s mental health has taken my focus. My father had depression when I was younger but it’s only within the past few years that I understood what he was going through. More recently one of my close friends lost her brother to suicide after losing his battle with mental health.”",
        },
        {
            id: 7,
            name: "Pete",
            body: "Critical Care Paramedic at Tongham, fourth year in the team.",
        },
        {
            id: 10,
            name: "Stan",
            imgSrc: "/img/rowers/rower-stan.jpg",
            src2x: true,
            body: "Paramedic/Clinical Supervisor at Chertsey/Crawley, third year in the team.",
        },
        {
            id: 11,
            name: "Will",
            imgSrc: "/img/rowers/rower-will.jpg",
            body: "Paramedic at Chertsey, second year in the team.",
        },
        {
            id: null,
            name: "Oli W",
            imgSrc: "/img/rowers/rower-oli-w.jpg",
            src2x: true,
            body: "Paramedic at Chertsey, second year in the team.",
        },
        {
            id: 5,
            name: "Nathan",
            imgSrc: "/img/rowers/rower-nathan.jpeg",
            src2x: true,
            body: "Paramedic at Chertsey, second year in the team.",
        },
        {
            id: null,
            name: "Ian",
            imgSrc: "/img/rowers/rower-ian.jpeg",
            src2x: true,
            body: "Paramedic at Godalming, third year in the team.",
        },
        {
            id: 9,
            name: "Sam G",
            imgSrc: "/img/rowers/rower-sam-g.jpeg",
            src2x: true,
            body: "Operations Manager at Chertsey, second year in the team.",
        },
        {
            id: null,
            name: "Chris",
            body: "Operational Team Leader at Tongham, second year in the team.",
        },
        {
            id: 1,
            name: "Ben",
            imgSrc: "/img/rowers/rower-ben.jpg",
            body: "Critical Care Paramedic at Chertsey, first year in the team.",
        },
        {
            id: 3,
            name: "Harry",
            imgSrc: "/img/rowers/rower-harry.jpeg",
            src2x: true,
            body: "Paramedic at Chertsey, first year in the team."
        },
        {
            id: 2,
            name: "Greg",
            imgSrc: "/img/rowers/rower-greg.jpeg",
            src2x: true,
            body: "Paramedic at Chertsey, second year in the team.",
        },
    ];

    customElements.define("rower-bio", Bio);

    bios.forEach((x) => {
        const newBio = document.createElement("rower-bio");
        if (x.imgSrc) {
            newBio.setAttribute("src", x.imgSrc);
            if(x.src2x){
                newBio.setAttribute("src2x", x.src2x);
            }
        }
        newBio.setAttribute("distance", formatSheetValue(sheetsData.totals[x.id]?.distance || 0, "distance"));
        newBio.setAttribute("time", formatSheetValue(sheetsData.totals[x.id]?.time || 0, "duration"));
        newBio.setAttribute("name", x.name);
        newBio.setAttribute("body", x.body);
        document.getElementById("bioContainer").appendChild(newBio);
    });
};

export default setBios;
