"use client"
import Image from 'next/image'
import styles from '../page.module.css'
import { useState, useEffect } from 'react';
// import { Single_Day } from 'next/font/google';
import cities from '../cities.json';
import RenderCircle from '../components/RenderCircle';
import Geocoder from '../components/Geocoder';
import Map from '../components/Map';
import { getData } from './utils/serverComponent';


export default function Graphic() {

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
  const [data, setData] = useState(initialData);

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
      updatedData.placeName = placeName;
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
  

  return (
    // <Image
    //   className={styles.logo}
    //   src="/next.svg"
    //   alt="Next.js Logo"
    //   width={180}
    //   height={37}
    //   priority
    // />
    <main className={styles.main}>
      <Cities />

      <h1>{data.placeName}</h1>
      <svg className={styles.graphic} width={600} height={600}>
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: 'rgba(255, 255, 0, 0.5)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(255, 255, 0, 0)', stopOpacity: 1}} />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="175" fill="url(#grad1)" />
        <RenderCircle
          data={data}
          obscuration={data.properties.obscuration}
          radius={100}
          wxh={600}
        />
      </svg>

      <div className={styles.grid}>
        tktk
      </div>
      <Geocoder onDataUpdate={handleDataUpdate}  />
      <Map center={data.geometry.coordinates} />
    </main>
  )
}