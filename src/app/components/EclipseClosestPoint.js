import React, { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import totality from '../data/totality-better.json';
import totalityLocations from '../data/totality-locations.json';

const EclipseClosestPoint = ({ center }) => {
  const [closestPoint, setClosestPoint] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const coords = turf.point(center);

    // Assuming eclipsePathGeoJSON is the GeoJSON data
    const eclipsePath = totality.features[0].geometry.coordinates[0][0];
    console.log(eclipsePath)

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
  
  }, [center]);

  return (
    <div className="closest-point">
      <h2>nearest place: {totalityLocations[closestPoint.geometry.coordinates.join(',')]}</h2>
      {closestPoint && (
        <div>
          <p>Distance: {distance} miles</p>
          <p>Coordinates: {closestPoint.geometry.coordinates.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default EclipseClosestPoint;
