import React from "react";
import "./style.css";
import { useEffect, useState } from "react";
import champHelper from "../../models/champions";

const Summoner = () => {

    const [summoner, setSummoner] = useState(null);
    const [champData, setChampData] = useState([]);


    const getData = async () => {
        let sumname = summoner.split("#");
        let champWon = await champHelper.getDoneChampions(sumname[0], sumname[1], 0, 80)
        setChampData(champWon);
    }

    useEffect(() => {
        console.log(champData);
    }, [champData]);

    return (
        <div className="summoner">
            <input onChange={(e) => setSummoner(e.target.value)} type="text" placeholder="Summoner Name" />
            <button onClick={getData}>Search</button>
        </div>
    );
}
export default Summoner;