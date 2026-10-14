const axios = require('axios');
const url = 'https://us1.locationiq.com/v1/search?key=pk.f4c3e2a87cd918273dca297897c94fa4&q=' + encodeURIComponent('Pune') + '&format=json&limit=1';
axios.get(url).then(res => console.log(JSON.stringify(res.data, null, 2))).catch(err => console.error(err.response ? err.response.data : err.message));
