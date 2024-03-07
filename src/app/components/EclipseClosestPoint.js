import React, { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import totality from '../data/totality-better.json';
import totalityLocations from '../data/totality-locations.json';

const EclipseClosestPoint = ({ userLocation, isTotality }) => {
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
        zoom: 4
      });

      // Add GeoJSON layer to the map
      newMap.on('load', function () {

        newMap.fitBounds([
          [-125.94019177512125, 25.297250591566907], // Southwest coordinates 25.297250591566907, -125.94019177512125
          [-66.47653052524456, 50.07409975048268]  // Northeast coordinates 50.07409975048268, -66.47653052524456
        ]);

        newMap.scrollZoom.disable()

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
              'line-color': '#e60000',
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
                'circle-color': '#ff0080',
                'circle-stroke-color': '#fff',
                'circle-stroke-width': 1,
                'circle-opacity': 1
            }
        });

        newMap.addSource('end', {
          'type': 'geojson',
          'data': tmp
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
    setDistance(minDistance);

    let start = {
      "type": "Point",
      "coordinates": userLocation
    }

    let end = {
      "type": "Point",
      "coordinates": nearestPoint.geometry.coordinates
    }

    let line = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
          'type': 'LineString',
          'coordinates': [userLocation, nearestPoint.geometry.coordinates]
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
        console.log(line)
        source3.setData(line);
      }
    }

  
  }, [userLocation, map]);

  return (
    <div className="closest-point">
      {closestPoint && !isTotality && (
        <div>
          <h2>nearest place: {totalityLocations[closestPoint.geometry.coordinates.join(',')]}</h2>
          <p>Distance: {distance} miles</p>
          <p>Coordinates: {closestPoint.geometry.coordinates.join(', ')}</p>
        </div>
      )}
      {isTotality &&
      <p>You are in the path of totality!</p>
      }
      <div id="map-bottom" style={{ height: '900px', width: '100%', position: 'relative' }} />
    </div>
  );
};

export default EclipseClosestPoint;
