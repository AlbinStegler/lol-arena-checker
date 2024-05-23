const url = {
    getPath: () => {
        if (process.env.NODE_ENV === 'production') {
            return 'http://16.171.53.167:3001';
        } else {
            return 'http://localhost:3001';
        }
    }
}

export default url;