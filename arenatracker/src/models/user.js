

const userHelper = {
    getPUUID: async (region, name, tag) => {
        const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${process.env.REACT_APP_RIOT_API_KEY}`;
        try {
            const response = await fetch(url, {
                method: "GET",


            });

            console.log('Response Status:', response.status);
            console.log('Response Status Text:', response.statusText);

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Error fetching PUUID: ${response.statusText} - ${errorDetails}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Failed to fetch PUUID:', err);
            throw err; // Optionally re-throw the error if you want to handle it elsewhere
        }
    }
}

export default userHelper;
