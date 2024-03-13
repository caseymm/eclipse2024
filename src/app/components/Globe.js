import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import centerPath from '../data/center.json';

const Map = ({ scrollPos }) => {
  const [map, setMap] = useState(null);
  // const globeCenter = [-89.614, 39.512];
  const globeCenter = [-109.67057, 19.3424];
  const citiesLayer = 'cities-eclipse';
  // const positions = {
  //   'Mazatlán'
  // }

  function pointOnLine(pos) {
    let totalLen = centerPath.features[0]['geometry']['coordinates'][0].length;
    let cPos = Math.round((pos * totalLen) / 100);
    console.log(pos, cPos)
    if(cPos > totalLen){
      cPos = totalLen - 1;
    }
    return {
        'type': 'Point',
        'coordinates': centerPath.features[0]['geometry']['coordinates'][0][cPos]
    };
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w';
    let zoom = 2;
    let moonRadius = 8;
    if(window.innerWidth < 800){
      moonRadius = 6;
      zoom = 1.5;
    }
    if(window.innerWidth < 600){
      moonRadius = 5;
      zoom = .8;
    }

    if (!map) {
      const newMap = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/caseymmiler/clt4ykbgp00cu01qpequ67ei8',
        center: globeCenter,
        zoom: zoom
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
                'circle-radius': moonRadius,
                'circle-color': '#000',
                'circle-stroke-color': '#f7e305',
                'circle-stroke-width': 1,
                'circle-opacity': 1
            }
        });

        newMap.setFilter(citiesLayer, ['==', 'name', ""]);

        // Get features from the specified layer
        // const cityFeatures = newMap.queryRenderedFeatures({ layers: [citiesLayer] });

        // // Do something with the features
        // console.log(cityFeatures);

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
      let currentCity = '';
      if(scrollPos > 8 && scrollPos < 17){
        currentCity = 'Mazatlán';
      } else if(scrollPos > 31 && scrollPos < 41){
        currentCity = 'Austin';
      } else if(scrollPos > 40 && scrollPos < 49){
        currentCity = 'Dallas';
      } else if(scrollPos > 50 && scrollPos < 59){
        currentCity = 'Little Rock';
      } else if(scrollPos > 63 && scrollPos < 68){
        currentCity = 'Indianapolis';
      } else if(scrollPos > 67 && scrollPos < 73){
        currentCity = 'Cleveland';
      } else if(scrollPos > 73 && scrollPos < 78){
        currentCity = 'Buffalo';
      } else if(scrollPos > 94){
        currentCity = 'Newfoundland';
      }
      map.setFilter(citiesLayer, ['==', 'name', currentCity]);
      map.setLayoutProperty(citiesLayer, 'visibility', 'visible');

      const centerPoint = pointOnLine(scrollPos)
      const coords = centerPoint.coordinates;
      map.setCenter(coords);

      map.getSource('point').setData(centerPoint);
    }
  }, [map, scrollPos])

  // useEffect(() => {
  //   if (map && center) {
  //     // Update the map's center when the `center` prop changes
  //     // map.flyTo({
  //     //   center,
  //     //   zoom: 12 // You can adjust the zoom level as needed
  //     // });
  //     if(scrollPos === 99){
  //       map.flyTo({
  //         center: center],
  //         zoom: 12 // You can adjust the zoom level as needed
  //       });
  //     }
  //   }
    
  // }, [map, center]);

  return <div id="map-container" style={{ width: '100%', position: 'absolute' }} />;
};

export default Map;