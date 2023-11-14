// components/Map.js
"use client"
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import { getData } from '../pages/utils/serverComponent';

const Map = ({onDataUpdate}) => {

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w';
    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/caseymmiler/cloxgjeqt00pk01pe0ack0ylb',
      center: [-99.17, 39.85],
      zoom: 3.5,
    });

    // Add Mapbox Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder);

    // Event listener for when a result is selected
    geocoder.on('result', (event) => {
      const longitude = event.result.center[0];
      const latitude = event.result.center[1];
      onDataUpdate(longitude, latitude);
      // const longitude = event.result.center[0];
      // const latitude = event.result.center[1];
      // getData(longitude, latitude).then((result) => {
      //   // Call the callback function with the result
      //   onDataUpdate(result);
      // });
    });

    return () => map.remove(); // Cleanup on unmount
  }, [onDataUpdate]);

  return <div id="map-container" style={{ height: '400px' }} />;
};

export default Map;
