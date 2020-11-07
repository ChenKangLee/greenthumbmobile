// Develop server URL
const baseUrl = 'http://10.0.2.2:8080/api';

// AWS url
// const baseUrl = 'http://greenthumbmobile.us-west-2.elasticbeanstalk.com/api'

export function completeWaterEvent(plantId, wateringTime) {
    const url = `${baseUrl}/inventory/water`;

    console.log(`[API] complete waterEvent POST: ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plantId,
            wateringTime
        })
    }).then(res => {
        if(res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        console.log(res);

        return res;
    })
}
