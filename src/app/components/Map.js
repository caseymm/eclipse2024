import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ({ center }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w';

    if (!map) {
      const newMap = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/caseymmiler/clp32icao00xa01qo8jkabqet',
        center: [-99.17, 39.85],
        zoom: 3.5
      });

      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove(); // Cleanup on unmount
      }
    };
  }, []); // Only re-run the effect if `map` or `center` changes

  useEffect(() => {
    if (map && center) {
      // Update the map's center when the `center` prop changes
      map.flyTo({
        center,
        zoom: 12 // You can adjust the zoom level as needed
      });
    }
  }, [map, center]);

  return <div id="map-container" style={{ height: '600px' }} />;
};

export default Map;