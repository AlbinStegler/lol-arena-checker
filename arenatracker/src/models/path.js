const url = {
    getPath: () => {
        if (process.env.NODE_ENV === 'production') {
            return 'https://16.171.53.167.nip.io';
        } else {
            return 'http://localhost:3001';
        }
    }
}

export default url;