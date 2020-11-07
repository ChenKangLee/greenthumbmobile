// Develop server URL
const baseUrl = 'http://10.0.2.2:8080/api';

// AWS url
// const baseUrl = 'http://greenthumbmobile.us-west-2.elasticbeanstalk.com/api'

export function registLogin(googleId, name) {
    const url = `${baseUrl}/profile`;

    console.log(`[API] Make plant list GET to ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            googleId,
            name
        })
    }).then(res => {
        if(res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        // response is in JSON
        return res.json();
    }).catch(err => {
        console.log('[profile] error', err);
    });
}
