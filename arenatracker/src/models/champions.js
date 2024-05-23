import url from './path';

const champHelper = {
    getAllChampions: async () => {
        try {
            const champions = await fetch("https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/champion.json", {
                method: "GET",
            });
            return await champions.json();
        }
        catch (error) {
            console.error("Error fetching champions", error);
            return [];
        }
    },
    getChampImgUrl: (champName) => {
        let formatedName = champName.replace(' ', '').replace("'", "");
        return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${formatedName}.png`;
    },
    getDoneChampions: async (summonerName, tag, start, count = 20) => {
        try {
            let path = url.getPath();
            const champions = await fetch(`${path}/europe/matches/${summonerName}/${tag}/${start}/${count}`, {
                method: "GET",
            });
            return await champions.json();
        }
        catch (error) {
            console.log("Error fetching champions", error);
            return "Wait 2 minutes for update";
        }
    }
}
export default champHelper;