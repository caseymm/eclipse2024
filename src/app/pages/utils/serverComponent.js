import mapboxSdk from '@mapbox/mapbox-sdk';
import mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapboxClient = mapboxSdk({ accessToken: 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w' });
const geocodingClient = mapboxGeocoding(mapboxClient);

export async function getData(lon, lat) {
  // console.log('lon lat', lon, lat);
  let url = `https://0fo4mcng59.execute-api.us-east-1.amazonaws.com/default/eclipse-proxy?lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  console.log(res)

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export const getCurrentCity = (longitude, latitude) => {
  console.log('get current city')
  return new Promise((resolve, reject) => {
    geocodingClient.reverseGeocode({
      query: [longitude, latitude],
      limit: 1
    })
    .send()
    .then(response => {
      const match = response.body;
      const place = match.features[0].place_name;
      resolve(place);
    })
    .catch(error => {
      reject(error);
    });
  });
};
