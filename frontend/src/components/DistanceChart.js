import React, { useEffect } from 'react';
import * as d3 from 'd3';


const DistanceChart = ({ gpsData }) => {
    // Haversine formula: calculate the distance between two points on the surface of a sphere, such as the Earth.
    // given their latitude and longitude coordinates
    // https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
  
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
  
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
  
      return distance;
    };
  
    const deg2rad = (degrees) => {
      return degrees * (Math.PI / 180);
    };
  ////////////////////////////////////////////////////
      let totalElapsedTime = 0;
      let totalDistance = 0;
    for (let i = 0; i < gpsData.length - 1; i++) {
      const currentPoint = gpsData[i];
      const nextPoint = gpsData[i + 1];
      const segmentDistance = calculateDistance(
        currentPoint.latitude,
        currentPoint.longitude,
        nextPoint.latitude,
        nextPoint.longitude
      );
      totalDistance += segmentDistance;
      totalElapsedTime += parseFloat(currentPoint.elapsedTime);
    }
    const averageSpeed = totalDistance / (totalElapsedTime / gpsData.length);

    return (
      <div id="distance-chart">
        <svg width="250" height="100">
          <text x="150" y="50" textAnchor="middle" fill="white">
            Total Distance: {totalDistance.toFixed(2)} Km.
          </text>
          <text x="150" y="80" textAnchor="middle" fill="white">
          Average Speed: {averageSpeed.toFixed(2)} km/h
        </text>
        </svg>
      </div>
      
    );
  };

export default DistanceChart;