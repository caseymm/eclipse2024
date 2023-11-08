import Image from 'next/image'
import * as d3 from 'd3'
import styles from './page.module.css'
import { Single_Day } from 'next/font/google';

async function getData() {
  let url = 'https://aa.usno.navy.mil/api/eclipses/solar/date?date=2024-4-08 &coords=46.67, -122.65 &height=15';
  const res = await fetch(url)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default async function Home() {
  // const data = await getData()
  // console.log(data)
  const data = {
    "apiversion": "4.0.1", 
    "geometry": {
      "coordinates": [
        -122.65, 
        46.67
      ], 
      "height": "15m", 
      "type": "Point"
    }, 
    "properties": {
      "day": 8, 
      "delta_t": "72.8s", 
      "description": "Sun in Partial Eclipse at this Location", 
      "duration": "1h 43m 33.9s", 
      "event": "Solar Eclipse of 2024 April 08", 
      "local_data": [
        {
          "altitude": "38.7", 
          "azimuth": "127.1", 
          "day": "8", 
          "phenomenon": "Eclipse Begins", 
          "position_angle": "188.2", 
          "time": "17:36:36.0", 
          "vertex_angle": "221.8"
        }, 
        {
          "altitude": "44.9", 
          "azimuth": "141.8", 
          "day": "8", 
          "phenomenon": "Maximum Eclipse", 
          "time": "18:27:28.9"
        }, 
        {
          "altitude": "49.4", 
          "azimuth": "160.0", 
          "day": "8", 
          "phenomenon": "Eclipse Ends", 
          "position_angle": "94.5", 
          "time": "19:20:09.9", 
          "vertex_angle": "108.4"
        }
      ], 
      "magnitude": "0.318", 
      "month": 4, 
      "obscuration": "20.8%", 
      "year": 2024
    }, 
    "type": "Feature"
  };

  const begin = data.properties.local_data.filter(item => item.phenomenon === 'Eclipse Begins')[0];
  const end = data.properties.local_data.filter(item => item.phenomenon === 'Eclipse Ends')[0];

  const beginVertexAngle = Math.round(parseFloat(begin.vertex_angle));
  const endVertexAngle = Math.round(parseFloat(end.vertex_angle));
  const midVertexAngle = (beginVertexAngle + endVertexAngle) / 2;
  // console.log(beginVertexAngle, endVertexAngle)

  // let coverage = .5;
  // c * 3.14 = 2 * Math.acos(d / 2) - d * Math.sqrt(1 - d ** 2 / 4)
  // const coverage = (2 * Math.acos(d / 2) - d * Math.sqrt(1 - d ** 2 / 4)) / Math.PI; 

  const RenderCircle = ({svg}) => {
    let r = 100;
    const Circles = () => {
      // x = r * sin(-i),  y = r * cos(-i)
      
      return([...Array(360).keys()].map(i => {
        let color = "";
        if(i === beginVertexAngle){
          color = "green";
        }
        if(i === endVertexAngle){
          color = "red";
        }
        return <circle cx={r * Math.sin(-i) + r} cy={r * Math.cos(-i) + r} fill={color} r="2px"></circle>
      }))
    }
    return(
      <g>
        <circle cx={'100px'} cy={'100px'} r={r} fill="blue"></circle>
        <Circles/>
      </g>
      
    )
  }

  return (
    <main className={styles.main}>
      {/* {data.geometry.coordinates} */}
      {/* <div className={}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div> */}

      <svg width={600} height={600}>
        <RenderCircle />
      </svg>
      

      <div className={styles.grid}>
        tktk
      </div>
    </main>
  )
}
