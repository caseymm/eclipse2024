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

  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (position) => {
    // Update the scroll position in the parent component
    setScrollPosition(position);
  };

  const [data, setData] = useState(initialData);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // const intervalRef = useRef(null);
  const animationRef = useRef(null);

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
      updatedData.maxTime = maxTime;
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

  const handleScrubberChange = (e) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handlePlayClick = () => {
    setIsPlaying((prevState) => !prevState); // Toggle play state
  };

  const animate = (timestamp) => {
    setCurrentTime((prevTime) => {
      const nextTime = prevTime + (timestamp - animationRef.current) * 0.001; // Convert milliseconds to seconds
      if (nextTime >= 1) {
        setCurrentTime(0); // Reset current time
        cancelAnimationFrame(animationRef.current);
        // setIsPlaying(false); // Stop playing at the end
        return 0; // Clamp to 1
      }
      return nextTime;
    });
    animationRef.current = timestamp;
    if (isPlaying) {
      requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    console.log(isPlaying)
    if (isPlaying) {
      animationRef.current = performance.now();
      requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current); // Cancel animation frame on component unmount
  }, [isPlaying]); // Run effect whenever isPlaying changes


  return (
    <main className={styles.main}>
      <Map currentLocation={data.geometry.coordinates} center={data.geometry.coordinates} scrollPos={scrollPosition} />
      <div className="hed">
        <TitleScroll onScroll={handleScroll} />
        <div className="graphic">
          {/* <h1>{data.placeName}</h1> */}
          <div>
            <Geocoder onDataUpdate={handleDataUpdate} />
            will experience a maximum of {data.properties.obscuration} obscuration at {data.maxTime}. The eclipse will last a 
            total of {data.properties.duration}, starting at {data.properties.local_data[0].time} and ending 
            at {data.properties.local_data[data.properties.local_data.length - 1].time}.
          </div>
          <div
            onClick={handlePlayClick}
            style={{
              border: '1px solid black',
              padding: '5px',
              margin: '5px',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </div>
          <input
            className="scrubber"
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={currentTime}
            onChange={handleScrubberChange}
          />
          
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
              currentTime={currentTime}
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