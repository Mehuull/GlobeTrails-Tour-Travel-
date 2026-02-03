const https = require('https');

const check = (path) => {
    const options = {
        hostname: 'globe-trails-tour-travel.vercel.app',
        path: path,
        method: 'GET',
        headers: {
            'Origin': 'https://globetrails.netlify.app'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (d) => data += d);
        res.on('end', () => {
            console.log(`PATH: ${path}`);
            console.log('STATUS:', res.statusCode);
            console.log('CORS_HEADER:', res.headers['access-control-allow-origin']);
            if (data.includes('version')) {
                console.log('BODY:', data);
            }
            console.log('---');
        });
    });
    req.end();
};

check('/');
check('/tours');
