import Bio from "../components/Bio";

const setBios = ({ leaderboards: { teams } }) => {
    customElements.define("team-bio", Bio);

    [...teams]
        .sort((a, b) => (a.bioOrder >= b.bioOrder ? 1 : -1))
        .forEach((team) => {
            const newBio = document.createElement("team-bio");
            if (team.imgSrc) {
                newBio.setAttribute("src", team.imgSrc);
                if (team.src2x) {
                    newBio.setAttribute("src2x", team.src2x);
                }
            }
            newBio.setAttribute("name", team.teamName);
            newBio.setAttribute("body", team.body);
            document.getElementById("bioContainer").appendChild(newBio);
        });
};

export default setBios;
