let express = require('express');
let cors = require('cors');
require('dotenv').config();
const axios = require('axios');

let app = express();

app.use(cors());

const API_KEY = process.env.API_KEY;

async function getPUUID(region, summonerName, tag) {
    try {
        const response = await axios.get(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${API_KEY}`);
        return response.data.puuid;
    } catch (error) {
        return error;
    }
}

async function getMatchIds(region, summonerName, tag, start = 0, count = 20) {
    const puuid = await getPUUID(region, summonerName, tag);
    try {
        const response = await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${API_KEY}`);
        response.data.puuid = puuid;
        return response.data;
    } catch (error) {
        return error;
    }
}


// app.get('/europe/PUUID/:summonerName/:tag', async (req, res) => {
//     try {
//         let summonerName = req.params.summonerName;
//         let tag = req.params.tag;
//         const response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${API_KEY}`);
//         res.send(response.data);
//     } catch (error) {
//         res.send(error);
//     }
// });


app.get('/europe/matches/:summonerName/:tag/:start/:count', async (req, res) => {
    let start = req.params.start || 0;
    let count = req.params.count || 20;
    let summonerName = req.params.summonerName;
    let tag = req.params.tag;
    console.log(`Getting ${count} matches for ${summonerName}#${tag} starting from match ${start}`)
    try {
        let matchIds = await getMatchIds('europe', summonerName, tag, start, count);
        console.log(matchIds)
        let matchData = [];
        let current = parseInt(start);
        for (let i = 0; i < matchIds.length; i++) {
            current += 1;
            try {
                let response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchIds[i]}?api_key=${API_KEY}`);
                if (response.data.info.gameMode === "CHERRY") {
                    for (let j = 0; j < response.data.info.participants.length; j++) {
                        if (response.data.info.participants[j].riotIdGameName === summonerName && response.data.info.participants[j].placement == 1) {
                            const champName = response.data.info.participants[j].championName;
                            console.log(champName);
                            matchData.push({ [champName]: response.data.info });
                        }
                    }
                }
            } catch (error) {
                matchData.unshift({ "lastGameChecked": current });
                res.status(429).send(error);
                // return;
            }
        }
        console.log(matchData.length + ` arena matches won past ${count} games`)
        matchData.unshift({ "lastGameChecked": current });
        res.status(200).send(matchData);
    } catch (error) {
        console.log(error);
        if (error.status === 429) {
            res.status(429).send(error);
        }
        res.status(500).send(error);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});