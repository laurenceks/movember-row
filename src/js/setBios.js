import Bio from "../components/Bio";

const setBios = () => {
    const bios = [
        {
            name: "Sam",
            imgSrc: "/img/rowers/rower-sam.jpg",
            body: "Paramedic at Tongham, fifth year in the team. Rowing for Mayes, Bailey and Eric. “I lost my uncle to testicular cancer when I was a child and since leaving school, sadly lost two of my classmates to suicide. The main thing we talk about when we speak about those we’ve lost, is that we wished they could have picked up the phone and called us. The work Movember does to help educate and facilitate these conversations is my drive to finish the challenge.”",
        },
        {
            name: "Oli R",
            imgSrc: "/img/rowers/rower-oli.jpg",
            body: "Paramedic at Tongham, fifth year in the team. “I started participating after my grandfather was diagnosed with prostate cancer, since then Movember’s involvement with men’s mental health has taken my focus. My father had depression when I was younger but it’s only within the past few years that I understood what he was going through. More recently one of my close friends lost her brother to suicide after losing his battle with mental health.”",
        },
        {
            name: "Pete",
            body: "Critical Care Paramedic at Tongham, fourth year in the team.",
        },
        {
            name: "Stan",
            imgSrc: "/img/rowers/rower-stan.jpg",
            body: "Paramedic/Clinical Supervisor at Chertsey/Crawley, third year in the team.",
        },
        {
            name: "Will",
            imgSrc: "/img/rowers/rower-will.jpg",
            body: "Paramedic at Chertsey, second year in the team.",
        },
        {
            name: "Oli W",
            imgSrc: "/img/rowers/rower-oli-w.jpg",
            body: "Paramedic at Chertsey, second year in the team.",
        },
        {
            name: "Nathan",
            imgSrc: "/img/rowers/rower-nathan.jpeg",
            body: "Paramedic at Chertsey, second year in the team.",
        },
        {
            name: "Ian",
            imgSrc: "/img/rowers/rower-ian.jpeg",
            body: "Paramedic at Godalming, third year in the team.",
        },
        {
            name: "Sam G",
            imgSrc: "/img/rowers/rower-sam-g.jpeg",
            body: "Operations Manager at Chertsey, second year in the team.",
        },
        {
            name: "Chris",
            body: "Operational Team Leader at Tongham, second year in the team.",
        },
        {
            name: "Ben",
            imgSrc: "/img/rowers/rower-ben.jpg",
            body: "Critical Care Paramedic at Chertsey, first year in the team.",
        },
        {
            name: "Harry",
            imgSrc: "/img/rowers/rower-harry.jpeg",
            body: "Paramedic at Chertsey, first year in the team.",
        },
        {
            name: "Greg",
            imgSrc: "/img/rowers/rower-greg.jpeg",
            body: "Paramedic at Chertsey, second year in the team.",
        },
    ];

    customElements.define("rower-bio", Bio);

    bios.forEach((x) => {
        const newBio = document.createElement("rower-bio");
        if (x.imgSrc) {
            newBio.setAttribute("src", x.imgSrc);
        }
        newBio.setAttribute("name", x.name);
        newBio.setAttribute("body", x.body);
        document.getElementById("bioContainer").appendChild(newBio);
    });
};

export default setBios;
