import React, { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import totality from '../data/totality-better.json';
import totalityLocations from '../data/totality-locations.json';

const EclipseClosestPoint = React.memo(({ userLocation, isTotality }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [closestPoint, setClosestPoint] = useState(null);
  const [distance, setDistance] = useState(null);
  const [map, setMap] = useState(null);
  const globeCenter = [-95.7129, 37.0902];

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w';

    if (!map) {
      const newMap = new mapboxgl.Map({
        container: 'map-bottom',
        style: 'mapbox://styles/caseymmiler/clthnthmt010c01qu6t6f5m6v',
        center: globeCenter,
        zoom: 4,
        cooperativeGestures: true
      });

      // Add GeoJSON layer to the map
      newMap.on('load', function () {

        let tmp = {
          "type": "Point",
          "coordinates": userLocation
        }

        newMap.addSource('path', {
          'type': 'geojson',
          'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                  'type': 'LineString',
                  'coordinates': [userLocation, userLocation]
              }
          }
        });

        newMap.addLayer({
          'id': 'path',
          'type': 'line',
          'source': 'path',
          'layout': {
              'line-join': 'round',
              'line-cap': 'round'
          },
          'paint': {
              'line-color': '#0077ff',
              'line-width': 3
          }
        });

        newMap.addSource('start', {
          'type': 'geojson',
          'data': tmp
        });
    
        newMap.addLayer({
            'id': 'start',
            'source': 'start',
            'type': 'circle',
            'paint': {
                'circle-radius': 5,
                'circle-color': '#0077ff',
                'circle-stroke-color': '#d9d9d9',
                'circle-stroke-width': 1,
                'circle-opacity': 1
            }
        });

        newMap.addSource('end', {
          'type': 'geojson',
          'data': userLocation
        });
    
        newMap.addLayer({
            'id': 'end',
            'source': 'end',
            'type': 'circle',
            'paint': {
                'circle-radius': 5,
                'circle-color': '#000',
                'circle-stroke-color': '#f7e305',
                'circle-stroke-width': 1,
                'circle-opacity': 1
            }
        });
      });

      if(window.innerWidth > 500){
        newMap.addControl(new mapboxgl.NavigationControl());
      }

      newMap.on('idle', () => {
        setMapLoaded(true);
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
  }, [map])

  useEffect(() => {
    console.log('ue userloc', userLocation)
    const coords = turf.point(userLocation);

    // Assuming eclipsePathGeoJSON is the GeoJSON data
    const eclipsePath = totality.features[0].geometry.coordinates[0][0];

    // Initialize minDistance and closestPoint
    let minDistance = Infinity;
    let nearestPoint = null;

    eclipsePath.forEach(point => {
      const eclipsePoint = turf.point(point);
      const dist = turf.distance(coords, eclipsePoint, { units: 'miles' });
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = eclipsePoint;
      }
    });

    setClosestPoint(nearestPoint);
    setDistance(Math.round(minDistance));
  
  }, [userLocation]);

  useEffect(() => {
    if(closestPoint){
      let start = {
        "type": "Point",
        "coordinates": userLocation
      }
      let coords = closestPoint.geometry.coordinates;
      if(isTotality){
        coords = userLocation;
      }
  
      let end = {
        "type": "Point",
        "coordinates": coords
      }
  
      let line = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'type': 'LineString',
            'coordinates': [userLocation, coords]
        }
      }
  
      if(map){
        map.fitBounds([
          [-125.94019177512125, 25.297250591566907], // Southwest coordinates 25.297250591566907, -125.94019177512125
          [-66.47653052524456, 50.07409975048268]  // Northeast coordinates 50.07409975048268, -66.47653052524456
        ]);
        const source = map.getSource('start');
        if(source){
          source.setData(start);
        }
        const source2 = map.getSource('end');
        if(source2){
          source2.setData(end);
        }
        const source3 = map.getSource('path');
        if(source3){
          source3.setData(line);
        }
      }
    }
    
  }, [mapLoaded, closestPoint]);

  return (
    <div className="closest-point">
      {closestPoint && !isTotality && (
        <p>The closest city on the path of totality to your current location is {distance} miles away in {totalityLocations[closestPoint.geometry.coordinates.join(',')].replace(', United States', '')}.</p>
      )}
      {isTotality &&
      <p>You are in the path of totality!</p>
      }
      <div id="map-bottom" />
    </div>
  );
});

EclipseClosestPoint.displayName = 'EclipseClosestPoint';

export default EclipseClosestPoint;
