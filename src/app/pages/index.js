"use client"
import styles from '../page.module.scss'
import { useState, useEffect, useRef } from 'react';
// import cities from '../data/cities.json';
import RenderCircle from '../components/RenderCircle';
import Geocoder from '../components/Geocoder';
import Map from '../components/Globe';
import TitleScroll from '../components/TitleScroll'; 
import EclipseClosestPoint from '../components/EclipseClosestPoint';
import { getData, getCurrentCity } from './utils/serverComponent';
import initialData from '../data/init.json';


export default function Graphic() {
  console.log('ggg')

  const [scrollPosition, setScrollPosition] = useState(0);
  const [data, setData] = useState(null);
  const [city, setCity] = useState('')

  const handleScroll = (position) => {
    // Update the scroll position in the parent component
    setScrollPosition(position);
  };  
  // console.log(progress)

  // if (!data) {
  //   // Render loading state or return null
  //   return null;
  // }

  const handleDataUpdate = async (longitude, latitude) => {
    try {
      const updatedData = await getData(longitude, latitude);
      const maxTimeInt = Math.round(updatedData.properties.local_data.length/2) - 1;
      const maxTime = updatedData.properties.local_data[maxTimeInt].time;
      updatedData.properties.maxTime = maxTime;
      setData(updatedData);
      console.log('Data updated:', updatedData);
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
        setData(initialData);
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            getCurrentCity(position.coords.longitude, position.coords.latitude).then(setCity);
            handleDataUpdate(position.coords.longitude, position.coords.latitude)
        }, () => {
            setData(initialData);
        });
    }
    // setData(initialData);
  }, []);

  
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
      <Map scrollPos={scrollPosition} />
      <div className="hed">
        <TitleScroll onScroll={handleScroll} />
      </div>
      <div className="bridge"></div>
      {data &&
        <div>
          <div className="graphic">
            <div className="data-body">
              <Geocoder onDataUpdate={handleDataUpdate} initCity={city} />
              <div style={{lineHeight: '1.4'}}>
                will experience a maximum of {data.properties.obscuration} obscuration at {parseAndDisplayTime(data.properties.maxTime, true)}. 
              </div>
              <div style={{lineHeight: '1.4', marginTop: '8px'}}>
              The eclipse will last a total of {data.properties.duration}, starting at {parseAndDisplayTime(data.properties.local_data[0].time, true)} and ending 
                at {parseAndDisplayTime(data.properties.local_data[data.properties.local_data.length - 1].time, true)}.
              </div>
            </div>
            <svg className="svg-graphic" width={"100%"} height={1100}>
              <RenderCircle
                data={data}
                obscuration={data.properties.obscuration}
                radius={100}
                length={data.properties.local_data.length}
              />
            </svg>
          </div>
          <EclipseClosestPoint userLocation={data.geometry.coordinates} isTotality={data.properties.obscuration === "100.0%" ? true : false } />
        </div>
      }
      <div className="footer">
        <div className="info">
          <p>© <a href="https://caseymmiller.com">caseymmiller</a> /  Sources: <a href="https://aa.usno.navy.mil/data/SolarEclipses">USNO Eclipse API</a> & <a href="https://science.nasa.gov/solar-system/skywatching/how-is-the-2024-total-solar-eclipse-different-than-the-2017-eclipse/">NASA</a></p>
        </div>
      </div>
    </main>
  )
}