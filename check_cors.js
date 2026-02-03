const https = require('https');

const options = {
    hostname: 'globe-trails-tour-travel.vercel.app',
    path: '/tours',
    method: 'GET',
    headers: {
        'Origin': 'https://globetrails.netlify.app'
    }
};

const req = https.request(options, (res) => {
    console.log('CORS_HEADER:', res.headers['access-control-allow-origin']);
});

req.end();
