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