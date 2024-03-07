"use client"
import Image from 'next/image'
import styles from '../page.module.scss'
import { useState, useEffect, useRef } from 'react';
// import { Single_Day } from 'next/font/google';
import cities from '../data/cities.json';
import RenderCircle from '../components/RenderCircle';
import Geocoder from '../components/Geocoder';
import Map from '../components/Globe';
// import USMap from '../components/usMap';
import TitleScroll from '../components/TitleScroll'; 
import EclipseClosestPoint from '../components/EclipseClosestPoint';
import { getData } from './utils/serverComponent';
import initialData from '../data/init.json';


export default function Graphic() {
  console.log('ggg')

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
    <main>
      <Map currentLocation={data.geometry.coordinates} center={data.geometry.coordinates} scrollPos={scrollPosition} />
      <div className="hed">
        <TitleScroll onScroll={handleScroll} />
        
      </div>
      <div className="bridge">
        <p>Totality times range from xx to yy.</p>
      </div>
      <div className="graphic">
        <div className="data-body">
          <Geocoder onDataUpdate={handleDataUpdate} />
          <div style={{display: 'inline', lineHeight: '1.6'}}>
            will experience a maximum of {data.properties.obscuration} obscuration at {parseAndDisplayTime(data.properties.maxTime, true)}. The eclipse will last a 
            total of {data.properties.duration}, starting at {parseAndDisplayTime(data.properties.local_data[0].time, true)} and ending 
            at {parseAndDisplayTime(data.properties.local_data[data.properties.local_data.length - 1].time, true)}.
          </div>
        </div>
        <svg className="svg-graphic" width={window.innerWidth} height={900}>
          <RenderCircle
            data={data}
            obscuration={data.properties.obscuration}
            radius={100}
            wxh={window.innerWidth}
            length={data.properties.local_data.length}
          />
        </svg>
      </div>
      <EclipseClosestPoint userLocation={data.geometry.coordinates} isTotality={data.properties.obscuration === "100.0%" ? true : false } />
      {/* <Cities /> */}
      {/* <USMap currentLocation={data.geometry.coordinates}></USMap> */}
    </main>
  )
}