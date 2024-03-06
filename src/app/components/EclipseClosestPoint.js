import React, { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import totality from '../data/totality.json';
import mbxDirections from '@mapbox/mapbox-sdk/services/directions';

const mapboxClient = mbxDirections({ accessToken: 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w' });

const EclipseClosestPoint = ({ center }) => {
  console.log('xx')
  const [closestPoint, setClosestPoint] = useState(null);
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);

  useEffect(() => {
    const coords = turf.point(center);

    // Assuming eclipsePathGeoJSON is the GeoJSON data
    const eclipsePath = totality.features[0].geometry.coordinates[0];
    // console.log(eclipsePath)

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

    if (nearestPoint) {
      // Get driving time from Seattle to the closest point
      mapboxClient
        .getDirections({
          waypoints: [
            { coordinates: center },
            { coordinates: nearestPoint.geometry.coordinates } // Closest point
          ],
          profile: 'driving',
          overview: 'full'
        })
        .send()
        .then(response => {
          console.log('directions resp', response)
          const directions = response.body;
          const duration = directions.routes[0].duration; // Duration in seconds
          setTravelTime(duration / 3600); // Convert to hours
        })
        .catch(err => {
          console.error('Error fetching directions:', err);
        });
    }

  }, [center]);

  return (
    <div>
      <h2>Closest Point to x City on Eclipse Path</h2>
      {closestPoint && (
        <div>
          <p>Coordinates: {closestPoint.geometry.coordinates.join(', ')}</p>
          <p>Distance: {distance} miles</p>
          {travelTime && <p>Estimated driving time: {travelTime.toFixed(2)} hours</p>}
        </div>
      )}
    </div>
  );
};

export default EclipseClosestPoint;
