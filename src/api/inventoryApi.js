// Develop server URL
const baseUrl = 'http://10.0.2.2:8080/api';

// AWS url
// const baseUrl = 'http://greenthumbmobile.us-west-2.elasticbeanstalk.com/api'

export function getList(googleId) {
    const url = `${baseUrl}/inventory`;

    console.log(`[API] Make plant list POST to ${url}`);

    // console.log(googleId);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            googleId
        })
    }).then(res => {
        if(res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}

export function createPlant(plantName, plantType, potArea, potVolume, googleId) {
    const url = `${baseUrl}/inventory/add`;

    console.log(`[API] Make createPlant POST to ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plantName,
            plantType,
            potArea,
            potVolume,
            googleId
        })
    }).then(res => {
        if(res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        // console.log(res.data);

        return res.data;
    });
}

export function deletePlant(plantId) {
    const url = `${baseUrl}/inventory/delete`;

    console.log(`[API] Make deletePlant POST to ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plantId
        })
    }).then(res => {
        if(res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        // console.log(res.data);
        return res.data;
    });
}
