const axios = require('axios');
const queryString = require('querystring');

async function publicCall(path, data, method = 'GET', headers = {}) {
    try {
        const qs = data ? `?${queryString.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        });
        return result.data;
    } catch (err) {
        console.error(err);
    }
}

async function time() {
    return publicCall('/v3/time');
}

async function depth(symbol = 'BTCBUSD', limit = 5) {
    return publicCall('/v3/depth', { symbol, limit });
}

module.exports = { time, depth }