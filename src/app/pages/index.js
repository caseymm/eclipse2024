"use client"
import Image from 'next/image'
import styles from '../page.module.scss'
import { useState, useEffect, useRef } from 'react';
// import { Single_Day } from 'next/font/google';
import cities from '../data/cities.json';
import RenderCircle from '../components/RenderCircle';
import Geocoder from '../components/Geocoder';
import Map from '../components/Map';
// import USMap from '../components/usMap';
import TitleScroll from '../components/TitleScroll'; 
import { getData } from './utils/serverComponent';


export default function Graphic() {
  console.log('ggg')

  const initialData = {
    "placeName": "Erie, PA",
    "apiversion": "4.0.1", 
    "geometry": {
      "coordinates": [
        -80.085281, 
        42.129072
      ], 
      "height": "15m", 
      "type": "Point"
    }, 
    "properties": {
      "day": 8, 
      "delta_t": "72.8s", 
      "description": "Sun in Total Eclipse at this Location", 
      "duration": "2h 28m 23.5s", 
      "duration_of_totality": "3m 44.3s", 
      "event": "Solar Eclipse of 2024 April 08", 
      "maxTime": "19:18:08.5",
      "local_data": [
        {
          "altitude": "54.3", 
          "azimuth": "197.3", 
          "day": "8", 
          "phenomenon": "Eclipse Begins", 
          "position_angle": "231.8", 
          "time": "18:02:21.6", 
          "vertex_angle": "219.2"
        }, 
        {
          "altitude": "47.2", 
          "azimuth": "224.3", 
          "day": "8", 
          "phenomenon": "Totality Begins", 
          "position_angle": "66.5", 
          "time": "19:16:17.2", 
          "vertex_angle": "35.1"
        }, 
        {
          "altitude": "47.0", 
          "azimuth": "224.9", 
          "day": "8", 
          "phenomenon": "Maximum Eclipse", 
          "time": "19:18:08.5"
        }, 
        {
          "altitude": "46.8", 
          "azimuth": "225.5", 
          "day": "8", 
          "phenomenon": "Totality Ends", 
          "position_angle": "219.3", 
          "time": "19:20:01.5", 
          "vertex_angle": "187.2"
        }, 
        {
          "altitude": "36.0", 
          "azimuth": "244.1", 
          "day": "8", 
          "phenomenon": "Eclipse Ends", 
          "position_angle": "54.3", 
          "time": "20:30:45.1", 
          "vertex_angle": "12.1"
        }
      ], 
      "magnitude": "1.020", 
      "month": 4, 
      "obscuration": "100.0%", 
      "year": 2024
    }, 
    "type": "Feature"
  }

  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (position) => {
    // Update the scroll position in the parent component
    setScrollPosition(position);
  };

  const [data, setData] = useState(initialData);
  // console.log(progress)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await getData(-80.08468071724317, 42.12912811069792);
  //       setData(result);
  //       console.log(result);
  //     } catch (error) {
  //       console.error('Error fetching data:', error.message);
  //     }
  //   };

  //   fetchData();
  // }, []); // Empty dependency array ensures the effect runs once on mount

  if (!data) {
    // Render loading state or return null
    return null;
  }

  const handleDataUpdate = async (longitude, latitude, placeName) => {
    try {
      const updatedData = await getData(longitude, latitude);
      const maxTimeInt = Math.round(updatedData.properties.local_data.length/2) - 1;
      const maxTime = updatedData.properties.local_data[maxTimeInt].time;
      updatedData.properties.maxTime = maxTime;
      // updatedData.placeName = placeName;
      setData(updatedData);
      console.log('Data updated:', updatedData);
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  const Cities = () => {
    const [cityData, setCityData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const promises = cities.map(async (c) => {
          let data = await getData(c.longitude, c.latitude);
          data.city = c.city;
          return data;
        });
  
        const cityDataResults = await Promise.all(promises);
        setCityData(cityDataResults);
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        {cityData.map((data, index) => (
          <div className={styles.city} key={data.city}>
            <h3>{data.city}</h3>
            <svg key={index} className={styles.graphic} width={200} height={200}>
              <RenderCircle data={data} obscuration={data.properties.obscuration} radius={30} wxh={200} />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  function parseAndDisplayTime(timeString, first) {
    const utcDateTime = `2024-04-08T${timeString}Z`;
    // Parse the UTC time
    const date = new Date(utcDateTime);
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    const localTime = date.toLocaleTimeString('en-US', options);

    if(first){
      return localTime;
    } else {
      return localTime.split(' ')[0];
    }
  }

  return (
    <main className={styles.main}>
      <Map currentLocation={data.geometry.coordinates} center={data.geometry.coordinates} scrollPos={scrollPosition} />
      <div className="hed">
        <TitleScroll onScroll={handleScroll} />
        <div className="graphic">
          {/* <h1>{data.placeName}</h1> */}
          <div className="data-body">
            <Geocoder onDataUpdate={handleDataUpdate} />
            <div style={{display: 'inline', lineHeight: '1.6'}}>
              will experience a maximum of {data.properties.obscuration} obscuration at {parseAndDisplayTime(data.properties.maxTime, true)}. The eclipse will last a 
              total of {data.properties.duration}, starting at {parseAndDisplayTime(data.properties.local_data[0].time, true)} and ending 
              at {parseAndDisplayTime(data.properties.local_data[data.properties.local_data.length - 1].time, true)}.
            </div>
          </div>
          
          <svg className="svg-graphic" width={600} height={600}>
            <defs>
              <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'rgba(255, 255, 0, 0.5)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'rgba(255, 255, 0, 0)', stopOpacity: 1}} />
              </radialGradient>
            </defs>
            
            <RenderCircle
              data={data}
              obscuration={data.properties.obscuration}
              radius={100}
              wxh={600}
              length={data.properties.local_data.length}
            />
          </svg>
        </div>
      </div>
      {/* <Cities /> */}
      {/* <USMap currentLocation={data.geometry.coordinates}></USMap> */}
      <div className={styles.grid}>
        tktk
      </div>
    </main>
  )
}