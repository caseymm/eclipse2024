import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import centerPath from '../data/center.json';

const Map = ({ center, scrollPos }) => {
  const [map, setMap] = useState(null);

  function pointOnLine(pos) {
    
    let position = Math.round(pos * 100)
    console.log(position)
    return {
        'type': 'Point',
        'coordinates': centerPath.features[0]['geometry']['coordinates'][0][position]
    };
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w';

    if (!map) {
      const newMap = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/caseymmiler/clt4ykbgp00cu01qpequ67ei8',
        center: [-99.17, 39.85],
        zoom: 1.5
      });

      // Add GeoJSON layer to the map
      newMap.on('load', function () {
        newMap.addSource('center-line', {
            type: 'geojson',
            data: centerPath
        });

        newMap.addLayer({
            'id': 'center-path',
            'type': 'line',
            'source': 'center-line',
            'layout': {},
            'paint': {
                'line-color': '#088',
                'line-width': 3
                // 'fill-opacity': 0.8
            }
        });

        newMap.addSource('point', {
            'type': 'geojson',
            'data': pointOnLine(0)
        });


        newMap.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'circle',
            'paint': {
                'circle-radius': 10,
                'circle-color': '#007cbf'
            }
        });


    });

    // fly to geolocated position
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove(); // Cleanup on unmount
      }
    };
  }, []); // Only re-run the effect if `map` or `center` changes

  useEffect(() => {
    if(map && scrollPos){
      console.log(scrollPos)
      map.getSource('point').setData(pointOnLine(scrollPos));
    }
  }, [map, scrollPos])

  useEffect(() => {
    if (map && center) {
      // Update the map's center when the `center` prop changes
      // map.flyTo({
      //   center,
      //   zoom: 12 // You can adjust the zoom level as needed
      // });
    }
    
  }, [map, center]);

  return <div id="map-container" style={{ height: '600px', width: '50%' }} />;
};

export default Map;