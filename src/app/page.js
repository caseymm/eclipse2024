"use client";

import Image from 'next/image'
import * as d3 from 'd3'
import { root } from 'mathjs'
import styles from './page.module.css'
import { Single_Day } from 'next/font/google';
import overlap from './output.json';
import { useEffect, useRef } from 'react';


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
  let lineData = [
    [],
    [],
    []
  ];

  const RenderCircle = ({svg}) => {
    let r = 100;

    const gRef = useRef();
    let moon;
    let moonPath;

    useEffect(() => {
      drawCircles();
    }, []);

    const drawCircles = () => {
      const g = d3.select(gRef.current);
      // x = r * sin(-i),  y = r * cos(-i)
      [...Array(360).keys()].forEach(i => {
        let color = "";
        let cx = r * Math.sin(-i);
        let cy = r * Math.cos(-i);
        if(i === beginVertexAngle){
          color = "green";
          // generate start circle center
          cx = cx*2
          cy = cy*2
          lineData[0] = [cx, cy]
        }
        if(i === endVertexAngle){
          color = "red";
          // generate end circle center
          cx = cx*2
          cy = cy*2
          lineData[2] = [cx, cy]
        }
        if(i === midVertexAngle){
          const d = overlap[data.properties.obscuration.replace('%', '')]
          color = "pink";
          cx = cx*d
          cy = cy*d
          lineData[1] = [cx, cy]
        }
        if(color !== ""){
          g.append('circle')
           .attr('cx', cx)
           .attr('cy', cy)
           .attr('r', 2)
           .attr('fill', color)
        }
      })
      drawPaths();
    }

    const drawPaths = () => {
      const g = d3.select(gRef.current);
      // Define the Bezier curve generator
      const curve = d3.curveNatural; // You can choose different interpolation types

      const line = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(curve); // Apply the Bezier curve to the line

      // Add the Bezier curve path to the
      moonPath = g.append('path')
        .datum(lineData) // Bind the data
        .attr('d', line) // Use the line generator
        .attr('stroke', 'red')
        .attr('fill', 'none');
      
      moon = g.append('circle')
        // .attr('cx', lineData[0][0])
        // .attr('cy', lineData[0][1])
        .attr('r', 100)
        .attr('fill', 'pink');
      
      animateCircle();
    };

    const animateCircle = () => {
      // Select the circle element

      // const circle = d3.select(circleRef.current);
      // console.log(circle)
  
      // Use D3 transition to animate the circle along the path
      moon.transition()
        .duration(5000) // Duration of the animation (in milliseconds)
        .attrTween('transform', translateAlongPath)
        .on('end', animateCircle); // Restart the animation when it ends
    };
  
    const translateAlongPath = () => {
      return (t) => {
        // Get the current position along the path
        const path = moonPath.node();
        const l = path.getTotalLength();
        const p = path.getPointAtLength(t * l);
        // console.log(path)
  
        // Translate the circle to the new position
        return `translate(${p.x},${p.y})`;
      };
    };

    return(
      <g ref={gRef} transform="translate(300, 300)">
        <circle cx={'0px'} cy={'0px'} r={r} fill="blue"></circle>
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

      <svg className={styles.graphic} width={600} height={600}>
        <RenderCircle />
      </svg>
      

      <div className={styles.grid}>
        tktk
      </div>
    </main>
  )
}
