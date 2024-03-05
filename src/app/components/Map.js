import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import centerPath from '../data/center.json';

const Map = ({ center, scrollPos }) => {
  const [map, setMap] = useState(null);

  function pointOnLine(pos) {
    let totalLen = centerPath.features[0]['geometry']['coordinates'][0].length;
    let cPos = Math.round((pos * totalLen) / 100);
    console.log(cPos)
    return {
        'type': 'Point',
        'coordinates': centerPath.features[0]['geometry']['coordinates'][0][cPos]
    };
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w';

    if (!map) {
      const newMap = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/caseymmiler/clt4ykbgp00cu01qpequ67ei8',
        center: [-99.17, 39.85],
        zoom: 2
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
                'line-color': '#fff',
                'line-width': 0
            }
        });

        newMap.addSource('point', {
            'type': 'geojson',
            'data': pointOnLine(0)
        });

        // newMap.addLayer({
        //   'id': 'point2',
        //   'source': 'point',
        //   'type': 'circle',
        //   'paint': {
        //       'circle-radius': 60,
        //       'circle-color': '#ff0080',
        //       'circle-opacity': 0.2
        //   }
        // });

        // newMap.addLayer({
        //   'id': 'point1',
        //   'source': 'point',
        //   'type': 'circle',
        //   'paint': {
        //       'circle-radius': 28,
        //       'circle-color': '#ff0080',
        //       'circle-opacity': 0.2
        //   }
        // });

        newMap.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'circle',
            'paint': {
                'circle-radius': 8,
                'circle-color': '#000',
                'circle-stroke-color': '#f7e305',
                'circle-stroke-width': 1,
                'circle-opacity': 1
            }
        });

      });
      // fly to geolocated position
      setMap(newMap);
    }

    // TO DO: fix rendering twice -- hack is to display:none first map canvas

    return () => {
      if (map) {
        map.remove(); // Cleanup on unmount
      }
    };
  }, [map]); // Only re-run the effect if `map` or `center` changes

  useEffect(() => {
    if(map && scrollPos){
      if(scrollPos === 99){
        map.flyTo({
          center,
          zoom: 12 // You can adjust the zoom level as needed
        });
      } else {
        if(map.getZoom() !== 2){
          map.flyTo({
            center,
            zoom: 2 // You can adjust the zoom level as needed
          });
        }
        map.getSource('point').setData(pointOnLine(scrollPos));
      }
    }
  }, [map, scrollPos])

  useEffect(() => {
    if (map && center) {
      // Update the map's center when the `center` prop changes
      // map.flyTo({
      //   center,
      //   zoom: 12 // You can adjust the zoom level as needed
      // });
      if(scrollPos === 99){
        map.flyTo({
          center: [-99.17, 39.85],
          zoom: 12 // You can adjust the zoom level as needed
        });
      }
    }
    
  }, [map, center]);

  return <div id="map-container" style={{ height: '100vh', width: '100%', position: 'absolute' }} />;
};

export default Map;