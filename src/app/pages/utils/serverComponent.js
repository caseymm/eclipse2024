export async function getData(lon, lat) {
  // console.log('lon lat', lon, lat);
  let url = `https://aa.usno.navy.mil/api/eclipses/solar/date?date=2024-4-08&coords=${lat},${lon}&height=15`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}