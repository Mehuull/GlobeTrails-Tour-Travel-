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
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));

    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Body snippet:', data.substring(0, 500));
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
