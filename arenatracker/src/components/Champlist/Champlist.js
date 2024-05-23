import React from "react";
import "./style.css"
import { useEffect, useState } from "react";
import champHelper from "../../models/champions";
import PacmanLoader from "react-spinners/PacmanLoader";

const Champlist = () => {
    const [champions, setChampions] = useState([]);
    const [doneChamps, setDoneChamps] = useState([]);

    const [summoner, setSummoner] = useState(null);
    const [champData, setChampData] = useState([]);
    const [lastChecked, setLastChecked] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(false);

    let matchesToCheck = 10;

    const fetchChampions = async () => {
        let res = await champHelper.getAllChampions();
        for (let key in res.data) {
            let formatedName = res.data[key].id.replace(' ', '').replace("'", "");
            res.data[key].url = champHelper.getChampImgUrl(formatedName);
        }
        setChampions(res.data);
    }

    useEffect(() => {
        fetchChampions();
    }, []);


    const getData = async () => {
        let sumname = summoner.split("#");
        setLoading(true);
        let champWon = await champHelper.getDoneChampions(sumname[0], sumname[1], lastChecked, matchesToCheck)
        if (champWon !== 429) {
            champData.forEach((champ) => {
                champWon.push(champ);
            });
            setChampData(champWon.slice(1, champWon.length));
            setLastChecked(lastChecked + matchesToCheck)
            setLoading(false);
            setSearch(true);
        } else {
            alert("Max calls reached wait a bit and try again.")
        }
    }




    useEffect(() => {
        const addToDone = () => {
            let done = [];
            champData.forEach((champName) => {
                if (Object.keys(champName)[0] !== "lastGameChecked") {
                    done.push(Object.keys(champName)[0]);
                }
            });
            setDoneChamps(done);
        }
        addToDone();
    }, [champData]);

    function handleSummonerChange(e) {
        setSummoner(e.target.value);
        // if (e.target.value === "") {
        //     setDoneChamps([]);
        // }
    }




    let WonChamps = () => {
        return doneChamps.map((champName) => {
            return (
                <div className="champion-container">
                    <img
                        className="champion-img"
                        src={champions[champName].url}
                        alt={champions[champName].name} />
                    <h3
                        className="champion-name"
                        key={champName}>{champions[champName].name}</h3>
                </div>
            );
        });
    }

    let LeftChamps = () => {
        return Object.keys(champions).map((key) => {
            if (doneChamps.includes(champions[key].name)) {
                return null;
            } else {
                return (
                    <div className="champion-container">
                        <img
                            className="champion-img"
                            src={champions[key].url === "FiddleSticks" ? "https://ddragon.leagueoflegends.com/cdn/11.16.1/img/champion/Fiddlesticks.png" : champions[key].url}
                            alt={champions[key].name === "FiddleSticks" ? "Fiddlesticks" : champions[key].name} />
                        <h3
                            className="champion-name"
                            key={key}>{champions[key].name === "FiddleSticks" ? "Fiddlesticks" : champions[key].name}</h3>
                        {/* <input className="champ-status" type="checkbox" /> */}
                    </div>
                );
            }
        });
    }

    let GamesChecked = () => {
        return (<h1 className="last-checked">Game {lastChecked} - {lastChecked + matchesToCheck}</h1>)
    }; // {lastChecked}

    let InputSummoner = () => {
        return (<><div className="summoner">
            <input onChange={(e) => handleSummonerChange(e)} type="text" placeholder="Summoner Name" name="summonername" />
            <button onClick={getData}>Search</button>
        </div></>)
    }

    let LoadMoreMatches = () => {
        return (<button className="load-more-button" onClick={getData}>Load more</button>)
    };


    return (
        <>
            {
                loading ? <div className="loader"><PacmanLoader color="#36d7b7" className="loader" /></div> : null
            }
            {
                search ? <LoadMoreMatches /> : <InputSummoner />
            }
            <GamesChecked />
            <div className="lists-container">
                <div className="champ-list not-done">
                    <h2>Left {champions.length}</h2>
                    <LeftChamps />
                </div>
                <div className="champ-list done">
                    <h2>Won</h2>
                    <WonChamps />
                </div>
            </div>
        </>
    );
}
export default Champlist;